/**
 * Historia de Usuario 2: Registrar un candidato con datos opcionales (teléfono y dirección)
 * 
 * Tests unitarios para validar la creación de candidatos con teléfono y dirección opcionales.
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
import { PrismaClient } from '@prisma/client';

describe('Historia 2: Registrar un candidato con datos opcionales (teléfono y dirección)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validación de teléfono', () => {
    it('debe aceptar teléfono válido comenzando con 6 (9 dígitos)', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar teléfono válido comenzando con 7 (9 dígitos)', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '712345678',
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar teléfono válido comenzando con 9 (9 dígitos)', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '912345678',
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar teléfono undefined (campo opcional)', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: undefined,
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar teléfono null (campo opcional)', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: null as any,
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe rechazar teléfono que no comience con 6, 7 o 9', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '512345678',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    it('debe rechazar teléfono con menos de 9 dígitos', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '61234567',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    it('debe rechazar teléfono con más de 9 dígitos', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '6123456789',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    it('debe rechazar teléfono con letras', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '61234567a',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    it('debe rechazar teléfono con caracteres especiales', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612-345-678',
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });
  });

  describe('Validación de dirección', () => {
    it('debe aceptar dirección válida con menos de 100 caracteres', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        address: 'Calle Principal 123',
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar dirección con exactamente 100 caracteres', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        address: 'A'.repeat(100),
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar dirección undefined (campo opcional)', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        address: undefined,
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe aceptar dirección null (campo opcional)', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        address: null as any,
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    it('debe rechazar dirección con más de 100 caracteres', () => {
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        address: 'A'.repeat(101),
      };
      expect(() => validateCandidateData(data)).toThrow('Invalid address');
    });
  });

  describe('Servicio addCandidate con datos opcionales', () => {
    it('debe crear candidato exitosamente sin teléfono ni dirección', async () => {
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

    it('debe crear candidato exitosamente con teléfono válido', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
      };

      const mockSavedCandidate = {
        id: 1,
        ...candidateData,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateData);

      expect(result.phone).toBe('612345678');
      expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          phone: '612345678',
        }),
      });
    });

    it('debe crear candidato exitosamente con dirección válida', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        address: 'Calle Principal 123',
      };

      const mockSavedCandidate = {
        id: 1,
        ...candidateData,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateData);

      expect(result.address).toBe('Calle Principal 123');
      expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          address: 'Calle Principal 123',
        }),
      });
    });

    it('debe crear candidato exitosamente con teléfono y dirección válidos', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        address: 'Calle Principal 123',
      };

      const mockSavedCandidate = {
        id: 1,
        ...candidateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateData);

      expect(result.phone).toBe('612345678');
      expect(result.address).toBe('Calle Principal 123');
    });

    it('debe lanzar error cuando el teléfono es inválido', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '512345678', // Inválido: no comienza con 6, 7 o 9
      };

      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid phone');
    });

    it('debe lanzar error cuando la dirección excede el límite', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        address: 'A'.repeat(101), // Más de 100 caracteres
      };

      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid address');
    });
  });
});

