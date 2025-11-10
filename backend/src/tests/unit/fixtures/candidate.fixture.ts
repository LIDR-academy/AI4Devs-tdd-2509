const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

type CandidateFixture = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  educations: Array<{
    institution: string;
    title: string;
    startDate: string;
    endDate: string;
  }>;
  workExperiences: Array<{
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string;
  }>;
  cv: {
    filePath: string;
    fileType: string;
  };
};

const baseCandidate: CandidateFixture = {
  firstName: 'María',
  lastName: 'López',
  email: 'maria.lopez@example.com',
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
} as const;

export const buildCandidateServicePayload = (
  overrides: Partial<CandidateFixture> = {},
): CandidateFixture => {
  const payload = clone(baseCandidate);
  return {
    ...payload,
    ...overrides,
  };
};

export const buildCandidateDomainData = () => {
  const { educations, workExperiences, cv, ...rest } = clone(baseCandidate);
  return {
    id: undefined,
    ...rest,
    education: educations.map((education) => ({
      ...education,
      startDate: new Date(education.startDate),
      endDate: new Date(education.endDate),
    })),
    workExperience: workExperiences.map((experience) => ({
      ...experience,
      startDate: new Date(experience.startDate),
      endDate: new Date(experience.endDate),
    })),
    resumes: [
      {
        filePath: cv.filePath,
        fileType: cv.fileType,
      },
    ],
  };
};

export const buildCandidatePersistenceResult = () => ({
  id: 1,
  firstName: baseCandidate.firstName,
  lastName: baseCandidate.lastName,
  email: baseCandidate.email,
  phone: baseCandidate.phone,
  address: baseCandidate.address,
});

export const buildEducationDomainData = () => ({
  id: undefined,
  ...clone(baseCandidate.educations[0]),
  candidateId: 1,
});

export const buildWorkExperienceDomainData = () => ({
  id: undefined,
  ...clone(baseCandidate.workExperiences[0]),
  candidateId: 1,
});

export const buildResumeDomainData = () => ({
  id: undefined,
  candidateId: 1,
  ...clone(baseCandidate.cv),
});

