import { PrismaClient } from '@prisma/client';

// Factory function para crear un mock de PrismaClient
// Este mock permite aislar completamente los tests de la base de datos real

export const createMockPrismaClient = () => {
  return {
    candidate: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    education: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    workExperience: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    resume: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaClient;
};

export type MockPrismaClient = ReturnType<typeof createMockPrismaClient>;

