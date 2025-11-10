import { test, expect } from '@playwright/test';

import { buildValidFile, buildInvalidFile } from '../../fixtures/payloads/file.payloads';
import { postMultipart } from '../../helpers/apiClient';

test.describe('[POST] /upload - file upload', () => {
  test('Given valid PDF When uploading Then returns 200 with metadata', async ({ request }) => {
    const file = buildValidFile();

    const response = await postMultipart(request, '/upload', {
      file,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      filePath: expect.any(String),
      fileType: file.mimeType,
    });
  });

  test('Given valid DOCX When uploading Then returns 200 with metadata', async ({ request }) => {
    const file = buildValidFile({
      name: 'resume.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const response = await postMultipart(request, '/upload', {
      file,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      filePath: expect.any(String),
      fileType: file.mimeType,
    });
  });

  test('Given invalid mimetype When uploading Then returns 400', async ({ request }) => {
    const file = buildInvalidFile();

    const response = await postMultipart(request, '/upload', {
      file,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({
      error: 'Invalid file type, only PDF and DOCX are allowed!',
    });
  });

  test('Given no file When uploading Then returns 400', async ({ request }) => {
    const response = await postMultipart(request, '/upload', {});

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({
      error: 'Invalid file type, only PDF and DOCX are allowed!',
    });
  });
});
