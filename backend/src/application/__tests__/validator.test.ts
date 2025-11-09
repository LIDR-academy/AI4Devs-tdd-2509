import { validateCandidateData } from '../validator';

describe('Validator', () => {
  describe('validateName', () => {
    it('debería aceptar nombres válidos con letras españolas', () => {
      // Arrange
      const validCandidate = {
        firstName: 'José María',
        lastName: 'García Hernández',
        email: 'jose@example.com',
        phone: '612345678'
      };

      // Act & Assert
      expect(() => validateCandidateData(validCandidate)).not.toThrow();
    });

    it('debería rechazar nombres con menos de 2 caracteres', () => {
      // Arrange
      const invalidCandidate = {
        firstName: 'J',
        lastName: 'García',
        email: 'jose@example.com',
        phone: '612345678'
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid name');
    });

    it('debería rechazar nombres con más de 100 caracteres', () => {
      // Arrange
      const invalidCandidate = {
        firstName: 'A'.repeat(101),
        lastName: 'García',
        email: 'jose@example.com',
        phone: '612345678'
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid name');
    });

    it('debería rechazar nombres con caracteres especiales inválidos', () => {
      // Arrange
      const invalidCandidate = {
        firstName: 'José123',
        lastName: 'García',
        email: 'jose@example.com',
        phone: '612345678'
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid name');
    });

    it('debería rechazar nombres undefined o null', () => {
      // Arrange
      const invalidCandidateUndefined = {
        firstName: undefined as any,
        lastName: 'García',
        email: 'jose@example.com',
        phone: '612345678'
      };

      const invalidCandidateNull = {
        firstName: null as any,
        lastName: 'García',
        email: 'jose@example.com',
        phone: '612345678'
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidCandidateUndefined)).toThrow('Invalid name');
      expect(() => validateCandidateData(invalidCandidateNull)).toThrow('Invalid name');
    });
  });

  describe('validateEmail', () => {
    it('debería aceptar emails válidos', () => {
      // Arrange
      const validEmails = [
        'test@example.com',
        'user.name@domain.co',
        'test+filter@example.org',
        'user_name@subdomain.example.com'
      ];

      // Act & Assert
      validEmails.forEach(email => {
        const candidate = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email,
          phone: '612345678'
        };
        expect(() => validateCandidateData(candidate)).not.toThrow();
      });
    });

    it('debería rechazar emails sin @', () => {
      // Arrange
      const invalidCandidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'testexample.com',
        phone: '612345678'
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid email');
    });

    it('debería rechazar emails sin dominio', () => {
      // Arrange
      const invalidCandidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@',
        phone: '612345678'
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid email');
    });

    it('debería rechazar emails undefined o null', () => {
      // Arrange
      const invalidCandidateUndefined = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: undefined as any,
        phone: '612345678'
      };

      const invalidCandidateNull = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: null as any,
        phone: '612345678'
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidCandidateUndefined)).toThrow('Invalid email');
      expect(() => validateCandidateData(invalidCandidateNull)).toThrow('Invalid email');
    });
  });

  describe('validatePhone', () => {
    it('debería aceptar teléfonos válidos españoles (6|7|9 + 8 dígitos)', () => {
      // Arrange
      const validPhones = ['612345678', '712345678', '912345678'];

      // Act & Assert
      validPhones.forEach(phone => {
        const candidate = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'test@example.com',
          phone
        };
        expect(() => validateCandidateData(candidate)).not.toThrow();
      });
    });

    it('debería permitir phone undefined (campo opcional)', () => {
      // Arrange
      const candidateWithoutPhone = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: undefined
      };

      // Act & Assert
      expect(() => validateCandidateData(candidateWithoutPhone)).not.toThrow();
    });

    it('debería rechazar teléfonos con formato inválido', () => {
      // Arrange
      const invalidPhones = [
        '512345678', // No empieza con 6, 7 o 9
        '61234567',  // Menos de 9 dígitos
        '6123456789', // Más de 9 dígitos
        '61234567a', // Contiene letras
        '123456789'  // No empieza con 6, 7 o 9
      ];

      // Act & Assert
      invalidPhones.forEach(phone => {
        const candidate = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'test@example.com',
          phone
        };
        expect(() => validateCandidateData(candidate)).toThrow('Invalid phone');
      });
    });
  });

  describe('validateDate', () => {
    it('debería aceptar fechas en formato YYYY-MM-DD', () => {
      // Arrange
      const validDates = ['2024-01-15', '2023-12-31', '2020-06-01'];

      // Act & Assert
      validDates.forEach(date => {
        const candidate = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'test@example.com',
          phone: '612345678',
          educations: [{
            institution: 'Universidad',
            title: 'Ingeniería',
            startDate: date,
            endDate: '2024-12-31'
          }]
        };
        expect(() => validateCandidateData(candidate)).not.toThrow();
      });
    });

    it('debería rechazar fechas en formato incorrecto', () => {
      // Arrange
      const invalidDates = [
        '15-01-2024',  // DD-MM-YYYY
        '2024/01/15',  // Separador incorrecto
        '2024-1-15',   // Mes sin cero
        '2024-01-1',   // Día sin cero
        'invalid-date'
      ];

      // Act & Assert
      invalidDates.forEach(date => {
        const candidate = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'test@example.com',
          phone: '612345678',
          educations: [{
            institution: 'Universidad',
            title: 'Ingeniería',
            startDate: date,
            endDate: '2024-12-31'
          }]
        };
        expect(() => validateCandidateData(candidate)).toThrow('Invalid date');
      });
    });

    it('debería rechazar fechas undefined o null', () => {
      // Arrange
      const candidateUndefined = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        educations: [{
          institution: 'Universidad',
          title: 'Ingeniería',
          startDate: undefined as any,
          endDate: '2024-12-31'
        }]
      };

      const candidateNull = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        educations: [{
          institution: 'Universidad',
          title: 'Ingeniería',
          startDate: null as any,
          endDate: '2024-12-31'
        }]
      };

      // Act & Assert
      expect(() => validateCandidateData(candidateUndefined)).toThrow('Invalid date');
      expect(() => validateCandidateData(candidateNull)).toThrow('Invalid date');
    });
  });

  describe('validateAddress', () => {
    it('debería aceptar direcciones válidas', () => {
      // Arrange
      const validAddresses = [
        'Calle Mayor 123',
        'Av. de la Constitución, 45, 3º B',
        'Plaza de España, 1'
      ];

      // Act & Assert
      validAddresses.forEach(address => {
        const candidate = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'test@example.com',
          phone: '612345678',
          address
        };
        expect(() => validateCandidateData(candidate)).not.toThrow();
      });
    });

    it('debería rechazar direcciones con más de 100 caracteres', () => {
      // Arrange
      const invalidCandidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        address: 'A'.repeat(101)
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid address');
    });

    it('debería permitir address undefined (campo opcional)', () => {
      // Arrange
      const candidateWithoutAddress = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        address: undefined
      };

      // Act & Assert
      expect(() => validateCandidateData(candidateWithoutAddress)).not.toThrow();
    });
  });

  describe('validateEducation', () => {
    it('debería aceptar educación válida completa', () => {
      // Arrange
      const candidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        educations: [{
          institution: 'Universidad Politécnica',
          title: 'Ingeniería Informática',
          startDate: '2020-09-01',
          endDate: '2024-06-30'
        }]
      };

      // Act & Assert
      expect(() => validateCandidateData(candidate)).not.toThrow();
    });

    it('debería rechazar educación sin institución o con institución > 100 chars', () => {
      // Arrange
      const candidateWithoutInstitution = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        educations: [{
          institution: undefined as any,
          title: 'Ingeniería',
          startDate: '2020-09-01'
        }]
      };

      const candidateLongInstitution = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        educations: [{
          institution: 'A'.repeat(101),
          title: 'Ingeniería',
          startDate: '2020-09-01'
        }]
      };

      // Act & Assert
      expect(() => validateCandidateData(candidateWithoutInstitution)).toThrow('Invalid institution');
      expect(() => validateCandidateData(candidateLongInstitution)).toThrow('Invalid institution');
    });

    it('debería rechazar educación sin título o con título > 100 chars', () => {
      // Arrange
      const candidateWithoutTitle = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        educations: [{
          institution: 'Universidad',
          title: undefined as any,
          startDate: '2020-09-01'
        }]
      };

      const candidateLongTitle = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        educations: [{
          institution: 'Universidad',
          title: 'A'.repeat(101),
          startDate: '2020-09-01'
        }]
      };

      // Act & Assert
      expect(() => validateCandidateData(candidateWithoutTitle)).toThrow('Invalid title');
      expect(() => validateCandidateData(candidateLongTitle)).toThrow('Invalid title');
    });

    it('debería validar fechas de educación', () => {
      // Arrange
      const candidateInvalidStartDate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        educations: [{
          institution: 'Universidad',
          title: 'Ingeniería',
          startDate: 'invalid-date',
          endDate: '2024-06-30'
        }]
      };

      const candidateInvalidEndDate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        educations: [{
          institution: 'Universidad',
          title: 'Ingeniería',
          startDate: '2020-09-01',
          endDate: 'invalid-date'
        }]
      };

      // Act & Assert
      expect(() => validateCandidateData(candidateInvalidStartDate)).toThrow('Invalid date');
      expect(() => validateCandidateData(candidateInvalidEndDate)).toThrow('Invalid end date');
    });
  });

  describe('validateExperience', () => {
    it('debería aceptar experiencia válida completa', () => {
      // Arrange
      const candidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        workExperiences: [{
          company: 'Tech Corp',
          position: 'Software Developer',
          description: 'Desarrollo de aplicaciones web',
          startDate: '2020-01-01',
          endDate: '2023-12-31'
        }]
      };

      // Act & Assert
      expect(() => validateCandidateData(candidate)).not.toThrow();
    });

    it('debería rechazar experiencia sin compañía o con compañía > 100 chars', () => {
      // Arrange
      const candidateWithoutCompany = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        workExperiences: [{
          company: undefined as any,
          position: 'Developer',
          startDate: '2020-01-01'
        }]
      };

      const candidateLongCompany = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        workExperiences: [{
          company: 'A'.repeat(101),
          position: 'Developer',
          startDate: '2020-01-01'
        }]
      };

      // Act & Assert
      expect(() => validateCandidateData(candidateWithoutCompany)).toThrow('Invalid company');
      expect(() => validateCandidateData(candidateLongCompany)).toThrow('Invalid company');
    });

    it('debería rechazar experiencia sin posición o con posición > 100 chars', () => {
      // Arrange
      const candidateWithoutPosition = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        workExperiences: [{
          company: 'Tech Corp',
          position: undefined as any,
          startDate: '2020-01-01'
        }]
      };

      const candidateLongPosition = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        workExperiences: [{
          company: 'Tech Corp',
          position: 'A'.repeat(101),
          startDate: '2020-01-01'
        }]
      };

      // Act & Assert
      expect(() => validateCandidateData(candidateWithoutPosition)).toThrow('Invalid position');
      expect(() => validateCandidateData(candidateLongPosition)).toThrow('Invalid position');
    });

    it('debería validar que description no exceda 200 chars', () => {
      // Arrange
      const candidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        workExperiences: [{
          company: 'Tech Corp',
          position: 'Developer',
          description: 'A'.repeat(201),
          startDate: '2020-01-01'
        }]
      };

      // Act & Assert
      expect(() => validateCandidateData(candidate)).toThrow('Invalid description');
    });
  });

  describe('validateCV', () => {
    it('debería aceptar CV válido con filePath y fileType', () => {
      // Arrange
      const candidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        cv: {
          filePath: '/uploads/cv.pdf',
          fileType: 'application/pdf'
        }
      };

      // Act & Assert
      expect(() => validateCandidateData(candidate)).not.toThrow();
    });

    it('debería rechazar CV sin filePath', () => {
      // Arrange
      const candidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        cv: {
          fileType: 'application/pdf'
        }
      };

      // Act & Assert
      expect(() => validateCandidateData(candidate)).toThrow('Invalid CV data');
    });

    it('debería rechazar CV sin fileType', () => {
      // Arrange
      const candidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        cv: {
          filePath: '/uploads/cv.pdf'
        }
      };

      // Act & Assert
      expect(() => validateCandidateData(candidate)).toThrow('Invalid CV data');
    });
  });

  describe('validateCandidateData (función principal)', () => {
    it('debería validar candidato completo válido', () => {
      // Arrange
      const validCandidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '612345678',
        address: 'Calle Mayor 123',
        educations: [{
          institution: 'Universidad Politécnica',
          title: 'Ingeniería Informática',
          startDate: '2020-09-01',
          endDate: '2024-06-30'
        }],
        workExperiences: [{
          company: 'Tech Corp',
          position: 'Software Developer',
          description: 'Desarrollo de aplicaciones web',
          startDate: '2020-01-01',
          endDate: '2023-12-31'
        }],
        cv: {
          filePath: '/uploads/cv.pdf',
          fileType: 'application/pdf'
        }
      };

      // Act & Assert
      expect(() => validateCandidateData(validCandidate)).not.toThrow();
    });

    it('debería saltear validaciones si id está presente (edición)', () => {
      // Arrange
      const candidateWithId = {
        id: 1,
        firstName: 'J', // Normalmente inválido
        email: 'invalid-email' // Normalmente inválido
      };

      // Act & Assert
      expect(() => validateCandidateData(candidateWithId)).not.toThrow();
    });

    it('debería validar arrays de educaciones', () => {
      // Arrange
      const candidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        educations: [
          {
            institution: 'Universidad 1',
            title: 'Título 1',
            startDate: '2020-09-01',
            endDate: '2024-06-30'
          },
          {
            institution: 'Universidad 2',
            title: 'Título 2',
            startDate: '2018-09-01',
            endDate: '2020-06-30'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(candidate)).not.toThrow();
    });

    it('debería validar arrays de experiencias laborales', () => {
      // Arrange
      const candidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'test@example.com',
        phone: '612345678',
        workExperiences: [
          {
            company: 'Company 1',
            position: 'Position 1',
            startDate: '2020-01-01',
            endDate: '2023-12-31'
          },
          {
            company: 'Company 2',
            position: 'Position 2',
            startDate: '2018-01-01',
            endDate: '2019-12-31'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(candidate)).not.toThrow();
    });
  });
});
