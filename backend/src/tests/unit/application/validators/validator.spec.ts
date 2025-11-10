import { describe, it, expect } from '@jest/globals';
import { buildCandidateServicePayload } from '../../fixtures/candidate.fixture';
import { validateCandidateData } from '../../../../application/validator';

describe('application/validator.validateCandidateData', () => {
  const runValidation = (overrides: Partial<ReturnType<typeof buildCandidateServicePayload>>) =>
    () => validateCandidateData({ ...buildCandidateServicePayload(), ...overrides });

  describe('required fields', () => {
    it('rejects missing firstName', () => {
      expect(runValidation({ firstName: '' })).toThrow('Invalid name');
    });

    it('rejects missing lastName', () => {
      expect(runValidation({ lastName: '' })).toThrow('Invalid name');
    });

    it('rejects missing email', () => {
      expect(runValidation({ email: '' })).toThrow('Invalid email');
    });

    it('rejects missing phone (BUG-VAL-001)', () => {
      expect(runValidation({ phone: undefined as any })).toThrow('Invalid phone');
    });

    it('rejects missing address (BUG-VAL-001)', () => {
      expect(runValidation({ address: '' })).toThrow('Invalid address');
    });

    it('rejects missing education (BUG-VAL-001)', () => {
      const payload = buildCandidateServicePayload({ educations: [] });

      expect(() => validateCandidateData(payload)).toThrow('Invalid institution');
    });

    it('rejects missing cv (BUG-VAL-001)', () => {
      const payload = buildCandidateServicePayload();
      delete (payload as any).cv;

      expect(() => validateCandidateData(payload)).toThrow('Invalid CV data');
    });
  });

  describe('format validations', () => {
    it('accepts a fully populated candidate payload', () => {
      expect(() => validateCandidateData(buildCandidateServicePayload())).not.toThrow();
    });

    it('rejects invalid email format', () => {
      expect(runValidation({ email: 'correo-invalido' })).toThrow('Invalid email');
    });

    it('rejects invalid phone format', () => {
      expect(runValidation({ phone: '1234' as any })).toThrow('Invalid phone');
    });

    it('accept international phone numbers (BUG-VAL-002)', () => {
      const internationalPayload = buildCandidateServicePayload({ phone: '+541112345678' as any });

      expect(() => validateCandidateData(internationalPayload)).not.toThrow();
    });

    it('rejects education with empty institution', () => {
      const payload = buildCandidateServicePayload({
        educations: [
          {
            ...buildCandidateServicePayload().educations[0],
            institution: '',
          },
        ],
      });

      expect(() => validateCandidateData(payload)).toThrow('Invalid institution');
    });

    it('rejects work experience with empty company', () => {
      const payload = buildCandidateServicePayload({
        workExperiences: [
          {
            ...buildCandidateServicePayload().workExperiences[0],
            company: '',
          },
        ],
      });

      expect(() => validateCandidateData(payload)).toThrow('Invalid company');
    });
  });

  describe('date validations', () => {
    it('rejects education when endDate has invalid format', () => {
      const payload = buildCandidateServicePayload({
        educations: [
          {
            ...buildCandidateServicePayload().educations[0],
            endDate: '2020/12/01',
          },
        ],
      });

      expect(() => validateCandidateData(payload)).toThrow('Invalid end date');
    });
  });
});

