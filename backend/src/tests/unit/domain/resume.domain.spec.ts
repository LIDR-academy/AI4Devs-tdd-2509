import { describe, it, beforeEach, afterEach, expect, jest } from '@jest/globals';
import { buildResumeDomainData } from '../fixtures/candidate.fixture';

const resumeCreateMock = jest.fn() as jest.Mock;

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    resume: {
      create: resumeCreateMock,
    },
  })),
  Prisma: {
    PrismaClientInitializationError: class extends Error {},
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Resume } = require('../../../domain/models/Resume');

describe('Resume domain model', () => {
  let consoleSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    resumeCreateMock.mockReset();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('hydrates fields from raw data', () => {
    // Arrange
    const raw = buildResumeDomainData();

    // Act
    const resume = new Resume(raw);

    // Assert
    expect(resume.candidateId).toBe(raw.candidateId);
    expect(resume.filePath).toBe(raw.filePath);
    expect(resume.fileType).toBe(raw.fileType);
    expect(resume.uploadDate).toBeInstanceOf(Date);
  });

  it('creates a new resume record when saving without id', async () => {
    // Arrange
    const raw = buildResumeDomainData();
    const resume = new Resume(raw);
    const createdRecord = {
      id: 3,
      candidateId: raw.candidateId,
      filePath: raw.filePath,
      fileType: raw.fileType,
      uploadDate: new Date(),
    };
    resumeCreateMock.mockResolvedValue(createdRecord as never);

    // Act
    const result = await resume.save();

    // Assert
    expect(resumeCreateMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        candidateId: raw.candidateId,
        filePath: raw.filePath,
        fileType: raw.fileType,
        uploadDate: expect.any(Date),
      }),
    });
    expect(result).toBeInstanceOf(Resume);
    expect(result.id).toBe(3);
  });

  it('throws when attempting to save an existing resume', async () => {
    // Arrange
    const resume = new Resume({ ...buildResumeDomainData(), id: 9 });

    // Act
    const attempt = resume.save();

    // Assert
    await expect(attempt).rejects.toThrow('No se permite la actualización de un currículum existente.');
    expect(resumeCreateMock).not.toHaveBeenCalled();
  });
});

