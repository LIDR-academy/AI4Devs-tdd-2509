/**
 * Mock Prisma Client for Testing
 * 
 * This file provides a deeply mocked version of PrismaClient using jest-mock-extended.
 * The mock is automatically used when the main prisma module is mocked in tests.
 * 
 * Features:
 * - Deep mocking of all Prisma Client methods
 * - Automatic mock reset between tests
 * - Full TypeScript type safety
 * - Shared singleton across all test files
 * 
 * @see https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
 */

import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

/**
 * Reset all mocks before each test to ensure test isolation
 */
beforeEach(() => {
  mockReset(prismaMock);
});

/**
 * Deep mock of PrismaClient with full type safety
 * All nested properties (e.g., prisma.candidate.create) are automatically mocked
 */
export const prismaMock = mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;

export default prismaMock;
