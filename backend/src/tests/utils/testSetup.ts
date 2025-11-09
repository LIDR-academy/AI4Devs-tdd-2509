/**
 * Test Setup Configuration
 * This file runs before each test file is executed
 */

// Extend Jest matchers
import '@testing-library/jest-dom';

// Mock console methods in tests to reduce noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Mock console.error and console.warn for cleaner test output
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('deprecated') || args[0].includes('Warning:'))
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  // Restore console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test timeout
jest.setTimeout(10000);

// Mock environment variables for tests
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5433/lti_test';

// Mock Date for consistent testing
const mockDate = new Date('2025-11-09T10:00:00.000Z');
global.Date = jest.fn(() => mockDate) as any;
global.Date.UTC = Date.UTC;
global.Date.parse = Date.parse;
global.Date.now = jest.fn(() => mockDate.getTime());

export {};