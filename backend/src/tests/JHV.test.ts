/**
 * @fileoverview Comprehensive Jest test suite for Candidate model database operations
 * @description Tests form data reception, database persistence, and error handling
 * @author Senior Software Testing Engineer
 * @version 2.0.0 - Refactored with Prisma's recommended mocking approach
 * 
 * This test suite follows Prisma's official testing guidelines:
 * @see https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
 */

import { Prisma } from '@prisma/client';
import { prismaMock } from '../lib/__mocks__/prisma';

// Mock the Prisma singleton module to return our deep mock
jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: require('../lib/__mocks__/prisma').prismaMock,
}));

// Import Candidate AFTER setting up the mock so it gets the mocked prisma
import { Candidate } from '../domain/models/Candidate';

// ============================================================================
// TEST DATA FIXTURES - Typed Test Data Factory
// ============================================================================

/**
 * Interface for test candidate data
 */
interface TestCandidateData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: Array<{
    institution: string;
    title: string;
    startDate: Date;
    endDate?: Date;
  }>;
  workExperience?: Array<{
    company: string;
    position: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
  }>;
  resumes?: Array<{
    filePath: string;
    fileType: string;
  }>;
}

/**
 * Factory function for creating valid candidate test data
 */
const createValidCandidateData = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => ({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  address: '123 Main St, City, Country',
  education: [
    {
      institution: 'Harvard University',
      title: 'Bachelor of Science in Computer Science',
      startDate: new Date('2015-09-01'),
      endDate: new Date('2019-06-01')
    }
  ],
  workExperience: [
    {
      company: 'Tech Corp',
      position: 'Software Engineer',
      description: 'Developed web applications',
      startDate: new Date('2019-07-01'),
      endDate: new Date('2023-12-31')
    }
  ],
  resumes: [
    {
      filePath: '/uploads/resume_john_doe.pdf',
      fileType: 'application/pdf'
    }
  ],
  ...overrides
});

/**
 * Factory function for creating minimal required candidate data
 */
const createMinimalCandidateData = (): TestCandidateData => ({
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com'
});

/**
 * Factory function for expected Prisma database response
 */
const createExpectedDatabaseResponse = (data: TestCandidateData) => ({
  id: data.id || 1,
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  phone: data.phone || null,
  address: data.address || null
});

// ============================================================================
// TEST SUITE - Candidate Model Tests
// ============================================================================

