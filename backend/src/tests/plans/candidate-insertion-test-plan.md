# Test Plan: Candidate Insertion Logic

## Overview
**Project:** LTI - Talent Tracking System  
**Module:** Backend - Candidate Management  
**Test Scope:** Candidate insertion logic and validation  
**Test Type:** Unit Tests  
**Created:** November 9, 2025  
**Version:** 1.0  

## Tech Stack Under Test
- **Backend:** Express.js with TypeScript
- **ORM:** Prisma with PostgreSQL
- **File Handling:** Multer
- **Validation:** Custom validation layer

## Components Under Test
- `candidateService.addCandidate()`
- `validator.validateCandidateData()`
- `Candidate.save()` domain model
- `candidateController.addCandidateController()`

## Test Environment Setup
```typescript
// Test dependencies
import { addCandidate } from '../../backend/src/application/services/candidateService';
import { validateCandidateData } from '../../backend/src/application/validator';
import { Candidate } from '../../backend/src/domain/models/Candidate';
import { PrismaClient } from '@prisma/client';
```

---

## Priority/Impact Analysis

### **🔴 HIGH PRIORITY (Critical Path)**
| Priority | Test Case | Impact | Risk Level |
|----------|-----------|---------|------------|
| 1 | Valid Complete Candidate Creation | HIGH | HIGH |
| 2 | Email Uniqueness Validation | HIGH | HIGH |
| 3 | Required Field Validation | HIGH | MEDIUM |
| 4 | Database Connection Failures | HIGH | HIGH |

### **🟡 MEDIUM PRIORITY (Important Edge Cases)**
| Priority | Test Case | Impact | Risk Level |
|----------|-----------|---------|------------|
| 5 | Boundary Value Testing | MEDIUM | MEDIUM |
| 6 | Date Format Validation | MEDIUM | LOW |
| 7 | Special Characters in Names | MEDIUM | LOW |
| 8 | CV File Validation | MEDIUM | MEDIUM |

### **🟢 LOW PRIORITY (Edge Cases)**
| Priority | Test Case | Impact | Risk Level |
|----------|-----------|---------|------------|
| 9 | Empty Arrays Handling | LOW | LOW |
| 10 | Null/Undefined Field Handling | LOW | LOW |
| 11 | Transaction Rollback Scenarios | LOW | MEDIUM |

---

## Test Cases

## 📋 Common Use Cases

### **Test Case ID:** CAND-001
**Test Case Title/Description:** Verify successful creation of candidate with complete valid data  
**Module/Component Under Test:** `candidateService.addCandidate()`  

**Preconditions/Setup (Arrange):**
```typescript
const validCandidateData = {
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
    }
};
```

**Test Steps/Action (Act):**
```typescript
const result = await addCandidate(validCandidateData);
```

**Expected Result (Assert):**
```typescript
expect(result).toBeDefined();
expect(result.id).toBeGreaterThan(0);
expect(result.firstName).toBe("Juan");
expect(result.lastName).toBe("Pérez");
expect(result.email).toBe("juan.perez@example.com");
expect(result.phone).toBe("612345678");
expect(result.address).toBe("Calle Mayor 123, Madrid");
```

**Post-conditions/Cleanup:** Clean up created candidate from database  
**Test Data:** Complete valid candidate with education, work experience, and CV  
**Status:** [Pass/Fail]  
**Comments/Notes:** Tests the happy path scenario with all optional fields provided  

---

### **Test Case ID:** CAND-002
**Test Case Title/Description:** Verify candidate creation with minimum required fields only  
**Module/Component Under Test:** `candidateService.addCandidate()`  

**Preconditions/Setup (Arrange):**
```typescript
const minimalCandidateData = {
    firstName: "Ana",
    lastName: "García",
    email: "ana.garcia@example.com"
};
```

**Test Steps/Action (Act):**
```typescript
const result = await addCandidate(minimalCandidateData);
```

**Expected Result (Assert):**
```typescript
expect(result).toBeDefined();
expect(result.firstName).toBe("Ana");
expect(result.lastName).toBe("García");
expect(result.email).toBe("ana.garcia@example.com");
expect(result.phone).toBeNull();
expect(result.address).toBeNull();
```

