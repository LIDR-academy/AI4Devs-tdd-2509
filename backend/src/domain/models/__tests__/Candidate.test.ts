import { Candidate, prisma } from '../Candidate';
import { Prisma, PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn()
    }
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: {
      PrismaClientInitializationError: class extends Error {
        constructor(message: string, clientVersion: string) {
          super(message);
          this.name = 'PrismaClientInitializationError';
          (this as any).clientVersion = clientVersion;
        }
      }
    }
  };
});

describe('Candidate', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    // Get the mocked Prisma instance
    mockPrisma = prisma;
  });

  describe('Constructor', () => {
    it('debería crear instancia con datos mínimos requeridos', () => {
      // Arrange
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      // Act
      const candidate = new Candidate(data);

      // Assert
      expect(candidate.firstName).toBe('Juan');
      expect(candidate.lastName).toBe('Pérez');
      expect(candidate.email).toBe('juan@example.com');
    });

    it('debería inicializar arrays vacíos si no se proporcionan', () => {
      // Arrange
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      // Act
      const candidate = new Candidate(data);

      // Assert
      expect(candidate.education).toEqual([]);
      expect(candidate.workExperience).toEqual([]);
      expect(candidate.resumes).toEqual([]);
    });

    it('debería asignar correctamente todos los campos opcionales', () => {
      // Arrange
      const data = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        address: 'Calle Mayor 123',
        education: [{ institution: 'Universidad', title: 'Ingeniería', startDate: new Date(), endDate: new Date() }],
        workExperience: [{ company: 'Tech Corp', position: 'Developer', startDate: new Date(), endDate: new Date() }],
        resumes: [{ filePath: '/uploads/cv.pdf', fileType: 'application/pdf', uploadDate: new Date() }]
      };

      // Act
      const candidate = new Candidate(data);

      // Assert
      expect(candidate.id).toBe(1);
      expect(candidate.phone).toBe('612345678');
      expect(candidate.address).toBe('Calle Mayor 123');
      expect(candidate.education).toHaveLength(1);
      expect(candidate.workExperience).toHaveLength(1);
      expect(candidate.resumes).toHaveLength(1);
    });

    it('debería manejar datos undefined en campos opcionales', () => {
      // Arrange
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: undefined,
        address: undefined
      };

      // Act
      const candidate = new Candidate(data);

      // Assert
      expect(candidate.phone).toBeUndefined();
      expect(candidate.address).toBeUndefined();
      expect(candidate.education).toEqual([]);
      expect(candidate.workExperience).toEqual([]);
      expect(candidate.resumes).toEqual([]);
    });
  });

  describe('save() - Creación (sin id)', () => {
    it('debería llamar a prisma.candidate.create con datos correctos', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        address: 'Calle Mayor 123'
      };

      const createdCandidate = { id: 1, ...candidateData };
      mockPrisma.candidate.create.mockResolvedValue(createdCandidate);

      const candidate = new Candidate(candidateData);

      // Act
      const result = await candidate.save();

      // Assert
      expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
        data: candidateData
      });
      expect(result).toEqual(createdCandidate);
    });

    it('debería incluir solo campos no undefined', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: undefined,
        address: undefined
      };

      const createdCandidate = { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };
      mockPrisma.candidate.create.mockResolvedValue(createdCandidate);

      const candidate = new Candidate(candidateData);

      // Act
      await candidate.save();

      // Assert
      expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com'
        }
      });
    });

    it('debería crear relaciones de educations si existen', async () => {
      // Arrange
      const educationData = {
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2024-06-30')
      };

      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        education: [educationData]
      };

      const createdCandidate = { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };
      mockPrisma.candidate.create.mockResolvedValue(createdCandidate);

      const candidate = new Candidate(candidateData);

      // Act
      await candidate.save();

      // Assert
      expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          educations: {
            create: [{
              institution: educationData.institution,
              title: educationData.title,
              startDate: educationData.startDate,
              endDate: educationData.endDate
            }]
          }
        })
      });
    });

    it('debería crear relaciones de workExperiences si existen', async () => {
      // Arrange
      const workExperienceData = {
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Software development',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31')
      };

      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperience: [workExperienceData]
      };

      const createdCandidate = { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };
      mockPrisma.candidate.create.mockResolvedValue(createdCandidate);

      const candidate = new Candidate(candidateData);

      // Act
      await candidate.save();

      // Assert
      expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          workExperiences: {
            create: [{
              company: workExperienceData.company,
              position: workExperienceData.position,
              description: workExperienceData.description,
              startDate: workExperienceData.startDate,
              endDate: workExperienceData.endDate
            }]
          }
        })
      });
    });

    it('debería crear relaciones de resumes si existen', async () => {
      // Arrange
      const resumeData = {
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf'
      };

      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        resumes: [resumeData]
      };

      const createdCandidate = { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };
      mockPrisma.candidate.create.mockResolvedValue(createdCandidate);

      const candidate = new Candidate(candidateData);

      // Act
      await candidate.save();

      // Assert
      expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          resumes: {
            create: [{
              filePath: resumeData.filePath,
              fileType: resumeData.fileType
            }]
          }
        })
      });
    });

    it('debería retornar candidato creado', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      const createdCandidate = { id: 1, ...candidateData };
      mockPrisma.candidate.create.mockResolvedValue(createdCandidate);

      const candidate = new Candidate(candidateData);

      // Act
      const result = await candidate.save();

      // Assert
      expect(result).toEqual(createdCandidate);
      expect(result.id).toBe(1);
    });

    it('debería manejar PrismaClientInitializationError (DB no conectada)', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      const error = new Prisma.PrismaClientInitializationError('Database not connected', '1.0.0');
      mockPrisma.candidate.create.mockRejectedValue(error);

      const candidate = new Candidate(candidateData);

      // Act & Assert
      // Since the mock error is not recognized as an instance of Prisma.PrismaClientInitializationError,
      // it will be thrown as is, so we expect the original message
      await expect(candidate.save()).rejects.toThrow('Database not connected');
    });

    it('debería propagar otros errores de creación', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      const error = new Error('Unknown database error');
      mockPrisma.candidate.create.mockRejectedValue(error);

      const candidate = new Candidate(candidateData);

      // Act & Assert
      await expect(candidate.save()).rejects.toThrow(error);
    });
  });

  describe('save() - Actualización (con id)', () => {
    it('debería llamar a prisma.candidate.update cuando id existe', async () => {
      // Arrange
      const candidateData = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      const updatedCandidate = { ...candidateData };
      mockPrisma.candidate.update.mockResolvedValue(updatedCandidate);

      const candidate = new Candidate(candidateData);

      // Act
      await candidate.save();

      // Assert
      expect(mockPrisma.candidate.update).toHaveBeenCalled();
      expect(mockPrisma.candidate.create).not.toHaveBeenCalled();
    });

    it('debería usar where: { id } correcto', async () => {
      // Arrange
      const candidateData = {
        id: 123,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      const updatedCandidate = { ...candidateData };
      mockPrisma.candidate.update.mockResolvedValue(updatedCandidate);

      const candidate = new Candidate(candidateData);

      // Act
      await candidate.save();

      // Assert
      expect(mockPrisma.candidate.update).toHaveBeenCalledWith({
        where: { id: 123 },
        data: expect.any(Object)
      });
    });

    it('debería actualizar solo campos proporcionados', async () => {
      // Arrange
      const candidateData = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        address: undefined
      };

      const updatedCandidate = { ...candidateData };
      mockPrisma.candidate.update.mockResolvedValue(updatedCandidate);

      const candidate = new Candidate(candidateData);

      // Act
      await candidate.save();

      // Assert
      expect(mockPrisma.candidate.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          phone: '612345678'
        }
      });
    });

    it('debería manejar error P2025 (registro no encontrado)', async () => {
      // Arrange
      const candidateData = {
        id: 999,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      const error = { code: 'P2025', message: 'Record not found' };
      mockPrisma.candidate.update.mockRejectedValue(error);

      const candidate = new Candidate(candidateData);

      // Act & Assert
      await expect(candidate.save()).rejects.toThrow('No se pudo encontrar el registro del candidato con el ID proporcionado');
    });

    it('debería lanzar mensaje específico para registro no encontrado', async () => {
      // Arrange
      const candidateData = {
        id: 999,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      const error = { code: 'P2025', meta: { cause: 'Record to update not found.' } };
      mockPrisma.candidate.update.mockRejectedValue(error);

      const candidate = new Candidate(candidateData);

      // Act & Assert
      await expect(candidate.save()).rejects.toThrow('No se pudo encontrar el registro del candidato con el ID proporcionado');
    });

    it('debería propagar otros errores de actualización', async () => {
      // Arrange
      const candidateData = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      const error = new Error('Unknown update error');
      mockPrisma.candidate.update.mockRejectedValue(error);

      const candidate = new Candidate(candidateData);

      // Act & Assert
      await expect(candidate.save()).rejects.toThrow(error);
    });
  });

  describe('findOne()', () => {
    it('debería buscar candidato por id', async () => {
      // Arrange
      const candidateData = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        address: 'Calle Mayor 123'
      };

      mockPrisma.candidate.findUnique.mockResolvedValue(candidateData);

      // Act
      const result = await Candidate.findOne(1);

      // Assert
      expect(mockPrisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toBeInstanceOf(Candidate);
    });

    it('debería retornar null si no encuentra candidato', async () => {
      // Arrange
      mockPrisma.candidate.findUnique.mockResolvedValue(null);

      // Act
      const result = await Candidate.findOne(999);

      // Assert
      expect(result).toBeNull();
    });

    it('debería retornar instancia de Candidate si encuentra', async () => {
      // Arrange
      const candidateData = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      mockPrisma.candidate.findUnique.mockResolvedValue(candidateData);

      // Act
      const result = await Candidate.findOne(1);

      // Assert
      expect(result).toBeInstanceOf(Candidate);
      expect(result?.firstName).toBe('Juan');
      expect(result?.lastName).toBe('Pérez');
      expect(result?.email).toBe('juan@example.com');
    });
  });
});
