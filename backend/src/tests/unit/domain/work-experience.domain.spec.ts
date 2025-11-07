import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import { buildWorkExperienceDomainData } from '../fixtures/candidate.fixture';

const workExperienceCreateMock = jest.fn() as jest.Mock;
const workExperienceUpdateMock = jest.fn() as jest.Mock;

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    workExperience: {
      create: workExperienceCreateMock,
      update: workExperienceUpdateMock,
    },
  })),
  Prisma: {
    PrismaClientInitializationError: class extends Error {},
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { WorkExperience } = require('../../../domain/models/WorkExperience');

describe('WorkExperience domain model', () => {
  beforeEach(() => {
    workExperienceCreateMock.mockReset();
    workExperienceUpdateMock.mockReset();
  });

  it('hydrates fields from raw data', () => {
    // Arrange
    const raw = buildWorkExperienceDomainData();

    // Act
    const experience = new WorkExperience(raw);

    // Assert
    expect(experience.company).toBe(raw.company);
    expect(experience.position).toBe(raw.position);
    expect(experience.description).toBe(raw.description);
    expect(experience.startDate).toEqual(new Date(raw.startDate));
    expect(experience.endDate).toEqual(new Date(raw.endDate));
    expect(experience.candidateId).toBe(raw.candidateId);
  });

  it('creates a new work experience record when id is undefined', async () => {
    // Arrange
    const raw = buildWorkExperienceDomainData();
    const experience = new WorkExperience(raw);
    const { id: _unused, ...rawWithoutId } = raw;
    const createdRecord = { ...rawWithoutId, id: 7 };
    workExperienceCreateMock.mockResolvedValue(createdRecord as never);

    // Act
    const result = await experience.save();

    // Assert
    expect(workExperienceCreateMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        company: raw.company,
        position: raw.position,
        description: raw.description,
        candidateId: raw.candidateId,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }),
    });
    expect(result).toEqual(createdRecord);
  });

  it('updates an existing work experience record when id is present', async () => {
    // Arrange
    const raw = { ...buildWorkExperienceDomainData(), id: 21 };
    const experience = new WorkExperience(raw);
    workExperienceUpdateMock.mockResolvedValue(raw as never);

    // Act
    const result = await experience.save();

    // Assert
    expect(workExperienceUpdateMock).toHaveBeenCalledWith({
      where: { id: 21 },
      data: expect.objectContaining({
        company: raw.company,
        position: raw.position,
        description: raw.description,
        candidateId: raw.candidateId,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }),
    });
    expect(result).toEqual(raw);
  });
});

