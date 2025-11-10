import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import { buildEducationDomainData } from '../fixtures/candidate.fixture';

const educationCreateMock = jest.fn() as jest.Mock;
const educationUpdateMock = jest.fn() as jest.Mock;

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    education: {
      create: educationCreateMock,
      update: educationUpdateMock,
    },
  })),
  Prisma: {
    PrismaClientInitializationError: class extends Error {},
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Education } = require('../../../domain/models/Education');

describe('Education domain model', () => {
  beforeEach(() => {
    educationCreateMock.mockReset();
    educationUpdateMock.mockReset();
  });

  it('hydrates fields from raw data', () => {
    // Arrange
    const raw = buildEducationDomainData();

    // Act
    const education = new Education(raw);

    // Assert
    expect(education.institution).toBe(raw.institution);
    expect(education.title).toBe(raw.title);
    expect(education.startDate).toEqual(new Date(raw.startDate));
    expect(education.endDate).toEqual(new Date(raw.endDate));
    expect(education.candidateId).toBe(raw.candidateId);
  });

  it('creates a new education record when id is undefined', async () => {
    // Arrange
    const raw = buildEducationDomainData();
    const education = new Education(raw);
    const { id: _unused, ...rawWithoutId } = raw;
    const createdRecord = { ...rawWithoutId, id: 5 };
    educationCreateMock.mockResolvedValue(createdRecord as never);

    // Act
    const result = await education.save();

    // Assert
    expect(educationCreateMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        institution: raw.institution,
        title: raw.title,
        candidateId: raw.candidateId,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }),
    });
    expect(result).toEqual(createdRecord);
  });

  it('updates an existing education record when id is present', async () => {
    // Arrange
    const raw = { ...buildEducationDomainData(), id: 12 };
    const education = new Education(raw);
    educationUpdateMock.mockResolvedValue(raw as never);

    // Act
    const result = await education.save();

    // Assert
    expect(educationUpdateMock).toHaveBeenCalledWith({
      where: { id: 12 },
      data: expect.objectContaining({
        institution: raw.institution,
        title: raw.title,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        candidateId: raw.candidateId,
      }),
    });
    expect(result).toEqual(raw);
  });
});

