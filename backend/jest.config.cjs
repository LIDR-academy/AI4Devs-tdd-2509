/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  clearMocks: true,
  reporters: [
    'default',
    '<rootDir>/src/tests/utils/summaryReporter.js',
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { diagnostics: false }],
  },
};

