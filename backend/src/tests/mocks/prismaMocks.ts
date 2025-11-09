/**
 * Mock implementations for Prisma and other dependencies
 */

import { Prisma } from '@prisma/client';

// Mock Prisma Client
export const mockPrismaClient = {
  candidate: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn()
  },
  education: {
    create: jest.fn(),
    deleteMany: jest.fn()
  },
  workExperience: {
    create: jest.fn(),
    deleteMany: jest.fn()
  },
  resume: {
    create: jest.fn(),
    deleteMany: jest.fn()
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn()
};

// Mock successful candidate creation response
export const mockCandidateCreateResponse = {
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: null,
  address: null,
  createdAt: new Date('2025-11-09T10:00:00.000Z'),
  updatedAt: new Date('2025-11-09T10:00:00.000Z')
};

// Mock Prisma errors
export const mockPrismaErrors = {
  uniqueConstraintError: {
    code: 'P2002',
    message: 'Unique constraint failed on the fields: (`email`)',
    meta: {
      target: ['email']
    }
  },
  connectionError: new Prisma.PrismaClientInitializationError(
    'Connection to database failed',
    '1.0.0'
  ),
  recordNotFoundError: {
    code: 'P2025',
    message: 'Record not found'
  }
};

// Mock file system operations
export const mockFileSystem = {
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
  mkdirSync: jest.fn()
};

// Reset all mocks
export const resetAllMocks = () => {
  Object.values(mockPrismaClient.candidate).forEach(mock => (mock as jest.Mock).mockReset());
  Object.values(mockPrismaClient.education).forEach(mock => (mock as jest.Mock).mockReset());
  Object.values(mockPrismaClient.workExperience).forEach(mock => (mock as jest.Mock).mockReset());
  Object.values(mockPrismaClient.resume).forEach(mock => (mock as jest.Mock).mockReset());
  (mockPrismaClient.$connect as jest.Mock).mockReset();
  (mockPrismaClient.$disconnect as jest.Mock).mockReset();
  (mockPrismaClient.$transaction as jest.Mock).mockReset();
  
  Object.values(mockFileSystem).forEach(mock => (mock as jest.Mock).mockReset());
};

// Mock setup helpers
export const setupSuccessfulMocks = () => {
  (mockPrismaClient.candidate.create as jest.Mock).mockResolvedValue(mockCandidateCreateResponse);
  (mockPrismaClient.candidate.findUnique as jest.Mock).mockResolvedValue(null);
  (mockPrismaClient.$connect as jest.Mock).mockResolvedValue(undefined);
  (mockPrismaClient.$disconnect as jest.Mock).mockResolvedValue(undefined);
};

export const setupDuplicateEmailMock = () => {
  (mockPrismaClient.candidate.create as jest.Mock).mockRejectedValue(mockPrismaErrors.uniqueConstraintError);
};

export const setupDatabaseConnectionErrorMock = () => {
  (mockPrismaClient.candidate.create as jest.Mock).mockRejectedValue(mockPrismaErrors.connectionError);
};