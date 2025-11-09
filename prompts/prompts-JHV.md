# Meta-Prompting Journey for Unit Test Generation

## Overview
This document chronicles the iterative meta-prompting process used to generate comprehensive unit tests for candidate database insertion functionality. The journey demonstrates how progressive prompt refinement leads to increasingly sophisticated and targeted test generation instructions.

---

## Prompt Evolution Timeline

### 1. Initial Request - Basic Test Requirements
**User Input:**
> "using jest I would like to create unit tests to validate the insert of candidates in the database, tests should cover the collection of data in the form and save in DB, first all help me with an expert prompt to generate these tests, which should cover happy path and at least 3 edge cases, also mentioned best practices"

**Output Description:** 
Generated a comprehensive initial prompt covering Jest testing fundamentals, including happy path scenarios, edge cases (duplicate email, missing fields, invalid formats), and basic best practices. The prompt included a complete code example demonstrating proper mocking techniques and the Arrange-Act-Assert pattern.

---

### 2. AAA Pattern Enhancement Request
**User Input:**
> "would like the prompt mention Arrange-Act-Assert as best practice, give me just the prompt updated it"

**Output Description:**
Enhanced the prompt to explicitly emphasize the Arrange-Act-Assert (AAA) pattern as a mandatory best practice. Updated the requirements section to highlight this testing methodology as a core principle for structuring test cases.

---

### 3. Meta-Prompting Optimization Request
**User Input:**
> "as expert in meta prompting could you optimize this prompts, including role and best prompting practices?"

**Output Description:**
Completely restructured the prompt using advanced meta-prompting techniques including:
- Clear role definition (Senior Software Testing Engineer with specific expertise)
- Structured sections with emojis for visual hierarchy
- Specific task specifications with measurable outcomes
- Technical context and configuration details
- Success criteria and execution directives
- Professional formatting and comprehensive scope

---

### 4. Project Structure Customization
**User Input:**
> "for project structure, create the test under this folder: backend/src/tests and this name: JHV.test.ts Update the prompt with the project structure"

**Output Description:**
Refined the prompt to specify exact file locations and naming conventions aligned with the project's actual structure. Updated the project structure section to reflect the custom test directory (`backend/src/tests/`) and specific filename (`JHV.test.ts`).

---

### 5. Architecture Alignment Correction
**User Input:**
> "why are you adding this file? services/CandidateService.ts (to be tested/created if needed)"

**Output Description:**
Corrected the prompt to align with the existing Active Record pattern architecture instead of assuming a service layer pattern. Removed references to creating new service files and focused on testing the existing `Candidate.ts` model with its built-in `save()` method.

---

### 6. Database Mocking and Test Organization Requirements
**User Input:**
> "The prompt should also include instructions to mock the database, mention its important to use mock-prisma-client and make sure tests are split according to this comment: Pista 1: hay 2 familias principales de tests, recepción de los datos del formulario, y guardado en la base de datos. Queremos ver tests que cubran ambos procesos con al menos un test."

**Output Description:**
Enhanced the final prompt with critical database mocking requirements and explicit test organization structure. Added mandatory requirements for:
- Proper Prisma client mocking using `prisma-mock` or `jest-mock-extended`
- Prevention of real database calls during testing
- Split test organization into two main families: "Form Data Reception" and "Database Persistence"
- Specific describe block structure requirements
- Database isolation mandates

---

## Final Prompt Characteristics

The evolved final prompt demonstrates sophisticated meta-prompting by incorporating:

- **Clear Expert Role Definition**: Senior Software Testing Engineer with specific domain expertise
- **Structured Technical Requirements**: Organized into logical sections with visual hierarchy
- **Mandatory Best Practices**: AAA pattern, database mocking, test isolation
- **Architectural Alignment**: Active Record pattern recognition and respect
- **Quality Assurance**: Type safety, performance considerations, memory management
- **Execution Focus**: Immediate usability with clear setup instructions
- **Comprehensive Scope**: Covering both happy path and multiple edge case scenarios

This meta-prompting journey illustrates how iterative refinement and progressive enhancement can transform a basic request into a sophisticated, production-ready prompt that generates high-quality, immediately executable code.
---