**Post-conditions/Cleanup:** Clean up created candidate  
**Test Data:** Only required fields: firstName, lastName, email  
**Status:** [Pass/Fail]  
**Comments/Notes:** Verifies system handles optional fields gracefully  

---

### **Test Case ID:** CAND-003
**Test Case Title/Description:** Verify duplicate email rejection  
**Module/Component Under Test:** `candidateService.addCandidate()`  

**Preconditions/Setup (Arrange):**
```typescript
// First, create a candidate
const existingCandidate = {
    firstName: "Pedro",
    lastName: "Martín",
    email: "pedro.martin@example.com"
};
await addCandidate(existingCandidate);

// Try to create another with same email
const duplicateCandidateData = {
    firstName: "Pablo",
    lastName: "Martínez",
    email: "pedro.martin@example.com"
};
```

**Test Steps/Action (Act):**
```typescript
const result = addCandidate(duplicateCandidateData);
```

**Expected Result (Assert):**
```typescript
await expect(result).rejects.toThrow('The email already exists in the database');
```

**Post-conditions/Cleanup:** Remove test candidates  
**Test Data:** Duplicate email addresses  
**Status:** [Pass/Fail]  
**Comments/Notes:** Critical for maintaining data integrity  

---

## 🔍 Edge Cases

### **Test Case ID:** CAND-EDGE-001
**Test Case Title/Description:** Verify rejection of candidate with missing required fields  
**Module/Component Under Test:** `validateCandidateData()`  

**Preconditions/Setup (Arrange):**
```typescript
const invalidCandidateData = {
    firstName: "",
    lastName: "López",
    email: "invalid-email"
};
```

**Test Steps/Action (Act):**
```typescript
const result = addCandidate(invalidCandidateData);
```

**Expected Result (Assert):**
```typescript
await expect(result).rejects.toThrow('Invalid name');
```

**Post-conditions/Cleanup:** None required (no data created)  
**Test Data:** Empty firstName, invalid email format  
**Status:** [Pass/Fail]  
**Comments/Notes:** Tests input validation robustness  

---

### **Test Case ID:** CAND-EDGE-002
**Test Case Title/Description:** Verify field length boundary validation  
**Module/Component Under Test:** `validateCandidateData()`  

**Preconditions/Setup (Arrange):**
```typescript
const boundaryTestData = {
    firstName: "A".repeat(101), // Exceeds 100 char limit
    lastName: "Valid Name",
    email: "test@example.com",
    address: "A".repeat(101) // Exceeds 100 char limit
};
```

**Test Steps/Action (Act):**
```typescript
const result = addCandidate(boundaryTestData);
```

**Expected Result (Assert):**
```typescript
await expect(result).rejects.toThrow('Invalid name');
```

**Post-conditions/Cleanup:** None required  
**Test Data:** Fields exceeding maximum length limits  
**Status:** [Pass/Fail]  
**Comments/Notes:** Ensures database constraints are enforced  

---

### **Test Case ID:** CAND-EDGE-003
**Test Case Title/Description:** Verify special characters in names are handled correctly  
**Module/Component Under Test:** `validateCandidateData()`  

**Preconditions/Setup (Arrange):**
```typescript
const specialCharData = {
    firstName: "José María",
    lastName: "Rodríguez-López",
    email: "jose.rodriguez@example.com"
};
```

**Test Steps/Action (Act):**
```typescript
const result = await addCandidate(specialCharData);
```

**Expected Result (Assert):**
```typescript
expect(result).toBeDefined();
expect(result.firstName).toBe("José María");
expect(result.lastName).toBe("Rodríguez-López");
```

**Post-conditions/Cleanup:** Clean up created candidate  
**Test Data:** Names with Spanish accents and hyphens  
**Status:** [Pass/Fail]  
**Comments/Notes:** Important for international name support  

---

### **Test Case ID:** CAND-EDGE-004
**Test Case Title/Description:** Verify invalid date format rejection  
**Module/Component Under Test:** `validateEducation()` and `validateExperience()`  

