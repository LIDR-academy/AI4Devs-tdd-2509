import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

import { buildCandidateServicePayload, buildCandidatePersistenceResult } from '../fixtures/candidate.fixture';

jest.mock('../../../presentation/controllers/candidateController', () => ({
  addCandidate: jest.fn(),
}));

import candidateRoutes from '../../../routes/candidateRoutes';
import { addCandidate } from '../../../presentation/controllers/candidateController';

type AddCandidateMock = jest.MockedFunction<typeof addCandidate>;

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/candidates', candidateRoutes);
  return app;
};

describe('Candidate Routes (integration)', () => {
  beforeEach(() => {
    (addCandidate as AddCandidateMock).mockReset();
  });

  it('returns 201 and the created candidate when the service succeeds', async () => {
    const payload = buildCandidateServicePayload();
    const savedCandidate = buildCandidatePersistenceResult();
    (addCandidate as AddCandidateMock).mockResolvedValueOnce(savedCandidate);

    const response = await request(buildApp()).post('/candidates').send(payload);

    expect(addCandidate).toHaveBeenCalledWith(payload);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(savedCandidate);
  });

  it('returns 400 with the service error message when it throws an Error', async () => {
    const payload = buildCandidateServicePayload();
    (addCandidate as AddCandidateMock).mockRejectedValueOnce(new Error('duplicate email'));

    const response = await request(buildApp()).post('/candidates').send(payload);

    expect(addCandidate).toHaveBeenCalledWith(payload);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'duplicate email' });
  });

  it('returns 500 when a non-Error is thrown', async () => {
    const payload = buildCandidateServicePayload();
    (addCandidate as AddCandidateMock).mockRejectedValueOnce('unknown failure');

    const response = await request(buildApp()).post('/candidates').send(payload);

    expect(addCandidate).toHaveBeenCalledWith(payload);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'An unexpected error occurred' });
  });
});
