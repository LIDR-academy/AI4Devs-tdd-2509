import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import * as validator from '../application/validator';

describe('candidateService - addCandidate (Acceptance 12 & 26)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should throw a friendly error when Prisma returns P2002 (duplicate email) (Acceptance 12)', async () => {
    const payload = { firstName: 'Ana', lastName: 'Lopez', email: 'ana@example.com' };

    jest.spyOn(Candidate.prototype, 'save').mockImplementationOnce(async function () {
      const e: any = new Error('Unique constraint');
      e.code = 'P2002';
      throw e;
    });

    await expect(addCandidate(payload)).rejects.toThrow('The email already exists in the database');
  });

  test.each([
    ['with nested data', true],
    ['without nested data', false]
  ])('service should create nested records when provided - %s (Acceptance 26)', async (_name, withNested) => {
    const basePayload: any = { firstName: 'Luis', lastName: 'Garcia', email: 'luis@example.com' };

    const payload = withNested ? {
      ...basePayload,
      educations: [{ institution: 'Uni', title: 'Eng', startDate: '2020-01-01', endDate: '2021-01-01' }],
      workExperiences: [{ company: 'Acme', position: 'Dev', startDate: '2019-01-01', endDate: '' }],
      cv: { filePath: '/uploads/cv.pdf', fileType: 'application/pdf' }
    } : basePayload;

    // Stub validator to avoid throwing
    jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => { return; });

    const savedCandidate = { id: 123, firstName: payload.firstName, lastName: payload.lastName, email: payload.email };

    jest.spyOn(Candidate.prototype, 'save').mockResolvedValueOnce(savedCandidate as any);

    const eduSaveSpy = jest.spyOn(Education.prototype, 'save').mockImplementation(async function (this: any) {
      return { id: 201, institution: this.institution } as any;
    });

    const workSaveSpy = jest.spyOn(WorkExperience.prototype, 'save').mockImplementation(async function (this: any) {
      return { id: 301, company: this.company } as any;
    });

    const resumeSaveSpy = jest.spyOn(Resume.prototype, 'save').mockImplementation(async function (this: any) {
      return { id: 401, filePath: this.filePath } as any;
    });

    const result = await addCandidate(payload);

    expect(result).toEqual(savedCandidate);

    if (withNested) {
      expect(eduSaveSpy).toHaveBeenCalledTimes(1);
      expect(workSaveSpy).toHaveBeenCalledTimes(1);
      expect(resumeSaveSpy).toHaveBeenCalledTimes(1);
    } else {
      expect(eduSaveSpy).not.toHaveBeenCalled();
      expect(workSaveSpy).not.toHaveBeenCalled();
      expect(resumeSaveSpy).not.toHaveBeenCalled();
    }
  });
});
