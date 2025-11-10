/**
 * Historia de Usuario 4: Registrar un candidato con experiencia laboral
 * 
 * Tests unitarios para validar la creación de candidatos con información de experiencia laboral.
 * Cubre casos positivos y negativos según los criterios de aceptación.
 */

// Mock de PrismaClient - debe estar antes de las importaciones
const mockPrismaClient = {
  candidate: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  workExperience: {
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
import { WorkExperience } from '../../domain/models/WorkExperience';
import { PrismaClient } from '@prisma/client';

describe('Historia 4: Registrar un candidato con experiencia laboral', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validación de experiencia laboral', () => {
    it('debe aceptar experiencia válida con empresa, puesto y fecha de inicio', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test',
            position: 'Desarrollador',
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar experiencia válida con descripción opcional', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test',
            position: 'Desarrollador',
            description: 'Desarrollo de aplicaciones web',
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar experiencia válida con fecha de fin opcional', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test',
            position: 'Desarrollador',
            startDate: '2020-01-01',
            endDate: '2023-12-31',
          },
        ],
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe rechazar experiencia sin empresa', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: '',
            position: 'Desarrollador',
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid company');
    });

    it('debe rechazar experiencia con empresa mayor a 100 caracteres', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'A'.repeat(101),
            position: 'Desarrollador',
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid company');
    });

    it('debe rechazar experiencia sin puesto', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test',
            position: '',
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid position');
    });

    it('debe rechazar experiencia con puesto mayor a 100 caracteres', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test',
            position: 'A'.repeat(101),
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid position');
    });

    it('debe rechazar experiencia con descripción mayor a 200 caracteres', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test',
            position: 'Desarrollador',
            description: 'A'.repeat(201),
            startDate: '2020-01-01',
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid description');
    });

    it('debe rechazar experiencia sin fecha de inicio', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test',
            position: 'Desarrollador',
            startDate: '',
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    it('debe rechazar experiencia con fecha de inicio en formato inválido', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test',
            position: 'Desarrollador',
            startDate: '01-01-2020', // Formato incorrecto
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    it('debe rechazar experiencia con fecha de fin en formato inválido (si se proporciona)', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test',
            position: 'Desarrollador',
            startDate: '2020-01-01',
            endDate: '31-12-2023', // Formato incorrecto
          },
        ],
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid end date');
    });
  });

  describe('Servicio addCandidate con experiencias', () => {
    it('debe crear candidato exitosamente sin experiencias', async () => {
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
      expect(mockPrismaClient.workExperience.create).not.toHaveBeenCalled();
    });

    it('debe crear candidato exitosamente con una experiencia válida', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test',
            position: 'Desarrollador',
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

      const mockWorkExperience = {
        id: 1,
        company: 'Empresa Test',
        position: 'Desarrollador',
        description: null,
        startDate: new Date('2020-01-01'),
        endDate: null,
        candidateId: 1,
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockSavedCandidate);
      mockPrismaClient.workExperience.create.mockResolvedValue(mockWorkExperience);

      const result = await addCandidate(candidateData);

      expect(result).toEqual(mockSavedCandidate);
      expect(mockPrismaClient.workExperience.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaClient.workExperience.create).toHaveBeenCalledWith({
        data: {
          company: 'Empresa Test',
          position: 'Desarrollador',
          description: undefined,
          startDate: expect.any(Date),
          endDate: undefined,
          candidateId: 1,
        },
      });
    });

    it('debe crear candidato exitosamente con múltiples experiencias válidas', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test 1',
            position: 'Desarrollador Junior',
            startDate: '2020-01-01',
          },
          {
            company: 'Empresa Test 2',
            position: 'Desarrollador Senior',
            startDate: '2022-01-01',
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
      mockPrismaClient.workExperience.create.mockResolvedValue({ id: 1, candidateId: 1 });

      await addCandidate(candidateData);

      expect(mockPrismaClient.workExperience.create).toHaveBeenCalledTimes(2);
    });

    it('debe crear las experiencias asociadas al candidato con el candidateId correcto', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Empresa Test',
            position: 'Desarrollador',
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
      mockPrismaClient.workExperience.create.mockResolvedValue({ id: 1, candidateId: 1 });

      await addCandidate(candidateData);

      expect(mockPrismaClient.workExperience.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            candidateId: 1,
          }),
        })
      );
    });

    it('debe lanzar error cuando alguna experiencia es inválida', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: '', // Inválido
            position: 'Desarrollador',
            startDate: '2020-01-01',
          },
        ],
      };

      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid company');
    });
  });

  describe('Modelo WorkExperience', () => {
    it('debe crear instancia correctamente con datos válidos', () => {
      const workExperienceData = {
        company: 'Empresa Test',
        position: 'Desarrollador',
        description: 'Desarrollo de aplicaciones',
        startDate: '2020-01-01',
        endDate: '2023-12-31',
      };

      const workExperience = new WorkExperience(workExperienceData);

      expect(workExperience.company).toBe('Empresa Test');
      expect(workExperience.position).toBe('Desarrollador');
      expect(workExperience.description).toBe('Desarrollo de aplicaciones');
      expect(workExperience.startDate).toBeInstanceOf(Date);
      expect(workExperience.endDate).toBeInstanceOf(Date);
    });

    it('debe convertir fechas string a Date correctamente', () => {
      const workExperienceData = {
        company: 'Empresa Test',
        position: 'Desarrollador',
        startDate: '2020-01-01',
      };

      const workExperience = new WorkExperience(workExperienceData);

      expect(workExperience.startDate).toEqual(new Date('2020-01-01'));
      expect(workExperience.endDate).toBeUndefined();
    });

    it('debe guardar experiencia exitosamente en la base de datos', async () => {
      const workExperienceData = {
        company: 'Empresa Test',
        position: 'Desarrollador',
        description: 'Desarrollo de aplicaciones',
        startDate: '2020-01-01',
        candidateId: 1,
      };

      const mockSavedWorkExperience = {
        id: 1,
        ...workExperienceData,
        startDate: new Date('2020-01-01'),
        endDate: null,
      };

      mockPrismaClient.workExperience.create.mockResolvedValue(mockSavedWorkExperience);

      const workExperience = new WorkExperience(workExperienceData);
      const result = await workExperience.save();

      expect(result).toEqual(mockSavedWorkExperience);
      expect(mockPrismaClient.workExperience.create).toHaveBeenCalledWith({
        data: {
          company: 'Empresa Test',
          position: 'Desarrollador',
          description: 'Desarrollo de aplicaciones',
          startDate: expect.any(Date),
          endDate: undefined,
          candidateId: 1,
        },
      });
    });
  });
});

