import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import { buildCandidateServicePayload } from '../fixtures/candidate.fixture';
import {
  CandidateMock,
  EducationMock,
  WorkExperienceMock,
  ResumeMock,
  candidateSaveMock,
  educationSaveMock,
  workExperienceSaveMock,
  resumeSaveMock,
  resetAllRepoMocks,
} from '../mocks/repo.mock';

type AsyncMethodMock<TResult = unknown> = jest.MockedFunction<() => Promise<TResult>>;

const validateCandidateDataMock = jest.fn();

jest.mock('../../../application/validator', () => ({
  validateCandidateData: (...args: unknown[]) => validateCandidateDataMock(...args),
}));

jest.mock('../../../domain/models/Candidate', () => ({
  Candidate: CandidateMock,
}));

jest.mock('../../../domain/models/Education', () => ({
  Education: EducationMock,
}));

jest.mock('../../../domain/models/WorkExperience', () => ({
  WorkExperience: WorkExperienceMock,
}));

jest.mock('../../../domain/models/Resume', () => ({
  Resume: ResumeMock,
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { addCandidate } = require('../../../application/services/candidateService');

describe('candidateService.addCandidate (unit)', () => {
  beforeEach(() => {
    validateCandidateDataMock.mockReset();
    candidateSaveMock.mockReset();
    educationSaveMock.mockReset();
    workExperienceSaveMock.mockReset();
    resumeSaveMock.mockReset();
    resetAllRepoMocks();
  });

  it('validates input and persists candidate with relations', async () => {
    // Arrange
    const payload = buildCandidateServicePayload();
    candidateSaveMock.mockResolvedValue({ id: 1 });
    educationSaveMock.mockResolvedValue(undefined);
    workExperienceSaveMock.mockResolvedValue(undefined);
    resumeSaveMock.mockResolvedValue(undefined);

    // Act
    const result = await addCandidate(payload);

    // Assert
    expect(validateCandidateDataMock).toHaveBeenCalledWith(payload);
    expect(candidateSaveMock).toHaveBeenCalledTimes(1);
    expect(educationSaveMock).toHaveBeenCalledTimes(payload.educations.length);
    expect(workExperienceSaveMock).toHaveBeenCalledTimes(payload.workExperiences.length);
    expect(resumeSaveMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 1 });

    const candidateInstance = CandidateMock.instances[0];
    expect(candidateInstance.education).toHaveLength(payload.educations.length);
    expect(candidateInstance.workExperience).toHaveLength(payload.workExperiences.length);
    expect(candidateInstance.resumes).toHaveLength(1);

    const educationInstance = EducationMock.instances[0];
    const workExperienceInstance = WorkExperienceMock.instances[0];
    const resumeInstance = ResumeMock.instances[0];

    expect(educationInstance.candidateId).toBe(1);
    expect(workExperienceInstance.candidateId).toBe(1);
    expect(resumeInstance.candidateId).toBe(1);
  });

  it('translates unique email violations to friendly error', async () => {
    // Arrange
    const payload = buildCandidateServicePayload();
    candidateSaveMock.mockRejectedValue({ code: 'P2002' });

    // Act
    const attempt = addCandidate(payload);

    // Assert
    await expect(attempt).rejects.toThrow('The email already exists in the database');
  });

  it('propagates validation errors and skips persistence', async () => {
    // Arrange
    const payload = buildCandidateServicePayload();
    validateCandidateDataMock.mockImplementation(() => {
      throw new Error('Invalid data');
    });

    // Act
    const attempt = addCandidate(payload);

    // Assert
    await expect(attempt).rejects.toThrow(/Invalid data/);
    expect(candidateSaveMock).not.toHaveBeenCalled();
  });

  it('skips optional relations when payload omits them', async () => {
    // Arrange
    const payload = buildCandidateServicePayload({
      educations: undefined,
      workExperiences: undefined,
      cv: undefined as any,
    });
    candidateSaveMock.mockResolvedValue({ id: 5 });

    // Act
    const result = await addCandidate(payload);

    // Assert
    expect(result).toEqual({ id: 5 });
    expect(EducationMock.instances).toHaveLength(0);
    expect(WorkExperienceMock.instances).toHaveLength(0);
    expect(ResumeMock.instances).toHaveLength(0);
    expect(educationSaveMock).not.toHaveBeenCalled();
    expect(workExperienceSaveMock).not.toHaveBeenCalled();
    expect(resumeSaveMock).not.toHaveBeenCalled();
  });

  it('does not persist resume when cv payload is empty', async () => {
    // Arrange
    const payload = buildCandidateServicePayload({
      cv: {} as any,
    });
    candidateSaveMock.mockResolvedValue({ id: 9 });

    // Act
    const result = await addCandidate(payload);

    // Assert
    expect(result).toEqual({ id: 9 });
    expect(resumeSaveMock).not.toHaveBeenCalled();
    expect(ResumeMock.instances).toHaveLength(0);
  });
});

