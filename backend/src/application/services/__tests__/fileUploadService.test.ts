import { Request, Response } from 'express';
import multer from 'multer';
import { uploadFile } from '../fileUploadService';

// Mock multer
jest.mock('multer');

describe('FileUploadService', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

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
  });

  describe('Configuración de storage', () => {
    it('debería configurar destination a ../uploads/', () => {
      // Arrange
      const mockDiskStorage = multer.diskStorage as jest.Mock;

      // Act
      // Importar el módulo fuerza la ejecución del código de configuración
      require('../fileUploadService');

      // Assert
      expect(mockDiskStorage).toHaveBeenCalled();
      const storageConfig = mockDiskStorage.mock.calls[0][0];

      const cbMock = jest.fn();
      storageConfig.destination(null, null, cbMock);

      expect(cbMock).toHaveBeenCalledWith(null, '../uploads/');
    });

    it('debería generar filename con timestamp y nombre original', () => {
      // Arrange
      const mockDiskStorage = multer.diskStorage as jest.Mock;
      const mockFile = { originalname: 'cv.pdf' };
      const mockDate = 1234567890;

      jest.spyOn(Date, 'now').mockReturnValue(mockDate);

      // Act
      require('../fileUploadService');

      // Assert
      const storageConfig = mockDiskStorage.mock.calls[0][0];
      const cbMock = jest.fn();
      storageConfig.filename(null, mockFile, cbMock);

      expect(cbMock).toHaveBeenCalledWith(null, `${mockDate}-cv.pdf`);
    });
  });

  describe('fileFilter', () => {
    let mockFileFilter: any;

    beforeEach(() => {
      const mockDiskStorage = multer.diskStorage as jest.Mock;
      require('../fileUploadService');

      // Get the multer mock call to extract the config
      const multerMock = (multer as unknown as jest.Mock);
      if (multerMock.mock && multerMock.mock.calls.length > 0) {
        const config = multerMock.mock.calls[0][0];
        mockFileFilter = config.fileFilter;
      }
    });

    it('debería aceptar archivos PDF (application/pdf)', () => {
      // Arrange
      const mockFile = {
        mimetype: 'application/pdf',
        originalname: 'document.pdf'
      } as Express.Multer.File;

      const cbMock = jest.fn();

      // Act
      if (mockFileFilter) {
        mockFileFilter(mockRequest, mockFile, cbMock);
      }

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
      if (mockFileFilter) {
        mockFileFilter(mockRequest, mockFile, cbMock);
      }

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
      if (mockFileFilter) {
        mockFileFilter(mockRequest, mockFile, cbMock);
      }

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
      if (mockFileFilter) {
        mockFileFilter(mockRequest, mockFile, cbMock);
      }

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
      if (mockFileFilter) {
        mockFileFilter(mockRequest, mockFile, cbMock);
      }

      // Assert
      expect(cbMock).toHaveBeenCalledWith(null, false);
      expect(cbMock).not.toHaveBeenCalledWith(null, true);
    });
  });

  describe('uploadFile', () => {
    it('debería retornar 200 con filePath y fileType en éxito', () => {
      // Arrange
      const mockFile = {
        path: '../uploads/1234567890-cv.pdf',
        mimetype: 'application/pdf',
        originalname: 'cv.pdf'
      };

      mockRequest.file = mockFile as Express.Multer.File;

      const mockSingleFn = jest.fn((req, res, callback) => {
        callback(null);
      });

      const mockUpload = {
        single: jest.fn().mockReturnValue(mockSingleFn)
      };

      (multer as unknown as jest.Mock).mockReturnValue(mockUpload);

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
      const multerError = new multer.MulterError('LIMIT_FILE_SIZE', 'file');

      const mockSingleFn = jest.fn((req, res, callback) => {
        callback(multerError);
      });

      const mockUpload = {
        single: jest.fn().mockReturnValue(mockSingleFn)
      };

      (multer as unknown as jest.Mock).mockReturnValue(mockUpload);

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
      const genericError = new Error('File system error');

      const mockSingleFn = jest.fn((req, res, callback) => {
        callback(genericError);
      });

      const mockUpload = {
        single: jest.fn().mockReturnValue(mockSingleFn)
      };

      (multer as unknown as jest.Mock).mockReturnValue(mockUpload);

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
      mockRequest.file = undefined;

      const mockSingleFn = jest.fn((req, res, callback) => {
        callback(null);
      });

      const mockUpload = {
        single: jest.fn().mockReturnValue(mockSingleFn)
      };

      (multer as unknown as jest.Mock).mockReturnValue(mockUpload);

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
      const multerMock = (multer as unknown as jest.Mock);

      // Act
      require('../fileUploadService');

      // Assert
      expect(multerMock).toHaveBeenCalled();
      const config = multerMock.mock.calls[0][0];
      expect(config.limits).toBeDefined();
      expect(config.limits.fileSize).toBe(10 * 1024 * 1024); // 10MB in bytes
    });
  });
});