**Preconditions/Setup (Arrange):**
```typescript
const invalidDateData = {
    firstName: "Carlos",
    lastName: "Ruiz",
    email: "carlos.ruiz@example.com",
    educations: [{
        institution: "University",
        title: "Degree",
        startDate: "2022/01/15", // Invalid format
        endDate: "2024-06-30"
    }]
};
```

**Test Steps/Action (Act):**
```typescript
const result = addCandidate(invalidDateData);
```

**Expected Result (Assert):**
```typescript
await expect(result).rejects.toThrow('Invalid date');
```

**Post-conditions/Cleanup:** None required  
**Test Data:** Date in wrong format (YYYY/MM/DD instead of YYYY-MM-DD)  
**Status:** [Pass/Fail]  
**Comments/Notes:** Ensures consistent date formatting  

---

### **Test Case ID:** CAND-EDGE-005
**Test Case Title/Description:** Verify phone number format validation  
**Module/Component Under Test:** `validatePhone()`  

**Preconditions/Setup (Arrange):**
```typescript
const invalidPhoneData = {
    firstName: "Luis",
    lastName: "Martín",
    email: "luis.martin@example.com",
    phone: "123456789" // Invalid: doesn't start with 6, 7, or 9
};
```

**Test Steps/Action (Act):**
```typescript
const result = addCandidate(invalidPhoneData);
```

**Expected Result (Assert):**
```typescript
await expect(result).rejects.toThrow('Invalid phone');
```

**Post-conditions/Cleanup:** None required  
**Test Data:** Phone number not matching Spanish format  
**Status:** [Pass/Fail]  
**Comments/Notes:** Validates Spanish phone number format  

---

### **Test Case ID:** CAND-EDGE-006
**Test Case Title/Description:** Verify CV data validation  
**Module/Component Under Test:** `validateCV()`  

**Preconditions/Setup (Arrange):**
```typescript
const invalidCVData = {
    firstName: "Carmen",
    lastName: "Sánchez",
    email: "carmen.sanchez@example.com",
    cv: {
        filePath: null, // Invalid: null filePath
        fileType: "application/pdf"
    }
};
```

**Test Steps/Action (Act):**
```typescript
const result = addCandidate(invalidCVData);
```

**Expected Result (Assert):**
```typescript
await expect(result).rejects.toThrow('Invalid CV data');
```

**Post-conditions/Cleanup:** None required  
**Test Data:** CV object with null filePath  
**Status:** [Pass/Fail]  
**Comments/Notes:** Ensures CV data integrity  

---

### **Test Case ID:** CAND-EDGE-007
**Test Case Title/Description:** Verify database connection failure handling  
**Module/Component Under Test:** `Candidate.save()`  

**Preconditions/Setup (Arrange):**
```typescript
const validData = {
    firstName: "TestUser",
    lastName: "TestLastName",
    email: "test@example.com"
};
// Mock database connection failure
jest.spyOn(prisma.candidate, 'create').mockImplementation(() => {
    throw new Prisma.PrismaClientInitializationError('Connection failed', '1.0.0');
});
```

**Test Steps/Action (Act):**
```typescript
const result = addCandidate(validData);
```

**Expected Result (Assert):**
```typescript
await expect(result).rejects.toThrow('No se pudo conectar con la base de datos');
```

**Post-conditions/Cleanup:** Restore database mock  
**Test Data:** Valid candidate data with simulated DB failure  
**Status:** [Pass/Fail]  
**Comments/Notes:** Tests system resilience to database issues  

---

### **Test Case ID:** CAND-EDGE-008
**Test Case Title/Description:** Verify empty arrays handling for education and work experience  
**Module/Component Under Test:** `candidateService.addCandidate()`  

**Preconditions/Setup (Arrange):**
```typescript
const emptyArraysData = {
    firstName: "Elena",
    lastName: "Vázquez",
    email: "elena.vazquez@example.com",
    educations: [],
    workExperiences: []
};
```

**Test Steps/Action (Act):**
```typescript
const result = await addCandidate(emptyArraysData);
```

