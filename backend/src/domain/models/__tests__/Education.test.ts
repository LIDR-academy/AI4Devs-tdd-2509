// Mock PrismaClient - debe estar antes de cualquier importación que lo use
const mockEducation = {
  create: jest.fn(),
  update: jest.fn()
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    education: mockEducation
  }))
}));

import { Education } from '../Education';
import { PrismaClient } from '@prisma/client';

describe('Education', () => {
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
        institution: 'Universidad Politécnica',
        title: 'Ingeniería Informática',
        startDate: '2020-09-01',
        endDate: '2024-06-30',
        candidateId: 1
      };

      // Act
      const education = new Education(data);

      // Assert
      expect(education.id).toBe(1);
      expect(education.institution).toBe('Universidad Politécnica');
      expect(education.title).toBe('Ingeniería Informática');
      expect(education.candidateId).toBe(1);
    });

    it('debería convertir startDate a objeto Date', () => {
      // Arrange
      const data = {
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: '2020-09-01'
      };

      // Act
      const education = new Education(data);

      // Assert
      expect(education.startDate).toBeInstanceOf(Date);
      expect(education.startDate.toISOString()).toContain('2020-09-01');
    });

    it('debería convertir endDate a objeto Date si existe', () => {
      // Arrange
      const data = {
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: '2020-09-01',
        endDate: '2024-06-30'
      };

      // Act
      const education = new Education(data);

      // Assert
      expect(education.endDate).toBeInstanceOf(Date);
      expect(education.endDate?.toISOString()).toContain('2024-06-30');
    });

    it('debería manejar endDate undefined', () => {
      // Arrange
      const data = {
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: '2020-09-01',
        endDate: undefined
      };

      // Act
      const education = new Education(data);

      // Assert
      expect(education.endDate).toBeUndefined();
    });

    it('debería asignar candidateId si se proporciona', () => {
      // Arrange
      const data = {
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: '2020-09-01',
        candidateId: 42
      };

      // Act
      const education = new Education(data);

      // Assert
      expect(education.candidateId).toBe(42);
    });
  });

  describe('save() - Creación', () => {
    it('debería llamar a prisma.education.create', async () => {
      // Arrange
      const data = {
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: '2020-09-01',
        endDate: '2024-06-30'
      };

      const createdEducation = {
        id: 1,
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2024-06-30'),
        candidateId: null
      };

      mockEducation.create.mockResolvedValue(createdEducation);

      const education = new Education(data);

      // Act
      await education.save();

      // Assert
      expect(mockEducation.create).toHaveBeenCalledWith({
        data: {
          institution: 'Universidad',
          title: 'Ingeniería',
          startDate: expect.any(Date),
          endDate: expect.any(Date)
        }
      });
    });

    it('debería incluir candidateId si está definido', async () => {
      // Arrange
      const data = {
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: '2020-09-01',
        candidateId: 123
      };

      const createdEducation = {
        id: 1,
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: new Date('2020-09-01'),
        endDate: undefined,
        candidateId: 123
      };

      mockEducation.create.mockResolvedValue(createdEducation);

      const education = new Education(data);

      // Act
      await education.save();

      // Assert
      expect(mockEducation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          candidateId: 123
        })
      });
    });

    it('debería retornar educación creada', async () => {
      // Arrange
      const data = {
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: '2020-09-01'
      };

      const createdEducation = {
        id: 1,
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: new Date('2020-09-01'),
        endDate: undefined,
        candidateId: null
      };

      mockEducation.create.mockResolvedValue(createdEducation);

      const education = new Education(data);

      // Act
      const result = await education.save();

      // Assert
      expect(result).toEqual(createdEducation);
      expect(result.id).toBe(1);
    });
  });

  describe('save() - Actualización', () => {
    it('debería llamar a prisma.education.update cuando id existe', async () => {
      // Arrange
      const data = {
        id: 1,
        institution: 'Universidad Actualizada',
        title: 'Ingeniería',
        startDate: '2020-09-01',
        endDate: '2024-06-30'
      };

      const updatedEducation = {
        id: 1,
        institution: 'Universidad Actualizada',
        title: 'Ingeniería',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2024-06-30'),
        candidateId: null
      };

      mockEducation.update.mockResolvedValue(updatedEducation);

      const education = new Education(data);

      // Act
      await education.save();

      // Assert
      expect(mockEducation.update).toHaveBeenCalled();
      expect(mockEducation.create).not.toHaveBeenCalled();
    });

    it('debería usar where: { id } correcto', async () => {
      // Arrange
      const data = {
        id: 456,
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: '2020-09-01'
      };

      const updatedEducation = {
        id: 456,
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: new Date('2020-09-01'),
        endDate: undefined,
        candidateId: null
      };

      mockEducation.update.mockResolvedValue(updatedEducation);

      const education = new Education(data);

      // Act
      await education.save();

      // Assert
      expect(mockEducation.update).toHaveBeenCalledWith({
        where: { id: 456 },
        data: expect.any(Object)
      });
    });

    it('debería incluir todos los campos requeridos', async () => {
      // Arrange
      const data = {
        id: 1,
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: '2020-09-01',
        endDate: '2024-06-30',
        candidateId: 123
      };

      const updatedEducation = {
        id: 1,
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2024-06-30'),
        candidateId: 123
      };

      mockEducation.update.mockResolvedValue(updatedEducation);

      const education = new Education(data);

      // Act
      await education.save();

      // Assert
      expect(mockEducation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          institution: 'Universidad',
          title: 'Ingeniería',
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
        institution: 'Universidad',
        title: 'Ingeniería',
        startDate: '2020-09-01'
      };

      const error = new Error('Database error');
      mockEducation.update.mockRejectedValue(error);

      const education = new Education(data);

      // Act & Assert
      await expect(education.save()).rejects.toThrow(error);
    });
  });
});