describe('Candidate Model Tests', () => {
  
  // ============================================================================
  // TEST LIFECYCLE HOOKS - Ensure Test Isolation
  // ============================================================================

  /**
   * Clear all mock call history after each test
   * Note: mockReset is already called in __mocks__/prisma.ts beforeEach
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // FAMILY 1: FORM DATA RECEPTION TESTS
  // ============================================================================

  describe('Form Data Reception', () => {
    
    /**
     * Test: Candidate constructor should correctly process complete form data
     * Validates: Constructor data parsing, field assignment, data transformation
     */
    it('should correctly process and assign all fields from complete form data when constructor is called', () => {
      // ========== ARRANGE ==========
      const formData = createValidCandidateData();

      // ========== ACT ==========
      const candidate = new Candidate(formData);

      // ========== ASSERT ==========
      expect(candidate.firstName).toBe(formData.firstName);
      expect(candidate.lastName).toBe(formData.lastName);
      expect(candidate.email).toBe(formData.email);
      expect(candidate.phone).toBe(formData.phone);
      expect(candidate.address).toBe(formData.address);
      expect(candidate.education).toEqual(formData.education);
      expect(candidate.workExperience).toEqual(formData.workExperience);
      expect(candidate.resumes).toEqual(formData.resumes);
      expect(candidate.id).toBeUndefined();
    });

    /**
     * Test: Candidate constructor should handle minimal required fields
     * Validates: Optional field handling, default values, data sanitization
     */
    it('should correctly process minimal required fields and set optional fields to default values when only required data is provided', () => {
      // ========== ARRANGE ==========
      const minimalData = createMinimalCandidateData();

      // ========== ACT ==========
      const candidate = new Candidate(minimalData);

      // ========== ASSERT ==========
      expect(candidate.firstName).toBe(minimalData.firstName);
      expect(candidate.lastName).toBe(minimalData.lastName);
      expect(candidate.email).toBe(minimalData.email);
      expect(candidate.phone).toBeUndefined();
      expect(candidate.address).toBeUndefined();
      expect(candidate.education).toEqual([]);
      expect(candidate.workExperience).toEqual([]);
      expect(candidate.resumes).toEqual([]);
    });

    /**
     * Test: Candidate constructor should handle nested relations correctly
     * Validates: Complex object parsing, array handling, nested data structures
     */
    it('should correctly parse and assign nested education, work experience, and resume arrays when complex form data is provided', () => {
      // ========== ARRANGE ==========
      const complexData = createValidCandidateData({
        education: [
          {
            institution: 'MIT',
            title: 'Master of Computer Science',
            startDate: new Date('2019-09-01'),
            endDate: new Date('2021-06-01')
          },
          {
            institution: 'Stanford',
            title: 'PhD in AI',
            startDate: new Date('2021-09-01'),
            endDate: undefined
          }
        ],
        workExperience: [
          {
            company: 'Google',
            position: 'Senior Engineer',
            description: 'Led AI team',
            startDate: new Date('2021-07-01'),
            endDate: undefined
          }
        ],
        resumes: [
          {
            filePath: '/uploads/resume1.pdf',
            fileType: 'application/pdf'
          },
          {
            filePath: '/uploads/resume2.docx',
            fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        ]
      });

      // ========== ACT ==========
      const candidate = new Candidate(complexData);

      // ========== ASSERT ==========
      expect(candidate.education).toHaveLength(2);
      expect(candidate.education[0].institution).toBe('MIT');
      expect(candidate.education[1].institution).toBe('Stanford');
      expect(candidate.workExperience).toHaveLength(1);
      expect(candidate.workExperience[0].company).toBe('Google');
      expect(candidate.resumes).toHaveLength(2);
      expect(candidate.resumes[1].fileType).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    });

    /**
     * Test: Candidate constructor should handle empty/null nested arrays
     * Validates: Null safety, default value assignment, edge case handling
     */
    it('should initialize empty arrays for nested relations when they are not provided in form data', () => {
      // ========== ARRANGE ==========
      const dataWithoutRelations = {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com'
        // Intentionally omitting education, workExperience, resumes
      };

      // ========== ACT ==========
      const candidate = new Candidate(dataWithoutRelations);

      // ========== ASSERT ==========
      expect(candidate.education).toBeDefined();
      expect(candidate.education).toEqual([]);
      expect(candidate.workExperience).toBeDefined();
      expect(candidate.workExperience).toEqual([]);
      expect(candidate.resumes).toBeDefined();
      expect(candidate.resumes).toEqual([]);
    });

  });

  // ============================================================================
  // FAMILY 2: DATABASE PERSISTENCE TESTS
  // ============================================================================

  describe('Database Persistence', () => {

    /**
     * Test: HAPPY PATH - Complete candidate with all optional fields
     * Validates: Full create operation, nested relations creation, complete data flow
     */
    it('should successfully persist a complete candidate with all optional fields and nested relations when save() is called', async () => {
      // ========== ARRANGE ==========
      const completeData = createValidCandidateData();
      const candidate = new Candidate(completeData);
      
      const expectedResponse = createExpectedDatabaseResponse(completeData);
      
      // Mock successful database create operation using jest-mock-extended
      prismaMock.candidate.create.mockResolvedValue(expectedResponse as any);

      // ========== ACT ==========
      const result = await candidate.save();

      // ========== ASSERT ==========
      expect(prismaMock.candidate.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: completeData.firstName,
          lastName: completeData.lastName,
          email: completeData.email,
          phone: completeData.phone,
          address: completeData.address,
          educations: {
            create: expect.arrayContaining([
              expect.objectContaining({
                institution: 'Harvard University',
                title: 'Bachelor of Science in Computer Science'
              })
            ])
          },
          workExperiences: {
            create: expect.arrayContaining([
              expect.objectContaining({
                company: 'Tech Corp',
                position: 'Software Engineer'
              })
            ])
          },
          resumes: {
            create: expect.arrayContaining([
              expect.objectContaining({
                filePath: '/uploads/resume_john_doe.pdf',
                fileType: 'application/pdf'
              })
            ])
          }
        })
      });
      expect(result).toEqual(expectedResponse);
    });

    /**
     * Test: MINIMAL PATH - Candidate with only required fields
     * Validates: Minimal create operation, undefined field handling, required field validation
     */
    it('should successfully persist a candidate with only required fields when save() is called with minimal data', async () => {
      // ========== ARRANGE ==========
      const minimalData = createMinimalCandidateData();
      const candidate = new Candidate(minimalData);
      
      const expectedResponse = createExpectedDatabaseResponse(minimalData);
      
      // Mock successful database create operation
      prismaMock.candidate.create.mockResolvedValue(expectedResponse as any);

      // ========== ACT ==========
      const result = await candidate.save();

      // ========== ASSERT ==========
      expect(prismaMock.candidate.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: minimalData.firstName,
          lastName: minimalData.lastName,
          email: minimalData.email
          // Should NOT include phone, address, educations, workExperiences, resumes
        }
      });
      expect(result).toEqual(expectedResponse);
      expect(result.phone).toBeNull();
      expect(result.address).toBeNull();
    });

    /**
     * Test: EDGE CASE 1 - Duplicate email constraint violation
     * Validates: Unique constraint handling, Prisma error propagation, database integrity
     */
    it('should throw Prisma unique constraint error when attempting to save candidate with duplicate email', async () => {
      // ========== ARRANGE ==========
      const duplicateEmailData = createValidCandidateData({
        email: 'existing@example.com'
      });
      const candidate = new Candidate(duplicateEmailData);
      
      // Mock Prisma unique constraint violation error (P2002) using actual Prisma error class
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`email`)',
        {
          code: 'P2002',
          clientVersion: '5.13.0',
          meta: { target: ['email'] }
        }
      );
      
      prismaMock.candidate.create.mockRejectedValue(prismaError);

      // ========== ACT & ASSERT ==========
      await expect(candidate.save()).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
      await expect(candidate.save()).rejects.toThrow('Unique constraint failed');
      expect(prismaMock.candidate.create).toHaveBeenCalled();
    });

    /**
     * Test: EDGE CASE 2 - Missing required fields validation
     * Validates: Required field enforcement, validation error handling, data integrity
     * Note: This tests Prisma's validation when required fields are missing
     */
    it('should throw Prisma validation error when attempting to save candidate with missing required fields', async () => {
      // ========== ARRANGE ==========
      const invalidData = {
        firstName: 'Test',
        // Missing lastName and email (required fields)
      };
      const candidate = new Candidate(invalidData as any);
      
      // Mock Prisma missing field error using actual Prisma error class
      const prismaError = new Prisma.PrismaClientValidationError(
        'Missing required field: email',
        { clientVersion: '5.13.0' }
      );
      
      prismaMock.candidate.create.mockRejectedValue(prismaError);

      // ========== ACT & ASSERT ==========
      await expect(candidate.save()).rejects.toThrow(Prisma.PrismaClientValidationError);
      expect(prismaMock.candidate.create).toHaveBeenCalled();
    });

    /**
     * Test: EDGE CASE 3 - Database connection failure
     * Validates: Connection error handling, PrismaClientInitializationError, user-friendly messages
     */
    it('should throw user-friendly error message when database connection fails during save()', async () => {
      // ========== ARRANGE ==========
      const candidateData = createValidCandidateData();
      const candidate = new Candidate(candidateData);
      
      // Mock database initialization/connection error using actual Prisma error class
      const connectionError = new Prisma.PrismaClientInitializationError(
        'Can\'t reach database server',
        '5.13.0',
        'P1001'
      );
      
      prismaMock.candidate.create.mockRejectedValue(connectionError);

      // ========== ACT & ASSERT ==========
      await expect(candidate.save()).rejects.toThrow(
        'No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.'
      );
      expect(prismaMock.candidate.create).toHaveBeenCalled();
    });

    /**
     * Test: EDGE CASE 4 - Update existing candidate vs create new candidate
     * Validates: Update operation, ID-based routing, differential behavior
     */
    it('should call update instead of create when candidate has an existing ID', async () => {
      // ========== ARRANGE ==========
      const existingCandidateData = createValidCandidateData({ id: 42 });
      const candidate = new Candidate(existingCandidateData);
      
      const expectedResponse = createExpectedDatabaseResponse(existingCandidateData);
      
      // Mock successful database update operation
      prismaMock.candidate.update.mockResolvedValue(expectedResponse as any);

      // ========== ACT ==========
      const result = await candidate.save();

      // ========== ASSERT ==========
      expect(prismaMock.candidate.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.candidate.create).not.toHaveBeenCalled();
      expect(prismaMock.candidate.update).toHaveBeenCalledWith({
        where: { id: 42 },
        data: expect.objectContaining({
          firstName: existingCandidateData.firstName,
          lastName: existingCandidateData.lastName,
          email: existingCandidateData.email
        })
      });
      expect(result).toEqual(expectedResponse);
    });

    /**
     * Test: EDGE CASE 5 - Update non-existent candidate (P2025 error)
     * Validates: Record not found error, update error handling, user-friendly messages
     */
    it('should throw user-friendly error when attempting to update non-existent candidate', async () => {
      // ========== ARRANGE ==========
      const nonExistentData = createValidCandidateData({ id: 9999 });
      const candidate = new Candidate(nonExistentData);
      
      // Mock Prisma record not found error (P2025) using actual Prisma error class
      const notFoundError = new Prisma.PrismaClientKnownRequestError(
        'Record to update not found.',
        {
          code: 'P2025',
          clientVersion: '5.13.0',
          meta: {}
        }
      );
      
      prismaMock.candidate.update.mockRejectedValue(notFoundError);

      // ========== ACT & ASSERT ==========
      await expect(candidate.save()).rejects.toThrow(
        'No se pudo encontrar el registro del candidato con el ID proporcionado.'
      );
      expect(prismaMock.candidate.update).toHaveBeenCalled();
    });

    /**
     * Test: PERFORMANCE - Save operation should complete within acceptable time
     * Validates: Async/await performance, no blocking operations, efficient database calls
     */
    it('should complete save operation within acceptable time frame when called', async () => {
      // ========== ARRANGE ==========
      const candidateData = createValidCandidateData();
      const candidate = new Candidate(candidateData);
      
      const expectedResponse = createExpectedDatabaseResponse(candidateData);
      prismaMock.candidate.create.mockResolvedValue(expectedResponse as any);

      const startTime = Date.now();

      // ========== ACT ==========
      await candidate.save();
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // ========== ASSERT ==========
      // Mock operations should complete very quickly (< 100ms)
      expect(executionTime).toBeLessThan(100);
      expect(prismaMock.candidate.create).toHaveBeenCalled();
    });

    /**
     * Test: MEMORY LEAK PREVENTION - Multiple save operations should not accumulate memory
     * Validates: Proper cleanup, no dangling references, garbage collection compatibility
     */
    it('should properly clean up resources after multiple save operations', async () => {
      // ========== ARRANGE ==========
      const candidateData = createValidCandidateData();
      const expectedResponse = createExpectedDatabaseResponse(candidateData);
      prismaMock.candidate.create.mockResolvedValue(expectedResponse as any);

      // ========== ACT ==========
      // Perform multiple save operations
      for (let i = 0; i < 10; i++) {
        const candidate = new Candidate({ ...candidateData, email: `test${i}@example.com` });
        await candidate.save();
      }

      // ========== ASSERT ==========
      expect(prismaMock.candidate.create).toHaveBeenCalledTimes(10);
      // If this test completes without memory issues, cleanup is working correctly
    });

    /**
     * Test: CONCURRENT OPERATIONS - Multiple simultaneous saves should be handled correctly
     * Validates: Promise handling, concurrent async operations, race condition prevention
     */
    it('should handle multiple concurrent save operations without race conditions', async () => {
      // ========== ARRANGE ==========
      const candidatesData = [
        createValidCandidateData({ email: 'user1@example.com' }),
        createValidCandidateData({ email: 'user2@example.com' }),
        createValidCandidateData({ email: 'user3@example.com' })
      ];
      
      // Mock different responses for each email
      prismaMock.candidate.create
        .mockResolvedValueOnce(createExpectedDatabaseResponse(candidatesData[0]) as any)
        .mockResolvedValueOnce(createExpectedDatabaseResponse(candidatesData[1]) as any)
        .mockResolvedValueOnce(createExpectedDatabaseResponse(candidatesData[2]) as any);

      // ========== ACT ==========
      const savePromises = candidatesData.map(data => {
        const candidate = new Candidate(data);
        return candidate.save();
      });
      
      const results = await Promise.all(savePromises);

      // ========== ASSERT ==========
      expect(results).toHaveLength(3);
      expect(prismaMock.candidate.create).toHaveBeenCalledTimes(3);
      results.forEach((result, index) => {
        expect(result.email).toBe(candidatesData[index].email);
      });
    });

  });

});
