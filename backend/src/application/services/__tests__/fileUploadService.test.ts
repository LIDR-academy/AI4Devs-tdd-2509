import { Request, Response } from 'express';

// Mock completo de multer antes de cualquier importación
const mockDiskStorage = jest.fn();
const mockMulter = jest.fn();
const mockSingle = jest.fn();

// Mock de MulterError
class MockMulterError extends Error {
  code: string;
  field: string;
  constructor(code: string, field: string) {
    super(code);
    this.code = code;
    this.field = field;
    this.name = 'MulterError';
  }
}

// Configurar los mocks
jest.mock('multer', () => ({
  __esModule: true,
  default: Object.assign(mockMulter, {
    diskStorage: mockDiskStorage,
    MulterError: MockMulterError
  })
}));

// Importamos después de configurar los mocks
import multer from 'multer';
import { uploadFile } from '../fileUploadService';

describe('FileUploadService', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let mockUpload: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock response object
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {};
    mockResponse = {
      status: statusMock,
      json: jsonMock
    };

    // Setup multer mocks
    mockUpload = {
      single: jest.fn().mockReturnValue(mockSingle)
    };
    mockMulter.mockReturnValue(mockUpload);
  });

  describe('Configuración de storage', () => {
    let storageConfig: any;
    let destinationFn: any;
    let filenameFn: any;

    beforeEach(() => {
      jest.clearAllMocks();
      
      // Setup mock to capture storage configuration
      mockDiskStorage.mockImplementation((config) => {
        destinationFn = config.destination;
        filenameFn = config.filename;
        return config;
      });

      // Setup multer mock to capture configuration
      mockMulter.mockImplementation((config) => {
        storageConfig = config;
        return {
          single: jest.fn()
        };
      });

      // Re-import the module to trigger the configuration
      jest.resetModules();
      require('../fileUploadService');
    });

    it('debería configurar destination a ../uploads/', () => {
      // Arrange
      const cbMock = jest.fn();
      
      // Act
      destinationFn(null, null, cbMock);

      // Assert
      expect(mockDiskStorage).toHaveBeenCalled();
      expect(cbMock).toHaveBeenCalledWith(null, '../uploads/');
    });

    it('debería generar filename con timestamp y nombre original', () => {
      // Arrange
      const mockFile = { originalname: 'cv.pdf' };
      const mockDate = 1234567890;
      const cbMock = jest.fn();

      jest.spyOn(Date, 'now').mockReturnValue(mockDate);

      // Act
      filenameFn(null, mockFile, cbMock);

      // Assert
      expect(cbMock).toHaveBeenCalledWith(null, `${mockDate}-cv.pdf`);
    });
  });

  describe('fileFilter', () => {
    let fileFilterFn: any;

    beforeEach(() => {
      jest.clearAllMocks();
      
      // Setup the mock to capture the fileFilter function
      mockMulter.mockImplementation((config) => {
        fileFilterFn = config.fileFilter;
        return {
          single: jest.fn()
        };
      });

      // Re-import to trigger configuration
      jest.resetModules();
      require('../fileUploadService');
    });

    it('debería aceptar archivos PDF (application/pdf)', () => {
      // Arrange
      const mockFile = {
        mimetype: 'application/pdf',
        originalname: 'document.pdf'
      } as Express.Multer.File;

      const cbMock = jest.fn();

      // Act
      fileFilterFn(mockRequest, mockFile, cbMock);

      // Assert
      expect(cbMock).toHaveBeenCalledWith(null, true);
    });

    it('debería aceptar archivos DOCX', () => {
      // Arrange
      const mockFile = {
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        originalname: 'document.docx'
      } as Express.Multer.File;

      const cbMock = jest.fn();

      // Act
      fileFilterFn(mockRequest, mockFile, cbMock);

      // Assert
      expect(cbMock).toHaveBeenCalledWith(null, true);
    });

    it('debería rechazar otros tipos de archivo', () => {
      // Arrange
      const mockFile = {
        mimetype: 'image/jpeg',
        originalname: 'photo.jpg'
      } as Express.Multer.File;

      const cbMock = jest.fn();

      // Act
      fileFilterFn(mockRequest, mockFile, cbMock);

      // Assert
      expect(cbMock).toHaveBeenCalledWith(null, false);
    });

    it('debería llamar callback con true para archivos válidos', () => {
      // Arrange
      const mockFile = {
        mimetype: 'application/pdf',
        originalname: 'cv.pdf'
      } as Express.Multer.File;

      const cbMock = jest.fn();

      // Act
      fileFilterFn(mockRequest, mockFile, cbMock);

      // Assert
      expect(cbMock).toHaveBeenCalledWith(null, true);
      expect(cbMock).not.toHaveBeenCalledWith(null, false);
    });

    it('debería llamar callback con false para archivos inválidos', () => {
      // Arrange
      const mockFile = {
        mimetype: 'text/plain',
        originalname: 'document.txt'
      } as Express.Multer.File;

      const cbMock = jest.fn();

      // Act
      fileFilterFn(mockRequest, mockFile, cbMock);

      // Assert
      expect(cbMock).toHaveBeenCalledWith(null, false);
      expect(cbMock).not.toHaveBeenCalledWith(null, true);
    });
  });

  describe('uploadFile', () => {
    it('debería retornar 200 con filePath y fileType en éxito', () => {
      // Arrange
      jest.clearAllMocks();
      
      const mockFile = {
        path: '../uploads/1234567890-cv.pdf',
        mimetype: 'application/pdf',
        originalname: 'cv.pdf'
      };

      const mockSingleFn = jest.fn((req, res, callback) => {
        req.file = mockFile;
        callback(null);
      });

      const mockUploadLocal = {
        single: jest.fn().mockReturnValue(mockSingleFn)
      };
      
      mockMulter.mockReturnValue(mockUploadLocal);

      // Re-import to trigger configuration
      jest.resetModules();
      const { uploadFile } = require('../fileUploadService');

      // Act
      uploadFile(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        filePath: mockFile.path,
        fileType: mockFile.mimetype
      });
    });

    it('debería retornar 500 con mensaje de error para MulterError', () => {
      // Arrange
      jest.clearAllMocks();
      
      const multerError = new MockMulterError('LIMIT_FILE_SIZE', 'file');

      const mockSingleFn = jest.fn((req, res, callback) => {
        callback(multerError);
      });

      const mockUploadLocal = {
        single: jest.fn().mockReturnValue(mockSingleFn)
      };
      
      mockMulter.mockReturnValue(mockUploadLocal);

      // Re-import to trigger configuration
      jest.resetModules();
      const { uploadFile } = require('../fileUploadService');

      // Act
      uploadFile(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: multerError.message
      });
    });

    it('debería retornar 500 para otros errores', () => {
      // Arrange
      jest.clearAllMocks();
      
      const genericError = new Error('File system error');

      const mockSingleFn = jest.fn((req, res, callback) => {
        callback(genericError);
      });

      const mockUploadLocal = {
        single: jest.fn().mockReturnValue(mockSingleFn)
      };
      
      mockMulter.mockReturnValue(mockUploadLocal);

      // Re-import to trigger configuration
      jest.resetModules();
      const { uploadFile } = require('../fileUploadService');

      // Act
      uploadFile(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'File system error'
      });
    });

    it('debería retornar 400 si no hay archivo (rechazado por filtro)', () => {
      // Arrange
      jest.clearAllMocks();
      
      const mockSingleFn = jest.fn((req, res, callback) => {
        callback(null);
      });

      const mockUploadLocal = {
        single: jest.fn().mockReturnValue(mockSingleFn)
      };
      
      mockMulter.mockReturnValue(mockUploadLocal);

      // Re-import to trigger configuration
      jest.resetModules();
      const { uploadFile } = require('../fileUploadService');

      // Act
      uploadFile(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid file type, only PDF and DOCX are allowed!'
      });
    });

    it('debería verificar límite de tamaño (10MB)', () => {
      // Arrange
      jest.clearAllMocks();
      let capturedConfig: any;

      mockMulter.mockImplementation((config) => {
        capturedConfig = config;
        return {
          single: jest.fn()
        };
      });

      // Re-import to trigger configuration
      jest.resetModules();
      require('../fileUploadService');

      // Assert
      expect(mockMulter).toHaveBeenCalled();
      expect(capturedConfig.limits).toBeDefined();
      expect(capturedConfig.limits.fileSize).toBe(10 * 1024 * 1024); // 10MB in bytes
    });
  });
});
