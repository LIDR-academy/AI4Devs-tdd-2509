import { describe, it, beforeEach, expect, jest } from '@jest/globals';

import { singleMock, diskStorageMock, FakeMulterError, resetStorageMocks } from '../mocks/storage.mock';

jest.mock('multer', () => {
  const factory = jest.fn(() => ({
    single: singleMock,
  }));

  return Object.assign(factory, {
    diskStorage: diskStorageMock,
    MulterError: FakeMulterError,
  });
});

const multerMock = require('multer');
const { MulterError } = multerMock;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { uploadFile } = require('../../../application/services/fileUploadService');

const buildResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('fileUploadService.uploadFile (unit)', () => {
  beforeEach(() => {
    resetStorageMocks();
  });

  it('returns 200 with file metadata when upload succeeds', () => {
    // Arrange
    singleMock.mockImplementation(
      () =>
        (req: any, res: any, cb: (err?: unknown) => void) => {
          req.file = {
            path: '/uploads/123-file.pdf',
            mimetype: 'application/pdf',
          };
          cb(null);
        },
    );

    const req: any = {};
    const res = buildResponse();

    // Act
    uploadFile(req, res);

    // Assert
    expect(singleMock).toHaveBeenCalledWith('file');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      filePath: '/uploads/123-file.pdf',
      fileType: 'application/pdf',
    });
  });

  it('returns 400 when file filter rejects the upload', () => {
    singleMock.mockImplementation(
      () =>
        (req: any, res: any, cb: (err?: unknown) => void) => {
          req.file = undefined;
          cb(null);
        },
    );

    const req: any = {};
    const res = buildResponse();

    uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid file type, only PDF and DOCX are allowed!',
    });
  });

  it('returns 500 when multer throws a MulterError', () => {
    singleMock.mockImplementation(
      () =>
        (_req: unknown, _res: unknown, cb: (err?: unknown) => void) => {
          cb(new MulterError('LIMIT_FILE_SIZE'));
        },
    );

    const req: any = {};
    const res = buildResponse();

    uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'LIMIT_FILE_SIZE',
    });
  });

  it('returns 500 when an unexpected error occurs', () => {
    singleMock.mockImplementation(
      () =>
        (_req: unknown, _res: unknown, cb: (err?: unknown) => void) => {
          cb(new Error('disk full'));
        },
    );

    const req: any = {};
    const res = buildResponse();

    uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'disk full',
    });
  });
});

