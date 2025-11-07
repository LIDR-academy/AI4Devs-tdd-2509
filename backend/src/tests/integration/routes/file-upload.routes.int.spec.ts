import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

import { singleMock, diskStorageMock, FakeMulterError, resetStorageMocks } from '../../unit/mocks/storage.mock';

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

const { uploadFile } = require('../../../application/services/fileUploadService');

const buildApp = () => {
  const app = express();
  app.post('/upload', uploadFile);
  return app;
};

describe('File Upload Routes (integration)', () => {
  beforeEach(() => {
    resetStorageMocks();
  });

  it('returns 200 with file metadata when upload succeeds', async () => {
    singleMock.mockImplementation(
      () =>
        (req: any, _res: any, cb: (err?: unknown) => void) => {
          req.file = {
            path: '/uploads/123-file.pdf',
            mimetype: 'application/pdf',
          };
          cb(null);
        },
    );

    const response = await request(buildApp())
      .post('/upload')
      .attach('file', Buffer.from('dummy'), 'resume.pdf');

    expect(singleMock).toHaveBeenCalledWith('file');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      filePath: '/uploads/123-file.pdf',
      fileType: 'application/pdf',
    });
  });

  it('returns 400 when file filter rejects the upload', async () => {
    singleMock.mockImplementation(
      () =>
        (req: any, _res: any, cb: (err?: unknown) => void) => {
          req.file = undefined;
          cb(null);
        },
    );

    const response = await request(buildApp()).post('/upload').attach('file', Buffer.from('dummy'), 'resume.pdf');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid file type, only PDF and DOCX are allowed!',
    });
  });

  it('returns 500 when multer throws a MulterError', async () => {
    singleMock.mockImplementation(
      () =>
        (_req: unknown, _res: unknown, cb: (err?: unknown) => void) => {
          cb(new MulterError('LIMIT_FILE_SIZE'));
        },
    );

    const response = await request(buildApp()).post('/upload').attach('file', Buffer.from('dummy'), 'resume.pdf');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'LIMIT_FILE_SIZE',
    });
  });

  it('returns 500 when an unexpected error occurs', async () => {
    singleMock.mockImplementation(
      () =>
        (_req: unknown, _res: unknown, cb: (err?: unknown) => void) => {
          cb(new Error('disk full'));
        },
    );

    const response = await request(buildApp()).post('/upload').attach('file', Buffer.from('dummy'), 'resume.pdf');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'disk full',
    });
  });
});
