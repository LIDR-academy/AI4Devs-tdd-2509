import { validateCandidateData } from '../application/validator';

describe('Validator - Email validation (Acceptance 4)', () => {
  const baseCandidate = {
    firstName: 'Juan',
    lastName: 'Perez',
    phone: '612345678',
    address: 'Calle Falsa 123',
    educations: [],
    workExperiences: [],
  };

  test.each([
    ['simple valid', 'user@example.com', true],
    ['subdomain valid', 'user@mail.example.co', true],
    ['plus tag valid', 'user+tag@example.com', true],
    ['missing @', 'userexample.com', false],
    ['missing domain', 'user@', false],
    ['spaces invalid', 'user @example.com', false],
    ['empty string', '', false],
  ])('%s -> %s should be %s', (_name, email, shouldPass) => {
    const candidate = { ...baseCandidate, email };
    if (shouldPass) {
      expect(() => validateCandidateData(candidate)).not.toThrow();
    } else {
      expect(() => validateCandidateData(candidate)).toThrow('Invalid email');
    }
  });
});
