# Unit Test Implementation Guide

## Overview
This document provides instructions for implementing and running the unit tests for the candidate insertion logic based on the test plan `candidate-insertion-test-plan.md`.

## Test Files Created

### 1. Test Utilities and Infrastructure
- `tests/utils/testDataFactory.ts` - Factory functions for creating test data
- `tests/utils/databaseUtils.ts` - Database setup and cleanup utilities  
- `tests/utils/testSetup.ts` - Jest test environment setup
- `tests/mocks/prismaMocks.ts` - Mock implementations for Prisma client

### 2. Unit Test Implementations
- `tests/unit/candidateService.test.ts` - Tests for candidateService.addCandidate()
- `tests/unit/validator.test.ts` - Tests for validation logic
- `tests/unit/databaseErrorHandling.test.ts` - Database error handling tests
- `tests/unit/optionalFieldHandling.test.ts` - Optional field handling tests
- `tests/unit/candidateInsertionDemo.test.ts` - Standalone demo tests (runnable)

## Test Coverage

### Common Use Cases (HIGH PRIORITY)
- ✅ **CAND-001**: Valid complete candidate creation
- ✅ **CAND-002**: Minimal candidate creation
- ✅ **CAND-003**: Duplicate email rejection

### Edge Cases (MEDIUM/LOW PRIORITY)
- ✅ **CAND-EDGE-001**: Missing required fields validation
- ✅ **CAND-EDGE-002**: Field length boundary validation
- ✅ **CAND-EDGE-003**: Special characters in names validation
- ✅ **CAND-EDGE-004**: Invalid date format validation
- ✅ **CAND-EDGE-005**: Phone number format validation
- ✅ **CAND-EDGE-006**: CV data validation
- ✅ **CAND-EDGE-007**: Database connection failure handling
- ✅ **CAND-EDGE-008**: Empty arrays handling
- ✅ **CAND-EDGE-009**: Null/undefined field handling
- ✅ **CAND-EDGE-010**: Maximum entries handling

## Running Tests

### Prerequisites
1. Install dependencies:
```bash
npm install
```

2. Ensure PostgreSQL test database is running:
```bash
docker-compose up -d
```

### Running Individual Test Files

#### Demo Tests (Ready to Run)
```bash
# Run the standalone demo tests
npm test -- tests/unit/candidateInsertionDemo.test.ts
```

#### Full Test Suite (Requires Backend Integration)
```bash
# Run all candidate service tests
npm run test:unit

# Run specific test categories
npm test -- --testNamePattern="CAND-001"
npm test -- --testNamePattern="validation"
npm test -- --testNamePattern="database error"

# Run with coverage
npm run test:coverage
```

### Test Execution Results Expected
```
Test Suites: 5 passed, 5 total
Tests:       45+ passed, 45+ total
Snapshots:   0 total
Time:        5-10s
Coverage:    >90% statements, >85% branches
```

## Integration with Existing Codebase

### Step 1: Update Import Paths
The test files currently have placeholder import paths. Update them to match your actual backend structure:

```typescript
// Update these imports in each test file:
import { addCandidate } from '../../../backend/src/application/services/candidateService';
import { validateCandidateData } from '../../../backend/src/application/validator';
import { Candidate } from '../../../backend/src/domain/models/Candidate';
```

### Step 2: Install Additional Test Dependencies
```bash
npm install --save-dev @testing-library/jest-dom @types/jest
```

### Step 3: Update Jest Configuration
The `jest.config.js` has been updated with:
- TypeScript support
- Coverage thresholds (90% statements, 85% branches)
- Proper module resolution
- Test timeout settings

### Step 4: Database Test Setup
1. Create a test database:
```sql
CREATE DATABASE lti_test;
```

2. Update environment variables for testing:
```env
# .env.test
DATABASE_URL="postgresql://test:test@localhost:5433/lti_test"
NODE_ENV=test
```

3. Run database migrations for test environment:
```bash
cd backend && npx prisma migrate dev --schema=./prisma/schema.prisma
```

## Test Data Management

### Using Test Data Factory
```typescript
import { 
  createValidCompleteCandidate,
  createMinimalCandidate,
  generateUniqueEmail 
} from '../../utils/testDataFactory';

// Create test candidate with unique email
const candidate = createValidCompleteCandidate({
  email: generateUniqueEmail('test.user')
});
```

### Database Cleanup
```typescript
import { DatabaseTestUtils } from '../../utils/databaseUtils';

beforeEach(async () => {
  await DatabaseTestUtils.cleanup();
});
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Run Unit Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_USER: test
          POSTGRES_DB: lti_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run database migrations
        run: cd backend && npx prisma migrate dev
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
```

## Troubleshooting

### Common Issues

1. **Import Path Errors**
   - Update import paths to match your project structure
   - Ensure TypeScript compilation is working

2. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check DATABASE_URL environment variable
   - Ensure test database exists

3. **Mock Issues**
   - Clear mocks between tests: `jest.clearAllMocks()`
   - Reset mock implementations as needed

4. **Timeout Issues**
   - Increase Jest timeout in configuration
   - Optimize database operations
   - Use proper async/await patterns

### Performance Optimization

1. **Database Tests**
   - Use transactions for faster cleanup
   - Implement connection pooling
   - Run tests in parallel where possible

2. **Mock Optimization**
   - Use lightweight mocks
   - Avoid over-mocking
   - Reset mocks efficiently

## Quality Gates

### Pre-commit Checks
- All tests must pass
- Coverage thresholds must be met
- No TypeScript compilation errors
- Proper test naming conventions

### Code Review Checklist
- [ ] Test cases cover all scenarios from test plan
- [ ] Proper AAA (Arrange, Act, Assert) pattern
- [ ] Meaningful test descriptions
- [ ] Proper error handling tested
- [ ] Performance considerations addressed
- [ ] Database cleanup implemented
- [ ] Mock usage is appropriate

## Next Steps

1. **Integration Tests**: Create integration tests in `tests/integration/`
2. **E2E Tests**: Implement end-to-end tests in `tests/e2e/`
3. **Performance Tests**: Add load testing for high-volume scenarios
4. **Security Tests**: Add tests for input sanitization and validation
5. **API Tests**: Create REST API endpoint tests

---

**Last Updated**: November 9, 2025  
**Test Plan Reference**: `tests/plans/candidate-insertion-test-plan.md`  
**Coverage Target**: >90% statements, >85% branches  
**Estimated Implementation Time**: 2-3 days for full integration