import { WorkExperience } from '../WorkExperience';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    workExperience: {
      create: jest.fn(),
      update: jest.fn()
    }
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

describe('WorkExperience', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    // Get the mocked Prisma instance
    mockPrisma = new PrismaClient();
  });

  describe('Constructor', () => {
    it('debería crear instancia con datos completos', () => {
      // Arrange
      const data = {
        id: 1,
        company: 'Tech Corp',
        position: 'Software Developer',
        description: 'Desarrollo de aplicaciones web',
        startDate: '2020-01-01',
        endDate: '2023-12-31',
        candidateId: 1
      };

      // Act
      const workExperience = new WorkExperience(data);

      // Assert
      expect(workExperience.id).toBe(1);
      expect(workExperience.company).toBe('Tech Corp');
      expect(workExperience.position).toBe('Software Developer');
      expect(workExperience.description).toBe('Desarrollo de aplicaciones web');
      expect(workExperience.candidateId).toBe(1);
    });

    it('debería convertir startDate a objeto Date', () => {
      // Arrange
      const data = {
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020-01-01'
      };

      // Act
      const workExperience = new WorkExperience(data);

      // Assert
      expect(workExperience.startDate).toBeInstanceOf(Date);
      expect(workExperience.startDate.toISOString()).toContain('2020-01-01');
    });

    it('debería convertir endDate a objeto Date si existe', () => {
      // Arrange
      const data = {
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020-01-01',
        endDate: '2023-12-31'
      };

      // Act
      const workExperience = new WorkExperience(data);

      // Assert
      expect(workExperience.endDate).toBeInstanceOf(Date);
      expect(workExperience.endDate?.toISOString()).toContain('2023-12-31');
    });

    it('debería manejar campos opcionales (description, endDate)', () => {
      // Arrange
      const dataWithoutOptionals = {
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020-01-01'
      };

      const dataWithOptionals = {
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Software development',
        startDate: '2020-01-01',
        endDate: '2023-12-31'
      };

      // Act
      const workExpWithoutOptionals = new WorkExperience(dataWithoutOptionals);
      const workExpWithOptionals = new WorkExperience(dataWithOptionals);

      // Assert
      expect(workExpWithoutOptionals.description).toBeUndefined();
      expect(workExpWithoutOptionals.endDate).toBeUndefined();
      expect(workExpWithOptionals.description).toBe('Software development');
      expect(workExpWithOptionals.endDate).toBeInstanceOf(Date);
    });

    it('debería asignar candidateId si se proporciona', () => {
      // Arrange
      const data = {
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020-01-01',
        candidateId: 42
      };

      // Act
      const workExperience = new WorkExperience(data);

      // Assert
      expect(workExperience.candidateId).toBe(42);
    });
  });

  describe('save() - Creación', () => {
    it('debería llamar a prisma.workExperience.create', async () => {
      // Arrange
      const data = {
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Software development',
        startDate: '2020-01-01',
        endDate: '2023-12-31'
      };

      const createdWorkExperience = {
        id: 1,
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Software development',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31'),
        candidateId: null
      };

      mockPrisma.workExperience.create.mockResolvedValue(createdWorkExperience);

      const workExperience = new WorkExperience(data);

      // Act
      await workExperience.save();

      // Assert
      expect(mockPrisma.workExperience.create).toHaveBeenCalledWith({
        data: {
          company: 'Tech Corp',
          position: 'Developer',
          description: 'Software development',
          startDate: expect.any(Date),
          endDate: expect.any(Date)
        }
      });
    });

    it('debería incluir candidateId si está definido', async () => {
      // Arrange
      const data = {
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020-01-01',
        candidateId: 123
      };

      const createdWorkExperience = {
        id: 1,
        company: 'Tech Corp',
        position: 'Developer',
        description: undefined,
        startDate: new Date('2020-01-01'),
        endDate: undefined,
        candidateId: 123
      };

      mockPrisma.workExperience.create.mockResolvedValue(createdWorkExperience);

      const workExperience = new WorkExperience(data);

      // Act
      await workExperience.save();

      // Assert
      expect(mockPrisma.workExperience.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          candidateId: 123
        })
      });
    });

    it('debería incluir description si está definida', async () => {
      // Arrange
      const data = {
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Full stack development',
        startDate: '2020-01-01'
      };

      const createdWorkExperience = {
        id: 1,
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Full stack development',
        startDate: new Date('2020-01-01'),
        endDate: undefined,
        candidateId: null
      };

      mockPrisma.workExperience.create.mockResolvedValue(createdWorkExperience);

      const workExperience = new WorkExperience(data);

      // Act
      await workExperience.save();

      // Assert
      expect(mockPrisma.workExperience.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          description: 'Full stack development'
        })
      });
    });

    it('debería retornar experiencia creada', async () => {
      // Arrange
      const data = {
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020-01-01'
      };

      const createdWorkExperience = {
        id: 1,
        company: 'Tech Corp',
        position: 'Developer',
        description: undefined,
        startDate: new Date('2020-01-01'),
        endDate: undefined,
        candidateId: null
      };

      mockPrisma.workExperience.create.mockResolvedValue(createdWorkExperience);

      const workExperience = new WorkExperience(data);

      // Act
      const result = await workExperience.save();

      // Assert
      expect(result).toEqual(createdWorkExperience);
      expect(result.id).toBe(1);
    });
  });

  describe('save() - Actualización', () => {
    it('debería llamar a prisma.workExperience.update cuando id existe', async () => {
      // Arrange
      const data = {
        id: 1,
        company: 'Tech Corp Updated',
        position: 'Senior Developer',
        startDate: '2020-01-01',
        endDate: '2023-12-31'
      };

      const updatedWorkExperience = {
        id: 1,
        company: 'Tech Corp Updated',
        position: 'Senior Developer',
        description: undefined,
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31'),
        candidateId: null
      };

      mockPrisma.workExperience.update.mockResolvedValue(updatedWorkExperience);

      const workExperience = new WorkExperience(data);

      // Act
      await workExperience.save();

      // Assert
      expect(mockPrisma.workExperience.update).toHaveBeenCalled();
      expect(mockPrisma.workExperience.create).not.toHaveBeenCalled();
    });

    it('debería usar where: { id } correcto', async () => {
      // Arrange
      const data = {
        id: 456,
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020-01-01'
      };

      const updatedWorkExperience = {
        id: 456,
        company: 'Tech Corp',
        position: 'Developer',
        description: undefined,
        startDate: new Date('2020-01-01'),
        endDate: undefined,
        candidateId: null
      };

      mockPrisma.workExperience.update.mockResolvedValue(updatedWorkExperience);

      const workExperience = new WorkExperience(data);

      // Act
      await workExperience.save();

      // Assert
      expect(mockPrisma.workExperience.update).toHaveBeenCalledWith({
        where: { id: 456 },
        data: expect.any(Object)
      });
    });

    it('debería incluir todos los campos', async () => {
      // Arrange
      const data = {
        id: 1,
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Full stack development',
        startDate: '2020-01-01',
        endDate: '2023-12-31',
        candidateId: 123
      };

      const updatedWorkExperience = {
        id: 1,
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Full stack development',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31'),
        candidateId: 123
      };

      mockPrisma.workExperience.update.mockResolvedValue(updatedWorkExperience);

      const workExperience = new WorkExperience(data);

      // Act
      await workExperience.save();

      // Assert
      expect(mockPrisma.workExperience.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          company: 'Tech Corp',
          position: 'Developer',
          description: 'Full stack development',
          startDate: expect.any(Date),
          endDate: expect.any(Date),
          candidateId: 123
        }
      });
    });

    it('debería manejar errores de Prisma', async () => {
      // Arrange
      const data = {
        id: 999,
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020-01-01'
      };

      const error = new Error('Database error');
      mockPrisma.workExperience.update.mockRejectedValue(error);

      const workExperience = new WorkExperience(data);

      // Act & Assert
      await expect(workExperience.save()).rejects.toThrow(error);
    });
  });
});
