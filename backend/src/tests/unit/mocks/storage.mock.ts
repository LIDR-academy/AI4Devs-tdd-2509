import { jest } from '@jest/globals';

export const singleMock = jest.fn();
export const diskStorageMock = jest.fn();

export class FakeMulterError extends Error {}

export const resetStorageMocks = () => {
  singleMock.mockReset();
  diskStorageMock.mockReset();
};