**Expected Result (Assert):**
```typescript
expect(result).toBeDefined();
expect(result.firstName).toBe("Elena");
// Should not create any education or work experience records
```

**Post-conditions/Cleanup:** Clean up created candidate  
**Test Data:** Empty arrays for optional nested objects  
**Status:** [Pass/Fail]  
**Comments/Notes:** Ensures empty arrays don't cause issues  

---

### **Test Case ID:** CAND-EDGE-009
**Test Case Title/Description:** Verify null/undefined handling for optional fields  
**Module/Component Under Test:** `candidateService.addCandidate()`  

**Preconditions/Setup (Arrange):**
```typescript
const nullFieldsData = {
    firstName: "Roberto",
    lastName: "Fernández",
    email: "roberto.fernandez@example.com",
    phone: null,
    address: undefined,
    educations: null,
    workExperiences: undefined,
    cv: null
};
```

**Test Steps/Action (Act):**
```typescript
const result = await addCandidate(nullFieldsData);
```

**Expected Result (Assert):**
```typescript
expect(result).toBeDefined();
expect(result.firstName).toBe("Roberto");
expect(result.phone).toBeNull();
expect(result.address).toBeNull();
```

**Post-conditions/Cleanup:** Clean up created candidate  
**Test Data:** Null and undefined values for optional fields  
**Status:** [Pass/Fail]  
**Comments/Notes:** Tests defensive programming for optional fields  

---

### **Test Case ID:** CAND-EDGE-010
**Test Case Title/Description:** Verify maximum allowed education and work experience entries  
**Module/Component Under Test:** `candidateService.addCandidate()`  

**Preconditions/Setup (Arrange):**
```typescript
const maxEntriesData = {
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
    }))
};
```

**Test Steps/Action (Act):**
```typescript
const result = await addCandidate(maxEntriesData);
```

**Expected Result (Assert):**
```typescript
expect(result).toBeDefined();
expect(result.firstName).toBe("María");
// Verify all entries were created successfully
```

**Post-conditions/Cleanup:** Clean up created candidate and related records  
**Test Data:** Multiple education and work experience entries  
**Status:** [Pass/Fail]  
**Comments/Notes:** Tests system behavior with many related records  

---

## Test Execution Strategy

### **Test Environment Requirements**
- Node.js >= 16.x
- PostgreSQL test database
- Jest testing framework
- Prisma test client
- Docker for database isolation

### **Test Data Management**
- Use separate test database
- Implement proper cleanup after each test
- Use factories for test data generation
- Isolate tests to prevent data pollution

### **Mock Strategy**
- Mock external dependencies (file system, email services)
- Use test database for Prisma operations
- Mock time-dependent operations
- Isolate third-party service calls

### **Performance Criteria**
- Each unit test should complete within 100ms
- Database operations should be optimized
- Use transaction rollbacks for faster cleanup
- Parallel test execution where possible

### **Coverage Goals**
- **Unit Test Coverage:** > 90%
- **Branch Coverage:** > 85%
- **Critical Path Coverage:** 100%
- **Edge Case Coverage:** > 80%

---

## Test Automation Integration

### **CI/CD Pipeline Integration**
```yaml
# Example GitHub Actions configuration
- name: Run Unit Tests
  run: |
    npm test -- --coverage
    npm run test:candidate-insertion
```

### **Pre-commit Hooks**
- Run relevant unit tests before commit
- Validate test file naming conventions
- Check test coverage thresholds

### **Reporting**
- Generate HTML coverage reports
- Export test results in JUnit format
- Track test execution metrics over time

---

## Maintenance and Updates

### **Test Review Schedule**
- Weekly review of failing tests
- Monthly test case relevance review  
- Quarterly test plan updates
- Annual comprehensive test strategy review

### **Version Control**
- Tag test plan versions with release versions
- Maintain backward compatibility for critical tests
- Document test changes in commit messages
- Link test updates to feature implementations

---

**Document Control:**
- **Created by:** QA Team
- **Approved by:** Tech Lead
- **Last Updated:** November 9, 2025
- **Next Review:** December 9, 2025