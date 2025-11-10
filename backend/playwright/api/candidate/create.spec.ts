import { test, expect } from '@playwright/test';

import {
  buildValidCandidatePayload,
  buildCandidateMissingFieldPayload,
  buildDuplicateCandidatePayload,
  buildMinimalCandidatePayload,
  buildInvalidCandidateEmailPayload,
  buildInvalidCandidatePhonePayload,
  buildInvalidEducationPayload,
  buildInvalidWorkExperiencePayload,
  buildInvalidCvData,
} from '../../fixtures/payloads/candidate.payloads';
import { postJson } from '../../helpers/apiClient';

test.describe('[POST] /candidates - create', () => {
  test('Given valid candidate When creating Then returns 201 with persisted data', async ({ request }) => {
    // Arrange
    const payload = buildValidCandidatePayload();

    // Act
    const response = await postJson(request, '/candidates', payload);

    // Assert
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({
      id: expect.any(Number),
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      address: payload.address,
      phone: payload.phone,
    });
  });

  test('Given minimal mandatory data When creating Then returns 201', async ({ request }) => {
    const minimalPayload = buildMinimalCandidatePayload();

    const response = await postJson(request, '/candidates', minimalPayload);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({
      id: expect.any(Number),
      email: minimalPayload.email,
    });
  });

  test('Given invalid candidate When creating Then returns 400', async ({ request }) => {
    const payload = buildCandidateMissingFieldPayload();

    const response = await postJson(request, '/candidates', payload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({
      message: expect.any(String),
    });
  });

  test('Given invalid email When creating Then returns 400', async ({ request }) => {
    const payload = buildInvalidCandidateEmailPayload();

    const response = await postJson(request, '/candidates', payload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({ message: 'Error: Invalid email' });
  });

  test('Given invalid phone When creating Then returns 400', async ({ request }) => {
    const payload = buildInvalidCandidatePhonePayload();

    const response = await postJson(request, '/candidates', payload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({ message: 'Error: Invalid phone' });
  });

  test('Given invalid education When creating Then returns 400', async ({ request }) => {
    const payload = buildInvalidEducationPayload();

    const response = await postJson(request, '/candidates', payload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({ message: 'Error: Invalid date' });
  });

  test('Given invalid work experience When creating Then returns 400', async ({ request }) => {
    const payload = buildInvalidWorkExperiencePayload();

    const response = await postJson(request, '/candidates', payload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({ message: 'Error: Invalid end date' });
  });

  test('Given invalid CV When creating Then returns 400', async ({ request }) => {
    const payload = buildValidCandidatePayload({ cv: buildInvalidCvData() as any });

    const response = await postJson(request, '/candidates', payload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({ message: 'Error: Invalid CV data' });
  });

  test('Given existing candidate When creating again Then returns 400 duplicate email', async ({ request }) => {
    const firstPayload = buildValidCandidatePayload();
    const duplicatePayload = buildDuplicateCandidatePayload(firstPayload.email);

    const firstResponse = await postJson(request, '/candidates', firstPayload);
    expect(firstResponse.status()).toBe(201);

    const duplicateResponse = await postJson(request, '/candidates', duplicatePayload);

    expect(duplicateResponse.status()).toBe(400);
    const body = await duplicateResponse.json();
    expect(body).toEqual({ message: 'The email already exists in the database' });
  });
});
