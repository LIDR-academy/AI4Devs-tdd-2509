// Create a shared mock instance
const mockPrismaInstance = {
  resume: {
    create: jest.fn()
  }
};

// Mock PrismaClient before importing Resume
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaInstance)
  };
});

// Import Resume AFTER mocking PrismaClient
import { Resume } from '../Resume';

describe('Resume', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    // Use the shared mock instance
    mockPrisma = mockPrismaInstance;
  });

  describe('Constructor', () => {
    it('debería crear instancia con datos completos', () => {
      // Arrange
      const data = {
        id: 1,
        candidateId: 42,
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf'
      };

      // Act
      const resume = new Resume(data);

      // Assert
      expect(resume.id).toBe(1);
      expect(resume.candidateId).toBe(42);
      expect(resume.filePath).toBe('/uploads/cv.pdf');
      expect(resume.fileType).toBe('application/pdf');
    });

    it('debería inicializar uploadDate con fecha actual', () => {
      // Arrange
      const beforeCreation = new Date();
      const data = {
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf'
      };

      // Act
      const resume = new Resume(data);
      const afterCreation = new Date();

      // Assert
      expect(resume.uploadDate).toBeInstanceOf(Date);
      expect(resume.uploadDate.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(resume.uploadDate.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });

    it('debería manejar datos undefined con operador ?', () => {
      // Arrange
      const data = undefined;

      // Act
      const resume = new Resume(data);

      // Assert
      expect(resume.id).toBeUndefined();
      expect(resume.candidateId).toBeUndefined();
      expect(resume.filePath).toBeUndefined();
      expect(resume.fileType).toBeUndefined();
      expect(resume.uploadDate).toBeInstanceOf(Date);
    });
  });

  describe('save()', () => {
    it('debería llamar a create() si no tiene id', async () => {
      // Arrange
      const data = {
        candidateId: 1,
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf'
      };

      const createdResume = {
        id: 1,
        candidateId: 1,
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf',
        uploadDate: new Date()
      };

      mockPrisma.resume.create.mockResolvedValue(createdResume);

      const resume = new Resume(data);

      // Act
      const result = await resume.save();

      // Assert
      expect(mockPrisma.resume.create).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Resume);
    });

    it('debería lanzar error si intenta actualizar (id existe)', async () => {
      // Arrange
      const data = {
        id: 1,
        candidateId: 1,
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf'
      };

      const resume = new Resume(data);

      // Act & Assert
      await expect(resume.save()).rejects.toThrow('No se permite la actualización de un currículum existente');
    });

    it('debería incluir mensaje específico de error para actualización', async () => {
      // Arrange
      const data = {
        id: 999,
        candidateId: 1,
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf'
      };

      const resume = new Resume(data);

      // Act & Assert
      await expect(resume.save()).rejects.toThrow('No se permite la actualización de un currículum existente');
    });
  });

  describe('create()', () => {
    it('debería llamar a prisma.resume.create con datos correctos', async () => {
      // Arrange
      const data = {
        candidateId: 123,
        filePath: '/uploads/resume.pdf',
        fileType: 'application/pdf'
      };

      const createdResume = {
        id: 1,
        candidateId: 123,
        filePath: '/uploads/resume.pdf',
        fileType: 'application/pdf',
        uploadDate: new Date()
      };

      mockPrisma.resume.create.mockResolvedValue(createdResume);

      const resume = new Resume(data);

      // Act
      await resume.save();

      // Assert
      expect(mockPrisma.resume.create).toHaveBeenCalledWith({
        data: {
          candidateId: 123,
          filePath: '/uploads/resume.pdf',
          fileType: 'application/pdf',
          uploadDate: expect.any(Date)
        }
      });
    });

    it('debería retornar instancia de Resume creada', async () => {
      // Arrange
      const data = {
        candidateId: 1,
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf'
      };

      const createdResume = {
        id: 1,
        candidateId: 1,
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf',
        uploadDate: new Date()
      };

      mockPrisma.resume.create.mockResolvedValue(createdResume);

      const resume = new Resume(data);

      // Act
      const result = await resume.save();

      // Assert
      expect(result).toBeInstanceOf(Resume);
      expect(result.id).toBe(1);
      expect(result.candidateId).toBe(1);
      expect(result.filePath).toBe('/uploads/cv.pdf');
      expect(result.fileType).toBe('application/pdf');
    });

    it('debería manejar errores de Prisma', async () => {
      // Arrange
      const data = {
        candidateId: 1,
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf'
      };

      const error = new Error('Database error');
      mockPrisma.resume.create.mockRejectedValue(error);

      const resume = new Resume(data);

      // Act & Assert
      await expect(resume.save()).rejects.toThrow(error);
    });
  });
});
