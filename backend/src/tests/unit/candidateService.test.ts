/**
 * Unit Tests for Candidate Service
 * Tests for candidateService.addCandidate() functionality
 * 
 * Test Cases Covered:
 * - CAND-001: Valid complete candidate creation
 * - CAND-002: Minimal candidate creation  
 * - CAND-003: Duplicate email rejection
 */

import { addCandidate } from '../../../backend/src/application/services/candidateService';
import { Candidate } from '../../../backend/src/domain/models/Candidate';
import {
  createValidCompleteCandidate,
  createMinimalCandidate,
  generateUniqueEmail,
  createMockDatabaseResult,
  TestCandidateData
} from '../../utils/testDataFactory';
import {
  mockPrismaClient,
  resetAllMocks,
  setupSuccessfulMocks,
  setupDuplicateEmailMock,
  mockCandidateCreateResponse
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

describe('CandidateService', () => {
  beforeEach(() => {
    resetAllMocks();
    jest.clearAllMocks();
  });

  describe('addCandidate', () => {
    /**
     * Test Case ID: CAND-001
     * Test Case Title: Verify successful creation of candidate with complete valid data
     */
    describe('CAND-001: Complete valid candidate creation', () => {
      it('should create candidate with all fields successfully', async () => {
        // Arrange
        const validCandidateData = createValidCompleteCandidate({
          email: generateUniqueEmail('juan.perez')
        });
        
        const expectedResult = {
          ...mockCandidateCreateResponse,
          firstName: validCandidateData.firstName,
          lastName: validCandidateData.lastName,
          email: validCandidateData.email,
          phone: validCandidateData.phone,
          address: validCandidateData.address
        };

        // Mock Candidate constructor and save method
        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(expectedResult),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(validCandidateData);

        // Assert
        expect(result).toBeDefined();
        expect(result.id).toBe(expectedResult.id);
        expect(result.firstName).toBe(validCandidateData.firstName);
        expect(result.lastName).toBe(validCandidateData.lastName);
        expect(result.email).toBe(validCandidateData.email);
        expect(result.phone).toBe(validCandidateData.phone);
        expect(result.address).toBe(validCandidateData.address);
        
        // Verify Candidate was instantiated correctly
        expect(Candidate).toHaveBeenCalledWith(validCandidateData);
        expect(mockCandidateInstance.save).toHaveBeenCalled();
      });

      it('should handle education records correctly', async () => {
        // Arrange
        const validCandidateData = createValidCompleteCandidate({
          email: generateUniqueEmail('juan.education')
        });

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({ ...mockCandidateCreateResponse, id: 1 }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(validCandidateData);

        // Assert
        expect(result).toBeDefined();
        expect(Candidate).toHaveBeenCalledWith(validCandidateData);
        expect(mockCandidateInstance.save).toHaveBeenCalled();
      });

      it('should handle work experience records correctly', async () => {
        // Arrange
        const validCandidateData = createValidCompleteCandidate({
          email: generateUniqueEmail('juan.work')
        });

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({ ...mockCandidateCreateResponse, id: 1 }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(validCandidateData);

        // Assert
        expect(result).toBeDefined();
        expect(Candidate).toHaveBeenCalledWith(validCandidateData);
        expect(mockCandidateInstance.save).toHaveBeenCalled();
      });

      it('should handle CV upload correctly', async () => {
        // Arrange
        const validCandidateData = createValidCompleteCandidate({
          email: generateUniqueEmail('juan.cv'),
          cv: {
            filePath: "uploads/cv-test.pdf",
            fileType: "application/pdf"
          }
        });

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({ ...mockCandidateCreateResponse, id: 1 }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(validCandidateData);

        // Assert
        expect(result).toBeDefined();
        expect(Candidate).toHaveBeenCalledWith(validCandidateData);
        expect(mockCandidateInstance.save).toHaveBeenCalled();
      });
    });

    /**
     * Test Case ID: CAND-002
     * Test Case Title: Verify candidate creation with minimum required fields only
     */
    describe('CAND-002: Minimal candidate creation', () => {
      it('should create candidate with only required fields', async () => {
        // Arrange
        const minimalCandidateData = createMinimalCandidate({
          email: generateUniqueEmail('ana.garcia')
        });
        
        const expectedResult = {
          ...mockCandidateCreateResponse,
          firstName: minimalCandidateData.firstName,
          lastName: minimalCandidateData.lastName,
          email: minimalCandidateData.email,
          phone: null,
          address: null
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(expectedResult),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(minimalCandidateData);

        // Assert
        expect(result).toBeDefined();
        expect(result.firstName).toBe(minimalCandidateData.firstName);
        expect(result.lastName).toBe(minimalCandidateData.lastName);
        expect(result.email).toBe(minimalCandidateData.email);
        expect(result.phone).toBeNull();
        expect(result.address).toBeNull();
        
        // Verify Candidate was instantiated correctly
        expect(Candidate).toHaveBeenCalledWith(minimalCandidateData);
        expect(mockCandidateInstance.save).toHaveBeenCalled();
      });

      it('should handle undefined optional fields gracefully', async () => {
        // Arrange
        const minimalData: TestCandidateData = {
          firstName: "Test",
          lastName: "User",
          email: generateUniqueEmail('test.optional'),
          phone: undefined,
          address: undefined,
          educations: undefined,
          workExperiences: undefined,
          cv: undefined
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            firstName: minimalData.firstName,
            lastName: minimalData.lastName,
            email: minimalData.email
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(minimalData);

        // Assert
        expect(result).toBeDefined();
        expect(result.firstName).toBe(minimalData.firstName);
        expect(result.lastName).toBe(minimalData.lastName);
        expect(result.email).toBe(minimalData.email);
        expect(Candidate).toHaveBeenCalledWith(minimalData);
      });
    });

    /**
     * Test Case ID: CAND-003
     * Test Case Title: Verify duplicate email rejection
     */
    describe('CAND-003: Duplicate email rejection', () => {
      it('should reject candidate with duplicate email', async () => {
        // Arrange
        const existingEmail = generateUniqueEmail('existing');
        const duplicateCandidateData = createMinimalCandidate({
          firstName: "Pablo",
          lastName: "Martínez",
          email: existingEmail
        });

        // Mock Candidate to throw P2002 error (unique constraint violation)
        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue({
            code: 'P2002',
            message: 'Unique constraint failed on the fields: (`email`)'
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(duplicateCandidateData))
          .rejects
          .toThrow('The email already exists in the database');
        
        expect(Candidate).toHaveBeenCalledWith(duplicateCandidateData);
        expect(mockCandidateInstance.save).toHaveBeenCalled();
      });

      it('should handle P2002 error specifically for email constraint', async () => {
        // Arrange
        const candidateData = createMinimalCandidate({
          email: generateUniqueEmail('duplicate.test')
        });

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue({
            code: 'P2002',
            meta: { target: ['email'] }
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(candidateData))
          .rejects
          .toThrow('The email already exists in the database');
      });

      it('should re-throw non-duplicate errors', async () => {
        // Arrange
        const candidateData = createMinimalCandidate({
          email: generateUniqueEmail('other.error')
        });

        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(new Error('Some other database error')),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(candidateData))
          .rejects
          .toThrow('Some other database error');
      });
    });

    /**
     * Performance and timeout tests
     */
    describe('Performance Tests', () => {
      it('should complete within acceptable time limit', async () => {
        // Arrange
        const candidateData = createMinimalCandidate({
          email: generateUniqueEmail('performance.test')
        });

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(mockCandidateCreateResponse),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        const startTime = Date.now();

        // Act
        await addCandidate(candidateData);

        // Assert
        const executionTime = Date.now() - startTime;
        expect(executionTime).toBeLessThan(100); // Should complete within 100ms
      });
    });
  });
});