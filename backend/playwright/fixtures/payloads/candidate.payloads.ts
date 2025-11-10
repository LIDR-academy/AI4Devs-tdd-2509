import { uniqueEmail } from '../data.factory';
import { buildCandidateServicePayload } from '../../../src/tests/unit/fixtures/candidate.fixture';

type CandidatePayload = ReturnType<typeof buildCandidateServicePayload>;

type Overrides = Partial<CandidatePayload>;

const buildBaseCandidate = (overrides: Overrides = {}): CandidatePayload => {
  const email = overrides.email ?? uniqueEmail();
  return buildCandidateServicePayload({
    email,
    ...overrides,
  });
};

export const buildValidCandidatePayload = (overrides: Overrides = {}) => buildBaseCandidate(overrides);

export const buildMinimalCandidatePayload = () =>
  buildBaseCandidate({
    phone: undefined,
    address: undefined,
    educations: undefined,
    workExperiences: undefined,
    cv: undefined,
  });

export const buildCandidateMissingFieldPayload = () => {
  const payload = buildBaseCandidate();
  return {
    ...payload,
    firstName: '',
  };
};

export const buildDuplicateCandidatePayload = (email: string) => buildBaseCandidate({ email });

export const buildInvalidCandidateEmailPayload = () => buildBaseCandidate({ email: 'invalid-email' });

export const buildInvalidCandidatePhonePayload = () => buildBaseCandidate({ phone: '12345' });

export const buildInvalidEducationPayload = () =>
  buildBaseCandidate({
    educations: [
      {
        institution: 'Universidad de Buenos Aires',
        title: 'Ingeniería en Sistemas',
        startDate: '2015/03/01',
        endDate: '2020-12-15',
      },
    ],
  });

export const buildInvalidWorkExperiencePayload = () =>
  buildBaseCandidate({
    workExperiences: [
      {
        company: 'LTI',
        position: 'Backend Developer',
        description: 'Desarrollo',
        startDate: '2021-01-01',
        endDate: 'invalid-date',
      },
    ],
  });

export const buildInvalidCvData = () => ({ filePath: 'uploads/cv.pdf' });
