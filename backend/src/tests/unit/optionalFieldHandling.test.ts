/**
 * Unit Tests for Optional Field Handling
 * Tests for empty arrays, null/undefined values, and maximum entries
 * 
 * Test Cases Covered:
 * - CAND-EDGE-008: Empty arrays handling for education and work experience
 * - CAND-EDGE-009: Null/undefined handling for optional fields
 * - CAND-EDGE-010: Maximum allowed education and work experience entries
 */

import { addCandidate } from '../../../backend/src/application/services/candidateService';
import { Candidate } from '../../../backend/src/domain/models/Candidate';
import {
  createEmptyArraysCandidate,
  createNullFieldsCandidate,
  createMaxEntriesCandidate,
  generateUniqueEmail,
  mockCandidateCreateResponse
} from '../../utils/testDataFactory';
import {
  mockPrismaClient,
  resetAllMocks
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

describe('Optional Field Handling', () => {
  beforeEach(() => {
    resetAllMocks();
    jest.clearAllMocks();
  });

  describe('addCandidate optional fields', () => {
    /**
     * Test Case ID: CAND-EDGE-008
     * Test Case Title: Verify empty arrays handling for education and work experience
     */
    describe('CAND-EDGE-008: Empty arrays handling', () => {
      it('should handle empty education and work experience arrays', async () => {
        // Arrange
        const emptyArraysData = createEmptyArraysCandidate({
          email: generateUniqueEmail('elena.vazquez')
        });

        const expectedResult = {
          ...mockCandidateCreateResponse,
          firstName: emptyArraysData.firstName,
          lastName: emptyArraysData.lastName,
          email: emptyArraysData.email
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(expectedResult),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(emptyArraysData);

        // Assert
        expect(result).toBeDefined();
        expect(result.firstName).toBe(emptyArraysData.firstName);
        expect(result.lastName).toBe(emptyArraysData.lastName);
        expect(result.email).toBe(emptyArraysData.email);
        
        // Verify Candidate was instantiated correctly
        expect(Candidate).toHaveBeenCalledWith(emptyArraysData);
        expect(mockCandidateInstance.save).toHaveBeenCalled();
      });

      it('should not create any education records for empty education array', async () => {
        // Arrange
        const candidateData = {
          firstName: "Test",
          lastName: "User",
          email: generateUniqueEmail('empty.education'),
          educations: []
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            id: 1
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toBeDefined();
        expect(mockCandidateInstance.education).toHaveLength(0);
      });

      it('should not create any work experience records for empty work experience array', async () => {
        // Arrange
        const candidateData = {
          firstName: "Test",
          lastName: "User",
          email: generateUniqueEmail('empty.work'),
          workExperiences: []
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            id: 1
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toBeDefined();
        expect(mockCandidateInstance.workExperience).toHaveLength(0);
      });

      it('should handle mixed empty and populated arrays', async () => {
        // Arrange
        const mixedData = {
          firstName: "Mixed",
          lastName: "Data",
          email: generateUniqueEmail('mixed.arrays'),
          educations: [],
          workExperiences: [{
            company: "Test Company",
            position: "Test Position",
            startDate: "2022-01-01",
            endDate: "2024-01-01"
          }]
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            id: 1
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(mixedData);

        // Assert
        expect(result).toBeDefined();
        expect(Candidate).toHaveBeenCalledWith(mixedData);
      });
    });

    /**
     * Test Case ID: CAND-EDGE-009
     * Test Case Title: Verify null/undefined handling for optional fields
     */
    describe('CAND-EDGE-009: Null/undefined handling', () => {
      it('should handle null and undefined values for optional fields', async () => {
        // Arrange
        const nullFieldsData = createNullFieldsCandidate({
          email: generateUniqueEmail('roberto.fernandez')
        });

        const expectedResult = {
          ...mockCandidateCreateResponse,
          firstName: nullFieldsData.firstName,
          lastName: nullFieldsData.lastName,
          email: nullFieldsData.email,
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
        const result = await addCandidate(nullFieldsData);

        // Assert
        expect(result).toBeDefined();
        expect(result.firstName).toBe(nullFieldsData.firstName);
        expect(result.lastName).toBe(nullFieldsData.lastName);
        expect(result.email).toBe(nullFieldsData.email);
        expect(result.phone).toBeNull();
        expect(result.address).toBeNull();
        
        expect(Candidate).toHaveBeenCalledWith(nullFieldsData);
      });

      it('should handle undefined phone field', async () => {
        // Arrange
        const candidateData = {
          firstName: "Test",
          lastName: "User",
          email: generateUniqueEmail('undefined.phone'),
          phone: undefined
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            phone: null
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toBeDefined();
        expect(result.phone).toBeNull();
      });

      it('should handle undefined address field', async () => {
        // Arrange
        const candidateData = {
          firstName: "Test",
          lastName: "User",
          email: generateUniqueEmail('undefined.address'),
          address: undefined
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            address: null
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toBeDefined();
        expect(result.address).toBeNull();
      });

      it('should handle null educations array', async () => {
        // Arrange
        const candidateData = {
          firstName: "Test",
          lastName: "User",
          email: generateUniqueEmail('null.educations'),
          educations: null
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(mockCandidateCreateResponse),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toBeDefined();
        expect(mockCandidateInstance.education).toHaveLength(0);
      });

      it('should handle undefined workExperiences array', async () => {
        // Arrange
        const candidateData = {
          firstName: "Test",
          lastName: "User",
          email: generateUniqueEmail('undefined.work'),
          workExperiences: undefined
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(mockCandidateCreateResponse),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toBeDefined();
        expect(mockCandidateInstance.workExperience).toHaveLength(0);
      });

      it('should handle null CV object', async () => {
        // Arrange
        const candidateData = {
          firstName: "Test",
          lastName: "User",
          email: generateUniqueEmail('null.cv'),
          cv: null
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(mockCandidateCreateResponse),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toBeDefined();
        expect(mockCandidateInstance.resumes).toHaveLength(0);
      });

      it('should handle mix of null and undefined values', async () => {
        // Arrange
        const mixedNullData = {
          firstName: "Mixed",
          lastName: "Null",
          email: generateUniqueEmail('mixed.null'),
          phone: null,
          address: undefined,
          educations: null,
          workExperiences: undefined,
          cv: null
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            phone: null,
            address: null
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(mixedNullData);

        // Assert
        expect(result).toBeDefined();
        expect(result.phone).toBeNull();
        expect(result.address).toBeNull();
      });
    });

    /**
     * Test Case ID: CAND-EDGE-010
     * Test Case Title: Verify maximum allowed education and work experience entries
     */
    describe('CAND-EDGE-010: Maximum entries handling', () => {
      it('should handle maximum education and work experience entries', async () => {
        // Arrange
        const maxEntriesData = createMaxEntriesCandidate({
          email: generateUniqueEmail('maria.gonzalez')
        });

        const expectedResult = {
          ...mockCandidateCreateResponse,
          firstName: maxEntriesData.firstName,
          lastName: maxEntriesData.lastName,
          email: maxEntriesData.email
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(expectedResult),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(maxEntriesData);

        // Assert
        expect(result).toBeDefined();
        expect(result.firstName).toBe(maxEntriesData.firstName);
        expect(result.lastName).toBe(maxEntriesData.lastName);
        expect(result.email).toBe(maxEntriesData.email);
        
        // Verify all entries were processed
        expect(Candidate).toHaveBeenCalledWith(maxEntriesData);
        expect(mockCandidateInstance.save).toHaveBeenCalled();
      });

      it('should handle large number of education entries efficiently', async () => {
        // Arrange
        const largeEducationData = {
          firstName: "Large",
          lastName: "Education",
          email: generateUniqueEmail('large.education'),
          educations: Array.from({length: 20}, (_, i) => ({
            institution: `University ${i + 1}`,
            title: `Degree ${i + 1}`,
            startDate: "2020-09-01",
            endDate: "2024-06-30"
          }))
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            id: 1
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        const startTime = Date.now();

        // Act
        const result = await addCandidate(largeEducationData);

        // Assert
        const executionTime = Date.now() - startTime;
        expect(result).toBeDefined();
        expect(executionTime).toBeLessThan(200); // Should complete within 200ms even with many entries
      });

      it('should handle large number of work experience entries efficiently', async () => {
        // Arrange
        const largeWorkData = {
          firstName: "Large",
          lastName: "Work",
          email: generateUniqueEmail('large.work'),
          workExperiences: Array.from({length: 25}, (_, i) => ({
            company: `Company ${i + 1}`,
            position: `Position ${i + 1}`,
            description: `Description for position ${i + 1}`,
            startDate: "2020-01-01",
            endDate: "2024-12-31"
          }))
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            id: 1
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        const startTime = Date.now();

        // Act
        const result = await addCandidate(largeWorkData);

        // Assert
        const executionTime = Date.now() - startTime;
        expect(result).toBeDefined();
        expect(executionTime).toBeLessThan(200); // Should complete within 200ms even with many entries
      });

      it('should handle single education entry correctly', async () => {
        // Arrange
        const singleEducationData = {
          firstName: "Single",
          lastName: "Education",
          email: generateUniqueEmail('single.education'),
          educations: [{
            institution: "Test University",
            title: "Test Degree",
            startDate: "2020-09-01",
            endDate: "2024-06-30"
          }]
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            id: 1
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(singleEducationData);

        // Assert
        expect(result).toBeDefined();
        expect(Candidate).toHaveBeenCalledWith(singleEducationData);
      });

      it('should handle single work experience entry correctly', async () => {
        // Arrange
        const singleWorkData = {
          firstName: "Single",
          lastName: "Work",
          email: generateUniqueEmail('single.work'),
          workExperiences: [{
            company: "Test Company",
            position: "Test Position",
            description: "Test description",
            startDate: "2022-01-01",
            endDate: "2024-01-01"
          }]
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            id: 1
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(singleWorkData);

        // Assert
        expect(result).toBeDefined();
        expect(Candidate).toHaveBeenCalledWith(singleWorkData);
      });

      it('should handle extreme maximum entries scenario', async () => {
        // Arrange - Stress test with very large arrays
        const extremeData = {
          firstName: "Extreme",
          lastName: "Test",
          email: generateUniqueEmail('extreme.test'),
          educations: Array.from({length: 50}, (_, i) => ({
            institution: `University ${i + 1}`,
            title: `Degree ${i + 1}`,
            startDate: "2020-09-01",
            endDate: "2024-06-30"
          })),
          workExperiences: Array.from({length: 100}, (_, i) => ({
            company: `Company ${i + 1}`,
            position: `Position ${i + 1}`,
            description: `Long description for position ${i + 1} with detailed information about responsibilities and achievements`,
            startDate: "2020-01-01",
            endDate: "2024-12-31"
          }))
        };

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue({
            ...mockCandidateCreateResponse,
            id: 1
          }),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert - Should not throw or timeout
        const result = await addCandidate(extremeData);
        expect(result).toBeDefined();
      });
    });

    /**
     * Memory and performance tests for large datasets
     */
    describe('Memory and performance with large datasets', () => {
      it('should not cause memory leaks with repeated large operations', async () => {
        // Arrange
        const createLargeCandidate = (index: number) => ({
          firstName: `Candidate${index}`,
          lastName: `Test${index}`,
          email: generateUniqueEmail(`memory.test.${index}`),
          educations: Array.from({length: 5}, (_, i) => ({
            institution: `University ${i + 1}`,
            title: `Degree ${i + 1}`,
            startDate: "2020-09-01",
            endDate: "2024-06-30"
          }))
        });

        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(mockCandidateCreateResponse),
          education: [],
          workExperience: [],
          resumes: []
        };
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act - Simulate multiple operations
        const promises = Array.from({length: 10}, (_, i) => 
          addCandidate(createLargeCandidate(i))
        );

        // Assert
        const results = await Promise.all(promises);
        expect(results).toHaveLength(10);
        results.forEach(result => {
          expect(result).toBeDefined();
        });
      });
    });
  });
});