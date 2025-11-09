/**
 * Unit Tests for Database Error Handling
 * Tests for database connection failures and error scenarios
 * 
 * Test Cases Covered:
 * - CAND-EDGE-007: Database connection failure handling
 */

import { addCandidate } from '../../../backend/src/application/services/candidateService';
import { Candidate } from '../../../backend/src/domain/models/Candidate';
import {
  createMinimalCandidate,
  generateUniqueEmail
} from '../../utils/testDataFactory';
import {
  mockPrismaClient,
  resetAllMocks,
  mockPrismaErrors
} from '../../mocks/prismaMocks';

// Mock the Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
  Prisma: {
    PrismaClientInitializationError: class PrismaClientInitializationError extends Error {
      constructor(message: string, version: string) {
        super(message);
        this.name = 'PrismaClientInitializationError';
      }
    }
  }
}));

// Mock the Candidate domain model
jest.mock('../../../backend/src/domain/models/Candidate');

describe('Database Error Handling', () => {
  beforeEach(() => {
    resetAllMocks();
    jest.clearAllMocks();
  });

  describe('addCandidate database errors', () => {
    /**
     * Test Case ID: CAND-EDGE-007
     * Test Case Title: Verify database connection failure handling
     */
    describe('CAND-EDGE-007: Database connection failure handling', () => {
      it('should handle PrismaClientInitializationError with proper error message', async () => {
        // Arrange
        const validData = {
          firstName: "TestUser",
          lastName: "TestLastName",
          email: generateUniqueEmail('db.connection.test')
        };

        // Mock Candidate to throw database connection error
        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(mockPrismaErrors.connectionError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toThrow('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');

        expect(Candidate).toHaveBeenCalledWith(validData);
        expect(mockCandidateInstance.save).toHaveBeenCalled();
      });

      it('should handle database timeout errors', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('db.timeout.test')
        });

        const timeoutError = new Error('Connection timeout');
        timeoutError.name = 'PrismaClientInitializationError';

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(timeoutError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toThrow('Connection timeout');
      });

      it('should handle record not found error (P2025)', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          id: 999, // Non-existent ID for update scenario
          email: generateUniqueEmail('record.notfound.test')
        });

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(mockPrismaErrors.recordNotFoundError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toThrow('No se pudo encontrar el registro del candidato con el ID proporcionado.');
      });

      it('should handle generic database errors', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('generic.db.error')
        });

        const genericError = new Error('Database operation failed');

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(genericError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toThrow('Database operation failed');
      });

      it('should handle foreign key constraint violations', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('fk.constraint.test')
        });

        const fkError = {
          code: 'P2003',
          message: 'Foreign key constraint failed'
        };

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(fkError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toMatchObject({ code: 'P2003' });
      });

      it('should handle database schema validation errors', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('schema.validation.test')
        });

        const schemaError = {
          code: 'P2000',
          message: 'The provided value for the column is too long for the column\'s type'
        };

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(schemaError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toMatchObject({ code: 'P2000' });
      });

      it('should handle database transaction rollback scenarios', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('transaction.rollback.test')
        });

        const transactionError = {
          code: 'P2034',
          message: 'Transaction failed due to a write conflict or a deadlock'
        };

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(transactionError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toMatchObject({ code: 'P2034' });
      });

      it('should handle connection pool exhaustion', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('pool.exhaustion.test')
        });

        const poolError = new Error('Connection pool exhausted');
        poolError.name = 'PrismaClientInitializationError';

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(poolError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toThrow('Connection pool exhausted');
      });

      it('should handle database server unavailable scenarios', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('server.unavailable.test')
        });

        const serverError = new Error('Server is not available');
        serverError.name = 'PrismaClientInitializationError';

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(serverError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toThrow('Server is not available');
      });

      it('should handle authentication failures with database', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('auth.failure.test')
        });

        const authError = new Error('Authentication failed');
        authError.name = 'PrismaClientInitializationError';

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(authError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toThrow('Authentication failed');
      });

      it('should handle malformed query errors', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('malformed.query.test')
        });

        const queryError = {
          code: 'P2009',
          message: 'Query parsing error'
        };

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(queryError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toMatchObject({ code: 'P2009' });
      });
    });

    /**
     * Database resilience and retry scenarios
     */
    describe('Database resilience scenarios', () => {
      it('should handle intermittent connection failures', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('intermittent.failure.test')
        });

        const intermittentError = new Error('Connection temporarily unavailable');
        intermittentError.name = 'PrismaClientInitializationError';

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(intermittentError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toThrow('Connection temporarily unavailable');
      });

      it('should preserve error details for debugging', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('error.details.test')
        });

        const detailedError = {
          code: 'P2010',
          message: 'Raw query failed',
          meta: {
            code: 'invalid_column_name',
            message: 'column "invalid_field" does not exist'
          }
        };

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(detailedError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(validData))
          .rejects
          .toMatchObject({
            code: 'P2010',
            meta: expect.objectContaining({
              code: 'invalid_column_name'
            })
          });
      });
    });

    /**
     * Performance under error conditions
     */
    describe('Performance under error conditions', () => {
      it('should fail fast for database errors', async () => {
        // Arrange
        const validData = createMinimalCandidate({
          email: generateUniqueEmail('fail.fast.test')
        });

        const fastError = new Error('Immediate failure');
        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(fastError),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        const startTime = Date.now();

        // Act
        try {
          await addCandidate(validData);
        } catch (error) {
          // Expected to fail
        }

        // Assert
        const executionTime = Date.now() - startTime;
        expect(executionTime).toBeLessThan(50); // Should fail quickly
      });
    });
  });
});