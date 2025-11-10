import { uniqueEmail } from '../data.factory';

type CandidatePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: Array<{
    institution: string;
    title: string;
    startDate: string;
    endDate: string;
  }>;
  workExperiences?: Array<{
    company: string;
    position: string;
    description?: string;
    startDate: string;
    endDate?: string;
  }>;
  cv?: {
    filePath: string;
    fileType: string;
  };
};

export const buildValidCandidatePayload = (overrides: Partial<CandidatePayload> = {}): CandidatePayload => ({
  firstName: 'María',
  lastName: 'López',
  email: uniqueEmail(),
  phone: '611223344',
  address: 'Calle Falsa 123',
  educations: [
    {
      institution: 'Universidad de Buenos Aires',
      title: 'Ingeniería en Sistemas',
      startDate: '2015-03-01',
      endDate: '2020-12-15',
    },
  ],
  workExperiences: [
    {
      company: 'LTI',
      position: 'Backend Developer',
      description: 'Desarrollo de APIs',
      startDate: '2021-01-01',
      endDate: '2024-06-30',
    },
  ],
  cv: {
    filePath: 'uploads/cv.pdf',
    fileType: 'application/pdf',
  },
  ...overrides,
});

export const buildCandidateMissingFieldPayload = () => {
  const { email, ...rest } = buildValidCandidatePayload();
  return {
    ...rest,
    email,
    firstName: '',
  };
};

export const buildDuplicateCandidatePayload = (email: string) =>
  buildValidCandidatePayload({ email });

export const buildMinimalCandidatePayload = () =>
  buildValidCandidatePayload({
    phone: undefined,
    address: undefined,
    educations: undefined,
    workExperiences: undefined,
    cv: undefined,
  });

export const buildInvalidCandidateEmailPayload = () =>
  buildValidCandidatePayload({ email: 'invalid-email' });

export const buildInvalidCandidatePhonePayload = () =>
  buildValidCandidatePayload({ phone: '12345' });

export const buildInvalidEducationPayload = () =>
  buildValidCandidatePayload({
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
  buildValidCandidatePayload({
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
