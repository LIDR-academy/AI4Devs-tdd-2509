/**
 * Historia de Usuario 3: Registrar un candidato con información de educación
 * 
 * Tests unitarios para validar la creación de candidatos con información de educación.
 * Cubre casos positivos y negativos según los criterios de aceptación.
 */

// Mock de PrismaClient - debe estar antes de las importaciones
const mockPrismaClient = {
  candidate: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  education: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: {
      PrismaClientInitializationError: class PrismaClientInitializationError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'PrismaClientInitializationError';
        }
      },
    },
  };
});

import { validateCandidateData } from '../../application/validator';
import { addCandidate } from '../../application/services/candidateService';
import { Education } from '../../domain/models/Education';
import { PrismaClient } from '@prisma/client';

describe('Historia 3: Registrar un candidato con información de educación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validación de educación', () => {
    it('debe aceptar educación válida con institución, título y fecha de inicio', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad Test',
            title: 'Ingeniería Informática',
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar educación válida con fecha de fin opcional', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad Test',
            title: 'Ingeniería Informática',
            startDate: '2020-01-01',
            endDate: '2024-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe rechazar educación sin institución', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: '',
            title: 'Ingeniería Informática',
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid institution');
    });

    it('debe rechazar educación con institución mayor a 100 caracteres', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'A'.repeat(101),
            title: 'Ingeniería Informática',
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid institution');
    });

    it('debe rechazar educación sin título', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad Test',
            title: '',
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid title');
    });

    it('debe rechazar educación con título mayor a 100 caracteres', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad Test',
            title: 'A'.repeat(101),
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid title');
    });

    it('debe rechazar educación sin fecha de inicio', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad Test',
            title: 'Ingeniería Informática',
            startDate: '',
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    it('debe rechazar educación con fecha de inicio en formato inválido', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad Test',
            title: 'Ingeniería Informática',
            startDate: '01-01-2020', // Formato incorrecto
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    it('debe rechazar educación con fecha de fin en formato inválido (si se proporciona)', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad Test',
            title: 'Ingeniería Informática',
            startDate: '2020-01-01',
            endDate: '01-01-2024', // Formato incorrecto
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid end date');
    });
  });

  describe('Servicio addCandidate con educaciones', () => {
    it('debe crear candidato exitosamente sin educaciones', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
      };

      const mockSavedCandidate = {
        id: 1,
        ...candidateData,
        phone: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateData);

      expect(result).toEqual(mockSavedCandidate);
      expect(mockPrismaClient.education.create).not.toHaveBeenCalled();
    });

    it('debe crear candidato exitosamente con una educación válida', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad Test',
            title: 'Ingeniería Informática',
            startDate: '2020-01-01',
          },
        ],
      };

      const mockSavedCandidate = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockEducation = {
        id: 1,
        institution: 'Universidad Test',
        title: 'Ingeniería Informática',
        startDate: new Date('2020-01-01'),
        endDate: null,
        candidateId: 1,
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockSavedCandidate);
      mockPrismaClient.education.create.mockResolvedValue(mockEducation);

      const result = await addCandidate(candidateData);

      expect(result).toEqual(mockSavedCandidate);
      expect(mockPrismaClient.education.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaClient.education.create).toHaveBeenCalledWith({
        data: {
          institution: 'Universidad Test',
          title: 'Ingeniería Informática',
          startDate: expect.any(Date),
          endDate: undefined,
          candidateId: 1,
        },
      });
    });

    it('debe crear candidato exitosamente con múltiples educaciones válidas', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad Test 1',
            title: 'Grado 1',
            startDate: '2020-01-01',
          },
          {
            institution: 'Universidad Test 2',
            title: 'Grado 2',
            startDate: '2024-01-01',
          },
        ],
      };

      const mockSavedCandidate = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockSavedCandidate);
      mockPrismaClient.education.create.mockResolvedValue({ id: 1, candidateId: 1 });

      await addCandidate(candidateData);

      expect(mockPrismaClient.education.create).toHaveBeenCalledTimes(2);
    });

    it('debe crear las educaciones asociadas al candidato con el candidateId correcto', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad Test',
            title: 'Ingeniería Informática',
            startDate: '2020-01-01',
          },
        ],
      };

      const mockSavedCandidate = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockSavedCandidate);
      mockPrismaClient.education.create.mockResolvedValue({ id: 1, candidateId: 1 });

      await addCandidate(candidateData);

      expect(mockPrismaClient.education.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            candidateId: 1,
          }),
        })
      );
    });

    it('debe lanzar error cuando alguna educación es inválida', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: '', // Inválido
            title: 'Ingeniería Informática',
            startDate: '2020-01-01',
          },
        ],
      };

      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid institution');
    });
  });

  describe('Modelo Education', () => {
    it('debe crear instancia correctamente con datos válidos', () => {
      const educationData = {
        institution: 'Universidad Test',
        title: 'Ingeniería Informática',
        startDate: '2020-01-01',
        endDate: '2024-01-01',
      };

      const education = new Education(educationData);

      expect(education.institution).toBe('Universidad Test');
      expect(education.title).toBe('Ingeniería Informática');
      expect(education.startDate).toBeInstanceOf(Date);
      expect(education.endDate).toBeInstanceOf(Date);
    });

    it('debe convertir fechas string a Date correctamente', () => {
      const educationData = {
        institution: 'Universidad Test',
        title: 'Ingeniería Informática',
        startDate: '2020-01-01',
      };

      const education = new Education(educationData);

      expect(education.startDate).toEqual(new Date('2020-01-01'));
      expect(education.endDate).toBeUndefined();
    });

    it('debe guardar educación exitosamente en la base de datos', async () => {
      const educationData = {
        institution: 'Universidad Test',
        title: 'Ingeniería Informática',
        startDate: '2020-01-01',
        candidateId: 1,
      };

      const mockSavedEducation = {
        id: 1,
        ...educationData,
        startDate: new Date('2020-01-01'),
        endDate: null,
      };

      mockPrismaClient.education.create.mockResolvedValue(mockSavedEducation);

      const education = new Education(educationData);
      const result = await education.save();

      expect(result).toEqual(mockSavedEducation);
      expect(mockPrismaClient.education.create).toHaveBeenCalledWith({
        data: {
          institution: 'Universidad Test',
          title: 'Ingeniería Informática',
          startDate: expect.any(Date),
          endDate: undefined,
          candidateId: 1,
        },
      });
    });
  });
});

