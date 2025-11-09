import { validateCandidateData } from '../application/validator';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    education: {
      create: jest.fn(),
      update: jest.fn(),
    },
    workExperience: {
      create: jest.fn(),
      update: jest.fn(),
    },
    resume: {
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
    Prisma: {
      PrismaClientInitializationError: class PrismaClientInitializationError extends Error {},
    },
  };
});

describe('Validación de datos de candidato', () => {
  let baseValidData: any;

  beforeEach(() => {
    baseValidData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
    };
  });

  describe('Campos obligatorios', () => {
    describe('firstName', () => {
      describe('casos válidos', () => {
        test('debe aceptar firstName con letras acentuadas y espacios', () => {
          // Arrange
          const validData = {
            ...baseValidData,
            firstName: 'María José',
          };

          // Act & Assert
          expect(() => validateCandidateData(validData)).not.toThrow();
        });
      });

      describe('casos inválidos', () => {
        test('debe lanzar error si firstName está ausente', () => {
          // Arrange
          const { firstName, ...invalidData } = baseValidData;

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });

        test('debe lanzar error si firstName está vacío', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            firstName: '',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });

        test('debe lanzar error si firstName tiene menos de 2 caracteres', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            firstName: 'A',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });

        test('debe lanzar error si firstName tiene más de 100 caracteres', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            firstName: 'A'.repeat(101),
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });

        test('debe lanzar error si firstName contiene números', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            firstName: 'Juan123',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });

        test('debe lanzar error si firstName contiene caracteres especiales', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            firstName: 'Juan@',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });
      });
    });

    describe('lastName', () => {
      describe('casos válidos', () => {
        test('debe aceptar lastName con letras acentuadas y espacios', () => {
          // Arrange
          const validData = {
            ...baseValidData,
            lastName: 'López Sánchez',
          };

          // Act & Assert
          expect(() => validateCandidateData(validData)).not.toThrow();
        });
      });

      describe('casos inválidos', () => {
        test('debe lanzar error si lastName está ausente', () => {
          // Arrange
          const { lastName, ...invalidData } = baseValidData;

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });

        test('debe lanzar error si lastName está vacío', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            lastName: '',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });

        test('debe lanzar error si lastName tiene menos de 2 caracteres', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            lastName: 'P',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });

        test('debe lanzar error si lastName tiene más de 100 caracteres', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            lastName: 'P'.repeat(101),
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });

        test('debe lanzar error si lastName contiene números', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            lastName: 'Pérez123',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });

        test('debe lanzar error si lastName contiene caracteres especiales', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            lastName: 'Pérez$',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid name',
          );
        });
      });
    });

    describe('email', () => {
      describe('casos válidos', () => {
        test('debe aceptar email con formato válido', () => {
          // Arrange
          const validData = {
            ...baseValidData,
            email: 'ana.martinez@example.com',
          };

          // Act & Assert
          expect(() => validateCandidateData(validData)).not.toThrow();
        });
      });

      describe('casos inválidos', () => {
        test('debe lanzar error si email está ausente', () => {
          // Arrange
          const { email, ...invalidData } = baseValidData;

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid email',
          );
        });

        test('debe lanzar error si email no tiene @', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            email: 'anaexample.com',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid email',
          );
        });

        test('debe lanzar error si email no tiene dominio', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            email: 'ana@',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid email',
          );
        });

        test('debe lanzar error si email no tiene extensión de dominio', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            email: 'ana@example',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid email',
          );
        });
      });
    });
  });

  describe('Campos opcionales', () => {
    describe('phone', () => {
      describe('casos válidos', () => {
        test('debe aceptar candidato sin phone (ausente)', () => {
          // Act & Assert
          expect(() => validateCandidateData(baseValidData)).not.toThrow();
        });

        test('debe aceptar phone null', () => {
          // Arrange
          const validData = {
            ...baseValidData,
            phone: null,
          };

          // Act & Assert
          expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debe aceptar phone undefined', () => {
          // Arrange
          const validData = {
            ...baseValidData,
            phone: undefined,
          };

          // Act & Assert
          expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debe aceptar phone vacío', () => {
          // Arrange
          const validData = {
            ...baseValidData,
            phone: '',
          };

          // Act & Assert
          expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test.each([
          ['6', '612345678'],
          ['7', '712345678'],
          ['9', '912345678'],
        ])('debe aceptar phone válido que empieza por %s', (digit, phone) => {
          // Arrange
          const validData = {
            ...baseValidData,
            phone,
          };

          // Act & Assert
          expect(() => validateCandidateData(validData)).not.toThrow();
        });
      });

      describe('casos inválidos', () => {
        test('debe lanzar error si phone tiene solo 8 dígitos', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            phone: '12345678',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid phone',
          );
        });

        test('debe lanzar error si phone empieza por 5', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            phone: '512345678',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid phone',
          );
        });

        test('debe lanzar error si phone tiene formato incorrecto', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            phone: '6123-456-78',
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid phone',
          );
        });
      });
    });

    describe('address', () => {
      describe('casos válidos', () => {
        test('debe aceptar candidato sin address', () => {
          // Act & Assert
          expect(() => validateCandidateData(baseValidData)).not.toThrow();
        });

        test('debe aceptar address válido de hasta 100 caracteres', () => {
          // Arrange
          const validData = {
            ...baseValidData,
            address: 'Calle Mayor 123, 1º A',
          };

          // Act & Assert
          expect(() => validateCandidateData(validData)).not.toThrow();
        });
      });

      describe('casos inválidos', () => {
        test('debe lanzar error si address tiene más de 100 caracteres', () => {
          // Arrange
          const invalidData = {
            ...baseValidData,
            address: 'A'.repeat(101),
          };

          // Act & Assert
          expect(() => validateCandidateData(invalidData)).toThrow(
            'Invalid address',
          );
        });
      });
    });
  });

  describe('Educations (array opcional)', () => {
    describe('casos válidos', () => {
      test('debe aceptar educations sin estar presente', () => {
        // Act & Assert
        expect(() => validateCandidateData(baseValidData)).not.toThrow();
      });

      test('debe aceptar educations como array vacío', () => {
        // Arrange
        const validData = {
          ...baseValidData,
          educations: [],
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      test('debe aceptar education con todos los campos obligatorios válidos', () => {
        // Arrange
        const validData = {
          ...baseValidData,
          educations: [
            {
              institution: 'Universidad Politécnica',
              title: 'Ingeniería Informática',
              startDate: '2015-09-01',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      test('debe aceptar education con endDate opcional presente', () => {
        // Arrange
        const validData = {
          ...baseValidData,
          educations: [
            {
              institution: 'Universidad Politécnica',
              title: 'Ingeniería Informática',
              startDate: '2015-09-01',
              endDate: '2019-06-30',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });
    });

    describe('casos inválidos', () => {
      test('debe lanzar error si education no tiene institution', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          educations: [
            {
              title: 'Ingeniería Informática',
              startDate: '2015-09-01',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid institution',
        );
      });

      test('debe lanzar error si education no tiene title', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          educations: [
            {
              institution: 'Universidad Politécnica',
              startDate: '2015-09-01',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid title',
        );
      });

      test('debe lanzar error si education no tiene startDate', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          educations: [
            {
              institution: 'Universidad Politécnica',
              title: 'Ingeniería Informática',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid date',
        );
      });

      test('debe lanzar error si education tiene startDate con formato incorrecto', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          educations: [
            {
              institution: 'Universidad Politécnica',
              title: 'Ingeniería Informática',
              startDate: '01-09-2015',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid date',
        );
      });

      test('debe lanzar error si education tiene endDate con formato incorrecto', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          educations: [
            {
              institution: 'Universidad Politécnica',
              title: 'Ingeniería Informática',
              startDate: '2015-09-01',
              endDate: '30/06/2019',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid end date',
        );
      });
    });
  });

  describe('WorkExperiences (array opcional)', () => {
    describe('casos válidos', () => {
      test('debe aceptar workExperiences sin estar presente', () => {
        // Act & Assert
        expect(() => validateCandidateData(baseValidData)).not.toThrow();
      });

      test('debe aceptar workExperiences como array vacío', () => {
        // Arrange
        const validData = {
          ...baseValidData,
          workExperiences: [],
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      test('debe aceptar workExperience con todos los campos obligatorios válidos', () => {
        // Arrange
        const validData = {
          ...baseValidData,
          workExperiences: [
            {
              company: 'TechCorp',
              position: 'Developer',
              startDate: '2019-07-01',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      test('debe aceptar workExperience sin description (opcional)', () => {
        // Arrange
        const validData = {
          ...baseValidData,
          workExperiences: [
            {
              company: 'TechCorp',
              position: 'Developer',
              startDate: '2019-07-01',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      test('debe aceptar workExperience con description válida', () => {
        // Arrange
        const validData = {
          ...baseValidData,
          workExperiences: [
            {
              company: 'TechCorp',
              position: 'Developer',
              description: 'Desarrollo web con React y Node.js',
              startDate: '2019-07-01',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });
    });

    describe('casos inválidos', () => {
      test('debe lanzar error si workExperience no tiene company', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          workExperiences: [
            {
              position: 'Developer',
              startDate: '2019-07-01',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid company',
        );
      });

      test('debe lanzar error si workExperience no tiene position', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          workExperiences: [
            {
              company: 'TechCorp',
              startDate: '2019-07-01',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid position',
        );
      });

      test('debe lanzar error si workExperience no tiene startDate', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          workExperiences: [
            {
              company: 'TechCorp',
              position: 'Developer',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid date',
        );
      });

      test('debe lanzar error si workExperience tiene description mayor a 200 caracteres', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          workExperiences: [
            {
              company: 'TechCorp',
              position: 'Developer',
              description: 'A'.repeat(201),
              startDate: '2019-07-01',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid description',
        );
      });

      test('debe lanzar error si workExperience tiene startDate con formato incorrecto', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          workExperiences: [
            {
              company: 'TechCorp',
              position: 'Developer',
              startDate: '01/07/2019',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid date',
        );
      });

      test('debe lanzar error si workExperience tiene endDate con formato incorrecto', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          workExperiences: [
            {
              company: 'TechCorp',
              position: 'Developer',
              startDate: '2019-07-01',
              endDate: '2023-12',
            },
          ],
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid end date',
        );
      });
    });
  });

  describe('CV (opcional)', () => {
    describe('casos válidos', () => {
      test('debe aceptar candidato sin cv', () => {
        // Act & Assert
        expect(() => validateCandidateData(baseValidData)).not.toThrow();
      });

      test('debe aceptar cv como objeto vacío', () => {
        // Arrange
        const validData = {
          ...baseValidData,
          cv: {},
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      test('debe aceptar cv con filePath y fileType válidos', () => {
        // Arrange
        const validData = {
          ...baseValidData,
          cv: {
            filePath: '/uploads/cv.pdf',
            fileType: 'application/pdf',
          },
        };

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });
    });

    describe('casos inválidos', () => {
      test('debe lanzar error si cv no tiene filePath', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          cv: {
            fileType: 'application/pdf',
          },
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid CV data',
        );
      });

      test('debe lanzar error si cv no tiene fileType', () => {
        // Arrange
        const invalidData = {
          ...baseValidData,
          cv: {
            filePath: '/uploads/cv.pdf',
          },
        };

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow(
          'Invalid CV data',
        );
      });
    });
  });
});

describe('Persistencia de candidatos en base de datos', () => {
  let mockPrisma: any;
  let addCandidate: any;

  beforeEach(() => {
    jest.clearAllMocks();

    const { PrismaClient } = require('@prisma/client');
    mockPrisma = new PrismaClient();

    mockPrisma.candidate.create.mockResolvedValue({
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      phone: null,
      address: null,
    });

    mockPrisma.education.create.mockResolvedValue({
      id: 1,
      institution: 'Universidad Politécnica',
      title: 'Ingeniería Informática',
      startDate: new Date('2015-09-01'),
      endDate: null,
      candidateId: 1,
    });

    mockPrisma.workExperience.create.mockResolvedValue({
      id: 1,
      company: 'TechCorp',
      position: 'Developer',
      description: null,
      startDate: new Date('2019-07-01'),
      endDate: null,
      candidateId: 1,
    });

    mockPrisma.resume.create.mockResolvedValue({
      id: 1,
      candidateId: 1,
      filePath: '/uploads/cv.pdf',
      fileType: 'application/pdf',
      uploadDate: new Date(),
    });

    const candidateService = require('../application/services/candidateService');
    addCandidate = candidateService.addCandidate;
  });

  describe('Guardado básico', () => {
    test('debe guardar candidato solo con campos obligatorios', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
      };

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.email).toBe('juan@example.com');
    });

    test('debe llamar a prisma.candidate.create con datos correctos', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.candidate.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
        },
      });
    });

    test('debe retornar el candidato guardado', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Ana',
        lastName: 'García',
        email: 'ana@example.com',
      };

      mockPrisma.candidate.create.mockResolvedValue({
        id: 2,
        firstName: 'Ana',
        lastName: 'García',
        email: 'ana@example.com',
        phone: null,
        address: null,
      });

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result.id).toBe(2);
      expect(result.firstName).toBe('Ana');
      expect(result.lastName).toBe('García');
      expect(result.email).toBe('ana@example.com');
    });
  });

  describe('Campos opcionales', () => {
    test('debe guardar candidato con phone y address', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Carlos',
        lastName: 'Ruiz',
        email: 'carlos@example.com',
        phone: '612345678',
        address: 'Calle Mayor 123',
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: 'Carlos',
          lastName: 'Ruiz',
          email: 'carlos@example.com',
          phone: '612345678',
          address: 'Calle Mayor 123',
        },
      });
    });

    test('debe omitir phone y address cuando son undefined', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Laura',
        lastName: 'González',
        email: 'laura@example.com',
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      const callArgs = mockPrisma.candidate.create.mock.calls[0][0];
      expect(callArgs.data).not.toHaveProperty('phone');
      expect(callArgs.data).not.toHaveProperty('address');
    });
  });

  describe('Relaciones - Educations', () => {
    test('debe crear education cuando hay una education en el candidato', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Pedro',
        lastName: 'Moreno',
        email: 'pedro@example.com',
        educations: [
          {
            institution: 'Universidad Politécnica',
            title: 'Ingeniería Informática',
            startDate: '2015-09-01',
          },
        ],
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.education.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.education.create).toHaveBeenCalledWith({
        data: {
          institution: 'Universidad Politécnica',
          title: 'Ingeniería Informática',
          startDate: new Date('2015-09-01'),
          endDate: undefined,
          candidateId: 1,
        },
      });
    });

    test('debe crear múltiples educations cuando hay varias', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Sofía',
        lastName: 'Ramírez',
        email: 'sofia@example.com',
        educations: [
          {
            institution: 'Universidad A',
            title: 'Grado A',
            startDate: '2010-09-01',
            endDate: '2014-06-30',
          },
          {
            institution: 'Universidad B',
            title: 'Máster B',
            startDate: '2014-09-01',
            endDate: '2016-06-30',
          },
        ],
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.education.create).toHaveBeenCalledTimes(2);
    });

    test('no debe llamar a education.create cuando educations está vacío', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Miguel',
        lastName: 'Hernández',
        email: 'miguel@example.com',
        educations: [],
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.education.create).not.toHaveBeenCalled();
    });

    test('no debe llamar a education.create cuando educations no está presente', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Elena',
        lastName: 'Martín',
        email: 'elena@example.com',
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.education.create).not.toHaveBeenCalled();
    });
  });

  describe('Relaciones - WorkExperiences', () => {
    test('debe crear workExperience cuando hay una experiencia en el candidato', async () => {
      // Arrange
      const candidateData = {
        firstName: 'David',
        lastName: 'López',
        email: 'david@example.com',
        workExperiences: [
          {
            company: 'TechCorp',
            position: 'Developer',
            startDate: '2019-07-01',
          },
        ],
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.workExperience.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.workExperience.create).toHaveBeenCalledWith({
        data: {
          company: 'TechCorp',
          position: 'Developer',
          description: undefined,
          startDate: new Date('2019-07-01'),
          endDate: undefined,
          candidateId: 1,
        },
      });
    });

    test('debe crear múltiples workExperiences cuando hay varias', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Isabel',
        lastName: 'Núñez',
        email: 'isabel@example.com',
        workExperiences: [
          {
            company: 'Company A',
            position: 'Junior Dev',
            startDate: '2017-01-01',
            endDate: '2019-06-30',
          },
          {
            company: 'Company B',
            position: 'Senior Dev',
            startDate: '2019-07-01',
          },
        ],
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.workExperience.create).toHaveBeenCalledTimes(2);
    });

    test('no debe llamar a workExperience.create cuando workExperiences está vacío', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Raúl',
        lastName: 'Sánchez',
        email: 'raul@example.com',
        workExperiences: [],
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.workExperience.create).not.toHaveBeenCalled();
    });

    test('no debe llamar a workExperience.create cuando workExperiences no está presente', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Carmen',
        lastName: 'Ortiz',
        email: 'carmen@example.com',
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.workExperience.create).not.toHaveBeenCalled();
    });
  });

  describe('Relaciones - CV', () => {
    test('debe crear resume cuando hay CV en el candidato', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Alberto',
        lastName: 'Díaz',
        email: 'alberto@example.com',
        cv: {
          filePath: '/uploads/cv.pdf',
          fileType: 'application/pdf',
        },
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.resume.create).toHaveBeenCalledTimes(1);
      const callArgs = mockPrisma.resume.create.mock.calls[0][0];
      expect(callArgs.data.candidateId).toBe(1);
      expect(callArgs.data.filePath).toBe('/uploads/cv.pdf');
      expect(callArgs.data.fileType).toBe('application/pdf');
      expect(callArgs.data.uploadDate).toBeInstanceOf(Date);
    });

    test('no debe llamar a resume.create cuando cv es objeto vacío', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Teresa',
        lastName: 'Vega',
        email: 'teresa@example.com',
        cv: {},
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.resume.create).not.toHaveBeenCalled();
    });

    test('no debe llamar a resume.create cuando cv no está presente', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Francisco',
        lastName: 'Jiménez',
        email: 'francisco@example.com',
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.resume.create).not.toHaveBeenCalled();
    });
  });

  describe('Caso completo', () => {
    test('debe guardar candidato con educations, workExperiences y CV', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Patricia',
        lastName: 'Torres',
        email: 'patricia@example.com',
        phone: '612345678',
        address: 'Avenida Principal 456',
        educations: [
          {
            institution: 'Universidad Complutense',
            title: 'Ingeniería de Software',
            startDate: '2012-09-01',
            endDate: '2016-06-30',
          },
        ],
        workExperiences: [
          {
            company: 'Innovation Labs',
            position: 'Full Stack Developer',
            description: 'Desarrollo de aplicaciones web',
            startDate: '2016-07-01',
            endDate: '2020-12-31',
          },
        ],
        cv: {
          filePath: '/uploads/patricia-cv.pdf',
          fileType: 'application/pdf',
        },
      };

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockPrisma.candidate.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.education.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.workExperience.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.resume.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('Manejo de errores', () => {
    test('debe lanzar error específico cuando el email ya existe (P2002)', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Duplicate',
        lastName: 'User',
        email: 'duplicate@example.com',
      };

      mockPrisma.candidate.create.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow(
        'The email already exists in the database',
      );
    });

    test('no debe llamar a prisma.candidate.create si la validación falla', async () => {
      // Arrange
      const invalidData = {
        firstName: 'A',
        lastName: 'Pérez',
        email: 'invalid@example.com',
      };

      // Act & Assert
      await expect(addCandidate(invalidData)).rejects.toThrow();
      expect(mockPrisma.candidate.create).not.toHaveBeenCalled();
    });

    test('debe propagar otros errores de Prisma sin modificar', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Error',
        lastName: 'Test',
        email: 'error@example.com',
      };

      const customError = new Error('Database connection failed');
      mockPrisma.candidate.create.mockRejectedValue(customError);

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
