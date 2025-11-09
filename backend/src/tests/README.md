# Tests Directory

This directory contains all testing documentation and resources for the LTI - Talent Tracking System project.

## Directory Structure

```
tests/
├── README.md                           # This file - testing documentation
├── plans/                              # Test plan documents
│   └── candidate-insertion-test-plan.md   # Candidate insertion test plan
├── unit/                               # Unit test implementations (future)
├── integration/                        # Integration test implementations (future)
├── e2e/                               # End-to-end test implementations (future)
├── fixtures/                          # Test data fixtures (future)
├── mocks/                             # Mock objects and data (future)
└── utils/                             # Testing utilities and helpers (future)
```

## Naming Conventions

### Test Plan Files
- **Format:** `{module}-{functionality}-test-plan.md`
- **Examples:**
  - `candidate-insertion-test-plan.md`
  - `file-upload-test-plan.md`
  - `authentication-test-plan.md`

### Test Implementation Files
- **Unit Tests:** `{module}.test.ts` or `{functionality}.test.ts`
- **Integration Tests:** `{module}.integration.test.ts`
- **E2E Tests:** `{feature}.e2e.test.ts`

### Test Case IDs
- **Common Cases:** `{MODULE}-{NUMBER}` (e.g., `CAND-001`)
- **Edge Cases:** `{MODULE}-EDGE-{NUMBER}` (e.g., `CAND-EDGE-001`)
- **Integration:** `{MODULE}-INT-{NUMBER}` (e.g., `CAND-INT-001`)
- **E2E:** `{FEATURE}-E2E-{NUMBER}` (e.g., `SIGNUP-E2E-001`)

## Test Categories

### 1. Unit Tests
- **Location:** `tests/unit/`
- **Purpose:** Test individual functions, methods, and classes in isolation
- **Framework:** Jest
- **Coverage Target:** > 90%

### 2. Integration Tests
- **Location:** `tests/integration/`
- **Purpose:** Test interaction between different modules and components
- **Framework:** Jest with test database
- **Coverage Target:** > 80%

### 3. End-to-End Tests
- **Location:** `tests/e2e/`
- **Purpose:** Test complete user workflows and system behavior
- **Framework:** Playwright or Cypress (TBD)
- **Coverage Target:** Critical user paths

## Best Practices

### Test Plan Documentation
1. **Completeness:** Include all test scenarios from happy path to edge cases
2. **Traceability:** Link test cases to requirements and user stories  
3. **Maintainability:** Keep test plans updated with code changes
4. **Clarity:** Write clear, actionable test steps and expected results

### Test Implementation
1. **AAA Pattern:** Arrange, Act, Assert structure for all tests
2. **Isolation:** Each test should be independent and isolated
3. **Descriptive Names:** Test names should clearly describe what is being tested
4. **Data Management:** Use factories and fixtures for consistent test data

### Code Coverage
1. **Statements:** > 90% for unit tests
2. **Branches:** > 85% for critical paths
3. **Functions:** 100% for public APIs
4. **Lines:** > 90% overall coverage

## Test Environment Setup

### Prerequisites
```bash
# Install dependencies
npm install

# Setup test database
docker-compose -f docker-compose.test.yml up -d

# Run database migrations for tests
cd backend && npx prisma migrate dev --schema=./prisma/schema.test.prisma
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm test -- candidate

# Run tests in watch mode
npm test -- --watch
```

## Test Data Strategy

### Test Database
- Use separate PostgreSQL instance for testing
- Reset database state between test suites
- Use transactions for test isolation where possible

### Fixtures and Factories
- **Fixtures:** Static test data for consistent scenarios
- **Factories:** Dynamic test data generators for varied scenarios
- **Mocks:** External service responses and error conditions

### Data Cleanup
- Implement proper cleanup in `afterEach` hooks
- Use database transactions for automatic rollback
- Clear file uploads and temporary resources

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Start test database
        run: docker-compose -f docker-compose.test.yml up -d
      - name: Run tests
        run: npm test -- --coverage --ci
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Quality Gates

### Test Execution
- All tests must pass before merge
- No decrease in code coverage percentage
- Performance regression tests for critical paths

### Test Maintenance
- Monthly review of test plan accuracy
- Quarterly test case relevance assessment
- Annual testing strategy evaluation

## Tools and Frameworks

### Testing Frameworks
- **Jest:** Unit and integration testing
- **Supertest:** HTTP endpoint testing
- **Playwright/Cypress:** E2E testing (TBD)

### Utilities
- **@testing-library:** React component testing utilities
- **jest-mock-extended:** Enhanced mocking capabilities  
- **faker.js:** Test data generation
- **prisma-test-environment:** Database test isolation

### Reporting
- **Jest HTML Reporter:** Coverage and test reports
- **Allure:** Advanced test reporting (optional)
- **SonarQube:** Code quality and coverage analysis (optional)

## Contributing

### Adding New Test Plans
1. Create test plan in `tests/plans/` following naming convention
2. Follow the template structure from existing plans
3. Include priority/impact analysis
4. Add test cases for both common and edge scenarios
5. Update this README if new categories are introduced

### Implementing Tests
1. Create test files in appropriate subdirectory
2. Follow AAA pattern and naming conventions
3. Ensure proper test isolation and cleanup
4. Maintain minimum coverage thresholds
5. Add documentation for complex test scenarios

---

**Last Updated:** November 9, 2025  
**Maintained by:** QA Team  
**Review Schedule:** Monthly