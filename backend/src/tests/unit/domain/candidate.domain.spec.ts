import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import {
  buildCandidateDomainData,
  buildCandidatePersistenceResult,
} from '../fixtures/candidate.fixture';

const candidateCreateMock: jest.MockedFunction<(data: unknown) => Promise<unknown>> = jest.fn();
const candidateUpdateMock: jest.MockedFunction<(args: unknown) => Promise<unknown>> = jest.fn();

class PrismaClientInitializationError extends Error {}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    candidate: {
      create: candidateCreateMock,
      update: candidateUpdateMock,
    },
  })),
  Prisma: {
    PrismaClientInitializationError,
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Candidate } = require('../../../domain/models/Candidate');

describe('Candidate domain model', () => {
  beforeEach(() => {
    candidateCreateMock.mockReset();
    candidateUpdateMock.mockReset();
  });

  it('should hydrate instance fields from raw data', () => {
    // Arrange
    const rawData = buildCandidateDomainData();

    // Act
    const candidate = new Candidate(rawData);

    // Assert
    expect(candidate.firstName).toBe(rawData.firstName);
    expect(candidate.lastName).toBe(rawData.lastName);
    expect(candidate.email).toBe(rawData.email);
    expect(candidate.phone).toBe(rawData.phone);
    expect(candidate.address).toBe(rawData.address);
    expect(candidate.education).toHaveLength(1);
    expect(candidate.workExperience).toHaveLength(1);
    expect(candidate.resumes).toHaveLength(1);
  });

  it('should persist a new candidate using prisma.create', async () => {
    // Arrange
    const rawData = buildCandidateDomainData();
    const candidate = new Candidate(rawData);
    candidateCreateMock.mockResolvedValue(buildCandidatePersistenceResult());

    // Act
    const result = await candidate.save();

    // Assert
    expect(candidateCreateMock).toHaveBeenCalledTimes(1);
    expect(candidateCreateMock).toHaveBeenCalledWith({
      data: {
        firstName: rawData.firstName,
        lastName: rawData.lastName,
        email: rawData.email,
        phone: rawData.phone,
        address: rawData.address,
        educations: {
          create: rawData.education.map((edu) => ({
            institution: edu.institution,
            title: edu.title,
            startDate: edu.startDate,
            endDate: edu.endDate,
          })),
        },
        workExperiences: {
          create: rawData.workExperience.map((exp) => ({
            company: exp.company,
            position: exp.position,
            description: exp.description,
            startDate: exp.startDate,
            endDate: exp.endDate,
          })),
        },
        resumes: {
          create: rawData.resumes.map((resume) => ({
            filePath: resume.filePath,
            fileType: resume.fileType,
          })),
        },
      },
    });
    expect(result).toEqual(buildCandidatePersistenceResult());
  });

  it('should update an existing candidate when id is present', async () => {
    // Arrange
    const rawData = {
      ...buildCandidateDomainData(),
      id: 10,
      education: [],
      workExperience: [],
      resumes: [],
    };
    const candidate = new Candidate(rawData);
    candidateUpdateMock.mockResolvedValue({ ...buildCandidatePersistenceResult(), id: 10 });

    // Act
    const result = await candidate.save();

    // Assert
    expect(candidateUpdateMock).toHaveBeenCalledTimes(1);
    expect(candidateUpdateMock).toHaveBeenCalledWith({
      where: { id: 10 },
      data: {
        firstName: rawData.firstName,
        lastName: rawData.lastName,
        email: rawData.email,
        phone: rawData.phone,
        address: rawData.address,
      },
    });
    expect(result).toEqual({ ...buildCandidatePersistenceResult(), id: 10 });
  });
});

