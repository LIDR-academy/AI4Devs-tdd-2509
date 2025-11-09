/**
 * Unit Tests for Validation Logic
 * Tests for validator.validateCandidateData() and related validation functions
 * 
 * Test Cases Covered:
 * - CAND-EDGE-001: Missing required fields validation
 * - CAND-EDGE-002: Field length boundary validation
 * - CAND-EDGE-003: Special characters in names validation
 * - CAND-EDGE-004: Invalid date format validation
 * - CAND-EDGE-005: Phone number format validation
 * - CAND-EDGE-006: CV data validation
 */

import { validateCandidateData } from '../../../backend/src/application/validator';
import {
  createInvalidCandidate,
  createBoundaryTestCandidate,
  createSpecialCharCandidate,
  createInvalidDateCandidate,
  createInvalidPhoneCandidate,
  createInvalidCVCandidate,
  generateUniqueEmail
} from '../../utils/testDataFactory';

// Mock the validator module if needed
jest.mock('../../../backend/src/application/validator', () => {
  const actual = jest.requireActual('../../../backend/src/application/validator');
  return {
    ...actual,
    validateCandidateData: jest.fn(actual.validateCandidateData)
  };
});

describe('Validation Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateCandidateData', () => {
    /**
     * Test Case ID: CAND-EDGE-001
     * Test Case Title: Verify rejection of candidate with missing required fields
     */
    describe('CAND-EDGE-001: Missing required fields validation', () => {
      it('should throw error for empty firstName', () => {
        // Arrange
        const invalidCandidateData = createInvalidCandidate({
          firstName: "",
          lastName: "López",
          email: generateUniqueEmail('valid')
        });

        // Act & Assert
        expect(() => validateCandidateData(invalidCandidateData))
          .toThrow('Invalid name');
      });

      it('should throw error for missing firstName', () => {
        // Arrange
        const invalidData = {
          lastName: "López",
          email: generateUniqueEmail('missing.firstname')
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid name');
      });

      it('should throw error for empty lastName', () => {
        // Arrange
        const invalidData = {
          firstName: "Valid",
          lastName: "",
          email: generateUniqueEmail('empty.lastname')
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid name');
      });

      it('should throw error for missing lastName', () => {
        // Arrange
        const invalidData = {
          firstName: "Valid",
          email: generateUniqueEmail('missing.lastname')
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid name');
      });

      it('should throw error for invalid email format', () => {
        // Arrange
        const invalidData = {
          firstName: "Valid",
          lastName: "Name",
          email: "invalid-email"
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid email');
      });

      it('should throw error for missing email', () => {
        // Arrange
        const invalidData = {
          firstName: "Valid",
          lastName: "Name"
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid email');
      });
    });

    /**
     * Test Case ID: CAND-EDGE-002
     * Test Case Title: Verify field length boundary validation
     */
    describe('CAND-EDGE-002: Field length boundary validation', () => {
      it('should reject firstName exceeding 100 characters', () => {
        // Arrange
        const boundaryTestData = createBoundaryTestCandidate({
          firstName: "A".repeat(101), // Exceeds 100 char limit
          lastName: "Valid Name",
          email: generateUniqueEmail('boundary.firstname')
        });

        // Act & Assert
        expect(() => validateCandidateData(boundaryTestData))
          .toThrow('Invalid name');
      });

      it('should reject lastName exceeding 100 characters', () => {
        // Arrange
        const boundaryTestData = {
          firstName: "Valid Name",
          lastName: "B".repeat(101), // Exceeds 100 char limit
          email: generateUniqueEmail('boundary.lastname')
        };

        // Act & Assert
        expect(() => validateCandidateData(boundaryTestData))
          .toThrow('Invalid name');
      });

      it('should reject address exceeding 100 characters', () => {
        // Arrange
        const boundaryTestData = {
          firstName: "Valid",
          lastName: "Name",
          email: generateUniqueEmail('boundary.address'),
          address: "A".repeat(101) // Exceeds 100 char limit
        };

        // Act & Assert
        expect(() => validateCandidateData(boundaryTestData))
          .toThrow('Invalid address');
      });

      it('should accept firstName at exactly 100 characters', () => {
        // Arrange
        const validData = {
          firstName: "A".repeat(100), // Exactly 100 characters
          lastName: "Valid Name",
          email: generateUniqueEmail('boundary.valid.firstname')
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should accept firstName at minimum 2 characters', () => {
        // Arrange
        const validData = {
          firstName: "AB", // Minimum 2 characters
          lastName: "Valid Name",
          email: generateUniqueEmail('boundary.min.firstname')
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should reject firstName with only 1 character', () => {
        // Arrange
        const invalidData = {
          firstName: "A", // Below minimum 2 characters
          lastName: "Valid Name",
          email: generateUniqueEmail('boundary.short.firstname')
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid name');
      });
    });

    /**
     * Test Case ID: CAND-EDGE-003
     * Test Case Title: Verify special characters in names are handled correctly
     */
    describe('CAND-EDGE-003: Special characters in names validation', () => {
      it('should accept names with Spanish accents and special characters', () => {
        // Arrange
        const specialCharData = createSpecialCharCandidate({
          email: generateUniqueEmail('jose.rodriguez')
        });

        // Act & Assert
        expect(() => validateCandidateData(specialCharData)).not.toThrow();
      });

      it('should accept names with spaces', () => {
        // Arrange
        const validData = {
          firstName: "José María",
          lastName: "Rodríguez López",
          email: generateUniqueEmail('spaces.test')
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should accept names with hyphens', () => {
        // Arrange
        const validData = {
          firstName: "Ana-Belén",
          lastName: "Martín-García",
          email: generateUniqueEmail('hyphen.test')
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should reject names with numbers', () => {
        // Arrange
        const invalidData = {
          firstName: "John123",
          lastName: "Doe",
          email: generateUniqueEmail('numbers.test')
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid name');
      });

      it('should reject names with special symbols', () => {
        // Arrange
        const invalidData = {
          firstName: "John@",
          lastName: "Doe#",
          email: generateUniqueEmail('symbols.test')
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid name');
      });
    });

    /**
     * Test Case ID: CAND-EDGE-004
     * Test Case Title: Verify invalid date format validation
     */
    describe('CAND-EDGE-004: Invalid date format validation', () => {
      it('should reject education with invalid date format', () => {
        // Arrange
        const invalidDateData = createInvalidDateCandidate({
          email: generateUniqueEmail('invalid.education.date')
        });

        // Act & Assert
        expect(() => validateCandidateData(invalidDateData))
          .toThrow('Invalid date');
      });

      it('should reject work experience with invalid start date format', () => {
        // Arrange
        const invalidData = {
          firstName: "Carlos",
          lastName: "Ruiz",
          email: generateUniqueEmail('invalid.work.date'),
          workExperiences: [{
            company: "Test Corp",
            position: "Developer",
            startDate: "01/15/2022", // Invalid format
            endDate: "2024-06-30"
          }]
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid date');
      });

      it('should reject work experience with invalid end date format', () => {
        // Arrange
        const invalidData = {
          firstName: "Carlos",
          lastName: "Ruiz",
          email: generateUniqueEmail('invalid.work.enddate'),
          workExperiences: [{
            company: "Test Corp",
            position: "Developer",
            startDate: "2022-01-15",
            endDate: "June 30, 2024" // Invalid format
          }]
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid end date');
      });

      it('should accept valid date formats', () => {
        // Arrange
        const validData = {
          firstName: "Carlos",
          lastName: "Ruiz",
          email: generateUniqueEmail('valid.dates'),
          educations: [{
            institution: "University",
            title: "Degree",
            startDate: "2018-09-01",
            endDate: "2022-06-30"
          }],
          workExperiences: [{
            company: "Test Corp",
            position: "Developer",
            startDate: "2022-07-01",
            endDate: "2024-12-31"
          }]
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should accept education without end date', () => {
        // Arrange
        const validData = {
          firstName: "Carlos",
          lastName: "Ruiz",
          email: generateUniqueEmail('no.enddate'),
          educations: [{
            institution: "University",
            title: "Ongoing Degree",
            startDate: "2022-09-01"
            // No endDate - should be valid
          }]
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });
    });

    /**
     * Test Case ID: CAND-EDGE-005
     * Test Case Title: Verify phone number format validation
     */
    describe('CAND-EDGE-005: Phone number format validation', () => {
      it('should reject phone number not starting with 6, 7, or 9', () => {
        // Arrange
        const invalidPhoneData = createInvalidPhoneCandidate({
          email: generateUniqueEmail('invalid.phone')
        });

        // Act & Assert
        expect(() => validateCandidateData(invalidPhoneData))
          .toThrow('Invalid phone');
      });

      it('should reject phone number with incorrect length', () => {
        // Arrange
        const invalidData = {
          firstName: "Luis",
          lastName: "Martín",
          email: generateUniqueEmail('short.phone'),
          phone: "61234567" // Too short (8 digits instead of 9)
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid phone');
      });

      it('should reject phone number with too many digits', () => {
        // Arrange
        const invalidData = {
          firstName: "Luis",
          lastName: "Martín",
          email: generateUniqueEmail('long.phone'),
          phone: "6123456789" // Too long (10 digits instead of 9)
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid phone');
      });

      it('should accept valid phone numbers starting with 6', () => {
        // Arrange
        const validData = {
          firstName: "Luis",
          lastName: "Martín",
          email: generateUniqueEmail('valid.phone.6'),
          phone: "612345678"
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should accept valid phone numbers starting with 7', () => {
        // Arrange
        const validData = {
          firstName: "Luis",
          lastName: "Martín",
          email: generateUniqueEmail('valid.phone.7'),
          phone: "712345678"
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should accept valid phone numbers starting with 9', () => {
        // Arrange
        const validData = {
          firstName: "Luis",
          lastName: "Martín",
          email: generateUniqueEmail('valid.phone.9'),
          phone: "912345678"
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should accept undefined phone number', () => {
        // Arrange
        const validData = {
          firstName: "Luis",
          lastName: "Martín",
          email: generateUniqueEmail('no.phone')
          // No phone number - should be valid
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should reject phone with non-numeric characters', () => {
        // Arrange
        const invalidData = {
          firstName: "Luis",
          lastName: "Martín",
          email: generateUniqueEmail('alpha.phone'),
          phone: "6123456ab"
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid phone');
      });
    });

    /**
     * Test Case ID: CAND-EDGE-006
     * Test Case Title: Verify CV data validation
     */
    describe('CAND-EDGE-006: CV data validation', () => {
      it('should reject CV with null filePath', () => {
        // Arrange
        const invalidCVData = createInvalidCVCandidate({
          email: generateUniqueEmail('null.filepath')
        });

        // Act & Assert
        expect(() => validateCandidateData(invalidCVData))
          .toThrow('Invalid CV data');
      });

      it('should reject CV with missing filePath', () => {
        // Arrange
        const invalidData = {
          firstName: "Carmen",
          lastName: "Sánchez",
          email: generateUniqueEmail('missing.filepath'),
          cv: {
            fileType: "application/pdf"
            // Missing filePath
          }
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid CV data');
      });

      it('should reject CV with missing fileType', () => {
        // Arrange
        const invalidData = {
          firstName: "Carmen",
          lastName: "Sánchez",
          email: generateUniqueEmail('missing.filetype'),
          cv: {
            filePath: "uploads/cv-test.pdf"
            // Missing fileType
          }
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid CV data');
      });

      it('should reject CV with non-string filePath', () => {
        // Arrange
        const invalidData = {
          firstName: "Carmen",
          lastName: "Sánchez",
          email: generateUniqueEmail('numeric.filepath'),
          cv: {
            filePath: 123,
            fileType: "application/pdf"
          }
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid CV data');
      });

      it('should reject CV with non-string fileType', () => {
        // Arrange
        const invalidData = {
          firstName: "Carmen",
          lastName: "Sánchez",
          email: generateUniqueEmail('numeric.filetype'),
          cv: {
            filePath: "uploads/cv-test.pdf",
            fileType: 123
          }
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData))
          .toThrow('Invalid CV data');
      });

      it('should accept valid CV data', () => {
        // Arrange
        const validData = {
          firstName: "Carmen",
          lastName: "Sánchez",
          email: generateUniqueEmail('valid.cv'),
          cv: {
            filePath: "uploads/cv-carmen-sanchez.pdf",
            fileType: "application/pdf"
          }
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should accept undefined CV', () => {
        // Arrange
        const validData = {
          firstName: "Carmen",
          lastName: "Sánchez",
          email: generateUniqueEmail('no.cv')
          // No CV - should be valid
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should accept empty CV object', () => {
        // Arrange
        const validData = {
          firstName: "Carmen",
          lastName: "Sánchez",
          email: generateUniqueEmail('empty.cv'),
          cv: {}
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });
    });

    /**
     * Edge cases for validation skip when ID is provided
     */
    describe('Validation skip for existing candidates', () => {
      it('should skip validation when candidate ID is provided', () => {
        // Arrange
        const candidateWithId = {
          id: 1,
          firstName: "", // This would normally fail validation
          lastName: "",
          email: "invalid-email"
        };

        // Act & Assert
        expect(() => validateCandidateData(candidateWithId)).not.toThrow();
      });
    });
  });
});