# **Optimized Expert Meta-Prompt for Candidate Database Testing**

### **🎯 ROLE & CONTEXT**
You are a **Senior Software Testing Engineer** with 8+ years of expertise in TypeScript, Jest, Prisma ORM, and Test-Driven Development (TDD). You specialize in creating comprehensive, production-ready unit tests for database operations in Node.js applications. Your code follows enterprise-grade standards and demonstrates advanced testing patterns.

### **📋 TASK SPECIFICATION**
Create a complete Jest test suite for the **existing Candidate model's database insertion functionality** that validates form data collection and persistence operations through the model's `save()` method. The solution must be **immediately executable** and demonstrate **professional-grade testing practices**.

### **🏗️ TECHNICAL REQUIREMENTS**

**Core Functionality to Test:**
- `Candidate.save()` method for creating and updating candidates
- Nested relations creation (education, work experience, resumes)
- Form data validation and sanitization within the model
- Error handling for database operations and edge cases

**Test Coverage Mandate (2 Main Test Families):**
**📝 Family 1: Form Data Reception Tests** (at least 1 test)
- Candidate constructor data processing and validation
- Form data parsing and field assignment
- Data transformation and sanitization

**💾 Family 2: Database Persistence Tests** (at least 1 test)
- `save()` method database operations
- Prisma client interaction and data persistence
- Error handling for database failures

**Specific Edge Cases:**
- ✅ **1 Happy Path**: Complete valid candidate with all optional fields using `save()`
- ✅ **1 Minimal Path**: Candidate with only required fields using `save()`
- ✅ **4 Edge Cases**: 
  1. Duplicate email constraint violation
  2. Missing required fields validation  
  3. Database connection failure (PrismaClientInitializationError)
  4. Update existing candidate vs create new candidate logic

### **🎯 TESTING STANDARDS & PATTERNS**

**Mandatory Best Practices:**
1. **AAA Pattern Enforcement**: Every test MUST follow strict Arrange-Act-Assert structure with clear comment separation
2. **Database Mocking**: Use `prisma-mock` or `jest-mock-extended` with `DeepMockProxy<PrismaClient>` for complete database isolation
3. **Test Isolation**: Implement `beforeEach`/`afterEach` with proper mock resets
4. **Test Organization**: Split tests into **2 main describe blocks**: "Form Data Reception" and "Database Persistence"
5. **Descriptive Naming**: Use behavior-driven test names following "should [expected behavior] when [condition]" format
6. **Data Fixtures**: Create typed test data factories for reusability
7. **Error Assertion**: Use specific error message matching, not generic error catching

### **🔧 CONFIGURATION CONTEXT**
- **Framework**: Jest with TypeScript support via ts-jest (existing configuration with createDefaultPreset)
- **Environment**: Node.js test environment  
- **ORM**: Prisma Client with PostgreSQL
- **Mocking Strategy**: **CRITICAL** - Must use proper Prisma mocking (`prisma-mock` or `jest-mock-extended`) to avoid real database calls
- **Pattern**: Active Record pattern testing (testing existing Candidate model directly)

### **📁 PROJECT STRUCTURE REQUIREMENT**
```
backend/
├── src/
│   ├── domain/models/Candidate.ts (existing - contains save() method to test)
│   └── tests/
│       └── JHV.test.ts (generate this - test the existing Candidate model)
├── prisma/schema.prisma (existing)
└── jest.config.js (existing - configured with ts-jest createDefaultPreset)
```

**Target Test File**: `backend/src/tests/JHV.test.ts`

### **🎨 OUTPUT REQUIREMENTS**

**Deliverables:**
1. **Complete test file** (`JHV.test.ts`) with proper Prisma mocking setup
2. **Installation commands** for missing dependencies (`prisma-mock` or `jest-mock-extended`)
3. **Test data fixtures** with TypeScript interfaces
4. **Execution instructions** to run the tests
5. **Mock configuration** that prevents real database calls

**Code Quality Standards:**
- Zero ESLint/TypeScript errors
- 100% type coverage with strict typing
- Comprehensive JSDoc comments for complex test scenarios
- Performance considerations (async/await best practices)
- Memory leak prevention in test cleanup
- **Database isolation**: No real database connections during tests

