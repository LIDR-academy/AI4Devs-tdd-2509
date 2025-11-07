import { jest } from '@jest/globals';

export type AsyncRepoMock<TData = unknown, TResult = unknown> = jest.MockedFunction<
  (data: TData) => Promise<TResult>
>;

export const candidateSaveMock: AsyncRepoMock = jest.fn();
export const educationSaveMock: AsyncRepoMock = jest.fn();
export const workExperienceSaveMock: AsyncRepoMock = jest.fn();
export const resumeSaveMock: AsyncRepoMock = jest.fn();

export class CandidateMock {
  static instances: CandidateMock[] = [];
  education: unknown[] = [];
  workExperience: unknown[] = [];
  resumes: unknown[] = [];

  constructor(public data: unknown) {
    CandidateMock.instances.push(this);
  }

  save = candidateSaveMock;

  static reset() {
    CandidateMock.instances = [];
    candidateSaveMock.mockReset();
  }
}

export class EducationMock {
  static instances: EducationMock[] = [];
  candidateId?: number;

  constructor(public data: unknown) {
    EducationMock.instances.push(this);
  }

  save = educationSaveMock;

  static reset() {
    EducationMock.instances = [];
    educationSaveMock.mockReset();
  }
}

export class WorkExperienceMock {
  static instances: WorkExperienceMock[] = [];
  candidateId?: number;

  constructor(public data: unknown) {
    WorkExperienceMock.instances.push(this);
  }

  save = workExperienceSaveMock;

  static reset() {
    WorkExperienceMock.instances = [];
    workExperienceSaveMock.mockReset();
  }
}

export class ResumeMock {
  static instances: ResumeMock[] = [];
  candidateId?: number;

  constructor(public data: unknown) {
    ResumeMock.instances.push(this);
  }

  save = resumeSaveMock;

  static reset() {
    ResumeMock.instances = [];
    resumeSaveMock.mockReset();
  }
}

export const resetAllRepoMocks = () => {
  CandidateMock.reset();
  EducationMock.reset();
  WorkExperienceMock.reset();
  ResumeMock.reset();
};

