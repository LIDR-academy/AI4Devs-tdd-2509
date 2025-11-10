/**
 * Historia de Usuario 1: Registrar un candidato con datos personales básicos
 * 
 * Tests unitarios para validar la creación de candidatos con nombre, apellido y email.
 * Cubre casos positivos y negativos según los criterios de aceptación.
 */

// Mock de PrismaClient - debe estar antes de las importaciones
const mockPrismaClient = {
  candidate: {
    create: jest.fn(),
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
import { Candidate } from '../../domain/models/Candidate';
import { PrismaClient, Prisma } from '@prisma/client';

describe('Historia 1: Registrar un candidato con datos personales básicos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validación de nombre', () => {
    it('debe aceptar nombre válido con letras y espacios', () => {
      const data = {
        firstName: 'Juan Carlos',
        lastName: 'Pérez',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar nombre con caracteres especiales en español (ñ, á, é, í, ó, ú)', () => {
      const data = {
        firstName: 'José',
        lastName: 'Muñoz',
        email: 'jose@example.com',
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe rechazar nombre vacío', () => {
      const data = {
        firstName: '',
        lastName: 'Pérez',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    it('debe rechazar nombre con menos de 2 caracteres', () => {
      const data = {
        firstName: 'J',
        lastName: 'Pérez',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    it('debe rechazar nombre con más de 100 caracteres', () => {
      const data = {
        firstName: 'A'.repeat(101),
        lastName: 'Pérez',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    it('debe rechazar nombre con números', () => {
      const data = {
        firstName: 'Juan123',
        lastName: 'Pérez',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    it('debe rechazar nombre con caracteres especiales no permitidos', () => {
      const data = {
        firstName: 'Juan@',
        lastName: 'Pérez',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });
  });

  describe('Validación de apellido', () => {
    it('debe aceptar apellido válido con letras y espacios', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez García',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar apellido con caracteres especiales en español', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Muñoz',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe rechazar apellido vacío', () => {
      const data = {
        firstName: 'Juan',
        lastName: '',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    it('debe rechazar apellido con menos de 2 caracteres', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'P',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    it('debe rechazar apellido con más de 100 caracteres', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'A'.repeat(101),
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    it('debe rechazar apellido con números', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez123',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    it('debe rechazar apellido con caracteres especiales no permitidos', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez#',
        email: 'juan@example.com',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });
  });

  describe('Validación de email', () => {
    it('debe aceptar email con formato válido', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe rechazar email vacío', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: '',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid email');
    });

    it('debe rechazar email sin @', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juanexample.com',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid email');
    });

    it('debe rechazar email sin dominio', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid email');
    });

    it('debe rechazar email sin extensión de dominio', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid email');
    });
  });

  describe('Servicio addCandidate', () => {
    it('debe crear candidato exitosamente con datos válidos', async () => {
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
      expect(mockPrismaClient.candidate.create).toHaveBeenCalledTimes(1);
    });

    it('debe lanzar error cuando el email ya existe (código P2002)', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
      };

      const prismaError = {
        code: 'P2002',
        meta: { target: ['email'] },
      };

      mockPrismaClient.candidate.create.mockRejectedValue(prismaError);

      await expect(addCandidate(candidateData)).rejects.toThrow(
        'The email already exists in the database'
      );
    });

    it('debe lanzar error cuando falla la validación', async () => {
      const candidateData = {
        firstName: '', // Nombre inválido
        lastName: 'Pérez',
        email: 'juan@example.com',
      };

      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });

    it('debe retornar el candidato creado con ID asignado', async () => {
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

      expect(result.id).toBe(1);
      expect(result.firstName).toBe('Juan');
      expect(result.lastName).toBe('Pérez');
      expect(result.email).toBe('juan@example.com');
    });
  });

  describe('Modelo Candidate.save()', () => {
    it('debe simular creación exitosa', async () => {
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

      const candidate = new Candidate(candidateData);
      const result = await candidate.save();

      expect(result).toEqual(mockSavedCandidate);
      expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
        },
      });
    });

    it('debe simular error de email duplicado', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
      };

      const prismaError = {
        code: 'P2002',
        meta: { target: ['email'] },
      };

      mockPrismaClient.candidate.create.mockRejectedValue(prismaError);

      const candidate = new Candidate(candidateData);
      await expect(candidate.save()).rejects.toEqual(prismaError);
    });
  });
});

