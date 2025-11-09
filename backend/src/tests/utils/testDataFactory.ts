/**
 * Test Data Factory
 * Creates consistent test data for candidate-related tests
 */

export interface TestCandidateData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: TestEducationData[];
  workExperiences?: TestWorkExperienceData[];
  cv?: TestCVData;
}

export interface TestEducationData {
  institution: string;
  title: string;
  startDate: string;
  endDate?: string;
}

export interface TestWorkExperienceData {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

export interface TestCVData {
  filePath: string;
  fileType: string;
}

/**
 * Creates a valid complete candidate with all fields
 */
export const createValidCompleteCandidate = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => {
  return {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@example.com",
    phone: "612345678",
    address: "Calle Mayor 123, Madrid",
    educations: [{
      institution: "Universidad Complutense",
      title: "Computer Science",
      startDate: "2018-09-01",
      endDate: "2022-06-30"
    }],
    workExperiences: [{
      company: "Tech Corp",
      position: "Software Developer",
      description: "Full-stack development", 
      startDate: "2022-07-01",
      endDate: "2024-12-31"
    }],
    cv: {
      filePath: "uploads/cv-juan-perez.pdf",
      fileType: "application/pdf"
    },
    ...overrides
  };
};

/**
 * Creates a minimal candidate with only required fields
 */
export const createMinimalCandidate = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => {
  return {
    firstName: "Ana",
    lastName: "García", 
    email: "ana.garcia@example.com",
    ...overrides
  };
};

/**
 * Creates candidate data for boundary testing
 */
export const createBoundaryTestCandidate = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => {
  return {
    firstName: "A".repeat(101), // Exceeds 100 char limit
    lastName: "Valid Name",
    email: "test@example.com",
    address: "A".repeat(101), // Exceeds 100 char limit
    ...overrides
  };
};

/**
 * Creates candidate with special characters
 */
export const createSpecialCharCandidate = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => {
  return {
    firstName: "José María",
    lastName: "Rodríguez-López",
    email: "jose.rodriguez@example.com",
    ...overrides
  };
};

/**
 * Creates candidate with invalid data
 */
export const createInvalidCandidate = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => {
  return {
    firstName: "",
    lastName: "López",
    email: "invalid-email",
    ...overrides
  };
};

/**
 * Creates candidate with invalid date formats
 */
export const createInvalidDateCandidate = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => {
  return {
    firstName: "Carlos",
    lastName: "Ruiz",
    email: "carlos.ruiz@example.com",
    educations: [{
      institution: "University",
      title: "Degree",
      startDate: "2022/01/15", // Invalid format
      endDate: "2024-06-30"
    }],
    ...overrides
  };
};

/**
 * Creates candidate with invalid phone format
 */
export const createInvalidPhoneCandidate = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => {
  return {
    firstName: "Luis",
    lastName: "Martín",
    email: "luis.martin@example.com",
    phone: "123456789", // Invalid: doesn't start with 6, 7, or 9
    ...overrides
  };
};

/**
 * Creates candidate with invalid CV data
 */
export const createInvalidCVCandidate = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => {
  return {
    firstName: "Carmen",
    lastName: "Sánchez",
    email: "carmen.sanchez@example.com",
    cv: {
      filePath: null as any, // Invalid: null filePath
      fileType: "application/pdf"
    },
    ...overrides
  };
};

/**
 * Creates candidate with empty arrays
 */
export const createEmptyArraysCandidate = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => {
  return {
    firstName: "Elena",
    lastName: "Vázquez",
    email: "elena.vazquez@example.com",
    educations: [],
    workExperiences: [],
    ...overrides
  };
};

/**
 * Creates candidate with null/undefined fields
 */
export const createNullFieldsCandidate = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => {
  return {
    firstName: "Roberto",
    lastName: "Fernández", 
    email: "roberto.fernandez@example.com",
    phone: null as any,
    address: undefined,
    educations: null as any,
    workExperiences: undefined,
    cv: null as any,
    ...overrides
  };
};

/**
 * Creates candidate with maximum entries
 */
export const createMaxEntriesCandidate = (overrides: Partial<TestCandidateData> = {}): TestCandidateData => {
  return {
    firstName: "María",
    lastName: "González",
    email: "maria.gonzalez@example.com",
    educations: Array.from({length: 10}, (_, i) => ({
      institution: `University ${i + 1}`,
      title: `Degree ${i + 1}`,
      startDate: "2020-09-01",
      endDate: "2024-06-30"
    })),
    workExperiences: Array.from({length: 15}, (_, i) => ({
      company: `Company ${i + 1}`,
      position: `Position ${i + 1}`,
      description: `Description ${i + 1}`,
      startDate: "2020-01-01",
      endDate: "2024-12-31"
    })),
    ...overrides
  };
};

/**
 * Generates unique email for test isolation
 */
export const generateUniqueEmail = (prefix: string = 'test'): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}.${timestamp}.${random}@example.com`;
};

/**
 * Creates test database candidate result
 */
export const createMockDatabaseResult = (candidateData: TestCandidateData, id: number = 1) => {
  return {
    id,
    firstName: candidateData.firstName,
    lastName: candidateData.lastName,
    email: candidateData.email,
    phone: candidateData.phone || null,
    address: candidateData.address || null,
    createdAt: new Date('2025-11-09T10:00:00.000Z'),
    updatedAt: new Date('2025-11-09T10:00:00.000Z')
  };
};