import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

import { buildCandidateServicePayload, buildCandidatePersistenceResult } from '../fixtures/candidate.fixture';

jest.mock('../../../application/services/candidateService', () => ({
  addCandidate: jest.fn(),
}));

import { addCandidateController } from '../../../presentation/controllers/candidateController';
import { addCandidate } from '../../../application/services/candidateService';

type AddCandidateMock = jest.MockedFunction<typeof addCandidate>;

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.post('/candidates', addCandidateController);
  return app;
};

describe('Candidate Controller (integration)', () => {
  beforeEach(() => {
    (addCandidate as AddCandidateMock).mockReset();
  });

  it('responds with 201 when a candidate is added successfully', async () => {
    const payload = buildCandidateServicePayload();
    const savedCandidate = buildCandidatePersistenceResult();
    (addCandidate as AddCandidateMock).mockResolvedValueOnce(savedCandidate);

    const response = await request(buildApp()).post('/candidates').send(payload);

    expect(addCandidate).toHaveBeenCalledWith(payload);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Candidate added successfully',
      data: savedCandidate,
    });
  });

  it('responds with 400 when the service throws a validation error', async () => {
    const payload = buildCandidateServicePayload();
    (addCandidate as AddCandidateMock).mockRejectedValueOnce(new Error('Validation failed'));

    const response = await request(buildApp()).post('/candidates').send(payload);

    expect(addCandidate).toHaveBeenCalledWith(payload);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Error adding candidate',
      error: 'Validation failed',
    });
  });

  it('responds with 400 and a generic message when the service throws a non-Error', async () => {
    const payload = buildCandidateServicePayload();
    (addCandidate as AddCandidateMock).mockRejectedValueOnce({});

    const response = await request(buildApp()).post('/candidates').send(payload);

    expect(addCandidate).toHaveBeenCalledWith(payload);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Error adding candidate',
      error: 'Unknown error',
    });
  });
});