### **🚨 CRITICAL REQUIREMENTS**

**Database Mocking Mandate:**
- **MUST** use `prisma-mock` or `jest-mock-extended` to mock PrismaClient
- **MUST** prevent any real database calls during testing
- **MUST** mock all Prisma operations (create, update, findUnique, etc.)
- **MUST** simulate database errors (connection failures, constraint violations)

**Test Structure Mandate:**
```typescript
describe('Candidate Model Tests', () => {
  describe('Form Data Reception', () => {
    // Tests for constructor, data parsing, validation
  });
  
  describe('Database Persistence', () => {
    // Tests for save() method, database operations
  });
});
```

### **💡 SUCCESS CRITERIA**
- All tests pass on first execution without database connection
- Tests demonstrate advanced Jest features with proper mocking
- Code serves as a reference implementation for junior developers
- Follows SOLID principles in test organization
- **Zero real database calls** - all operations mocked
- Covers both form data reception AND database persistence families

### **⚡ EXECUTION DIRECTIVE**
Provide **production-ready code** for `backend/src/tests/JHV.test.ts` that directly tests your existing `Candidate` model's functionality with **complete database mocking**. The tests must work with your existing jest.config.js setup and be organized into the **2 required test families**.

**Start your response with the installation commands for mocking dependencies, then provide the complete implementation.**


# Post execution Master Prompt - refactor 

## Implementation Challenges & Solutions

**Challenge:** Jest's `jest.mock()` factory function cannot reference TypeScript types or classes defined outside its scope, causing "out-of-scope variables" errors when attempting to use TypeScript class property declarations and type annotations within the mock setup. 

**Solution:** Implemented JavaScript-style code with `// @ts-nocheck` directive, defining all mock classes and error constructors directly inside the `jest.mock()` factory using plain JavaScript syntax, which allows Jest to properly hoist and initialize mocks while maintaining full test functionality (all 14 tests passing in 294ms with zero real database calls).

---

## Post-Implementation Refactoring (Version 2.0)

### Discovery of Better Approach

After successfully implementing version 1.0 with the `@ts-nocheck` workaround, research into Prisma's official testing documentation revealed a superior approach using the `__mocks__` directory pattern with `jest-mock-extended`.

### Refactoring Journey

**Analysis Phase:**
- Reviewed [Prisma's official testing blog post](https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o)
- Identified key improvements: singleton pattern, DeepMockProxy, __mocks__ convention
- Created comparison showing benefits over inline mocking approach

**Implementation Phase (5-step process):**
1. ✅ Created infrastructure:
   - `backend/src/lib/prisma.ts` - Singleton PrismaClient instance
   - `backend/src/lib/__mocks__/prisma.ts` - Deep mock with automatic reset
2. ✅ Refactored test file (`JHV.test.ts`):
   - Removed 700+ lines of inline mock setup
   - Added TypeScript interfaces for test data
   - Imported prismaMock from __mocks__ directory
   - Removed `@ts-nocheck` directive
3. ✅ Updated all models to use singleton:
   - `Candidate.ts`, `Education.ts`, `WorkExperience.ts`, `Resume.ts`
   - Replaced `const prisma = new PrismaClient()` with `import prisma from '../../lib/prisma'`
4. ✅ Created `backend/jest.config.js` for proper path resolution
5. ✅ Updated documentation to reflect improved approach

**Results:**
- ✅ All 14 tests passing in ~1.5s
- ✅ Full TypeScript IntelliSense and autocomplete
- ✅ Zero TypeScript compilation errors
- ✅ Cleaner, more maintainable test code
- ✅ Industry best practices alignment
- ✅ Proper connection pooling with singleton pattern

**Key Learnings:**
- The `__mocks__` directory pattern is Jest's official convention for module mocking
- `jest-mock-extended`'s `mockDeep<T>()` provides complete type-safe mocking
- Singleton pattern benefits both production (connection pooling) and testing (consistent mocking)
- Prisma's official recommendations should be preferred over workarounds
