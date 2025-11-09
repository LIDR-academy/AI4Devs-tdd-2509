import '@testing-library/jest-dom';

// Mock global fetch
global.fetch = jest.fn();

// Reset fetch mock before each test
beforeEach(() => {
  fetch.mockClear();
});
