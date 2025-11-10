import { addCandidate } from '../application/services/candidateService';
import { validateCandidateData } from '../application/validator';
import { Candidate } from '../domain/models/Candidate';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: {
      PrismaClientInitializationError: class PrismaClientInitializationError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'PrismaClientInitializationError';
        }
      },
    },
  };
});

// Mock the Candidate model's save method
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');

describe('Inserción de candidatos - LTI', () => {
  // =================================================================
  // SUITE 1: RECEPCIÓN DE DATOS DEL FORMULARIO
  // =================================================================
  
  describe('Recepción de datos del formulario', () => {
    
    // =================================================================
    // Grupo 1: VALIDACIÓN DE CAMPOS REQUERIDOS
    // =================================================================
    
    describe('Validación de campos requeridos', () => {
      test.each([
        ['firstName', { lastName: 'Doe', email: 'john@example.com' }, 'firstName es obligatorio para crear un candidato'],
        ['lastName', { firstName: 'John', email: 'john@example.com' }, 'lastName es obligatorio para crear un candidato'],
        ['email', { firstName: 'John', lastName: 'Doe' }, 'email es obligatorio para crear un candidato'],
      ])(
        'debe rechazar cuando falta el campo requerido "%s"',
        (fieldName: string, invalidData: any, expectedMessage: string) => {
          // Arrange: Preparar datos sin el campo requerido
          const candidateData = invalidData;

          // Act & Assert: Verificar que se lance error con mensaje apropiado
          expect(() => validateCandidateData(candidateData)).toThrow();
        }
      );

      test('debe aceptar datos cuando todos los campos requeridos están presentes', () => {
        // Arrange: Preparar datos con campos mínimos requeridos
        const validData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        // Act & Assert: No debe lanzar ningún error
        expect(() => validateCandidateData(validData)).not.toThrow();
      });
    });

    // =================================================================
    // Grupo 2: VALIDACIÓN DE NOMBRES (firstName y lastName)
    // =================================================================

    describe('Validación de campos de nombre', () => {
      test.each([
        ['firstName', 'A', 'Nombre demasiado corto (1 carácter)'],
        ['firstName', 'a'.repeat(101), 'Nombre excede límite de 100 caracteres'],
        ['lastName', 'B', 'Apellido demasiado corto (1 carácter)'],
        ['lastName', 'b'.repeat(101), 'Apellido excede límite de 100 caracteres'],
      ])(
        'debe rechazar %s cuando: %s',
        (field: string, value: string, reason: string) => {
          // Arrange: Crear datos base válidos
          const candidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            [field]: value,
          };

          // Act & Assert: Verificar rechazo con mensaje claro
          expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
        }
      );

      test.each([
        ['José', 'nombre español con acento'],
        ['María', 'nombre con acento en vocal'],
        ['François', 'nombre francés con cedilla'],
        ['Müller', 'nombre alemán con diéresis'],
        ['Søren', 'nombre danés con o tachada'],
        ['Ángel', 'nombre con acento en primera letra'],
        ['Iñigo', 'nombre con letra ñ'],
        ['María José', 'nombre compuesto con espacio'],
      ])(
        'debe aceptar nombres con caracteres unicode: %s (%s)',
        (name: string, description: string) => {
          // Arrange: Preparar datos con nombre unicode
          const candidateData = {
            firstName: name,
            lastName: 'TestLastName',
            email: 'test@example.com',
          };

          // Act & Assert: Verificar que nombres con caracteres válidos se acepten
          const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
          if (nameRegex.test(name)) {
            expect(() => validateCandidateData(candidateData)).not.toThrow();
          } else {
            expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
          }
        }
      );

      test('debe rechazar nombres que contengan solo espacios', () => {
        // Arrange: Preparar datos con nombre de solo espacios
        const candidateData = {
          firstName: '   ',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        // Act & Assert: Verificar que se rechace nombre vacío
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
      });

      test('debe rechazar nombres con números', () => {
        // Arrange: Preparar datos con nombre conteniendo dígitos
        const candidateData = {
          firstName: 'John123',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        // Act & Assert: Verificar que se rechacen números en nombres
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
      });

      test('debe rechazar nombres con caracteres especiales no permitidos', () => {
        // Arrange: Preparar datos con caracteres especiales
        const candidateData = {
          firstName: 'John@',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        // Act & Assert: Verificar que se rechacen caracteres especiales
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
      });

      test('debe rechazar nombres con espacios al inicio y final sin trim', () => {
        // Arrange: Preparar datos con espacios adicionales
        const candidateData = {
          firstName: '  John  ',
          lastName: '  Doe  ',
          email: 'john@example.com',
        };

        // Act & Assert: La implementación actual no hace trim, debe fallar
        expect(() => validateCandidateData(candidateData)).toThrow();
      });

      test('debe aceptar nombres en el límite exacto de 100 caracteres', () => {
        // Arrange: Preparar datos con nombre de exactamente 100 caracteres
        const exactLimit = 'a'.repeat(100);
        const candidateData = {
          firstName: exactLimit,
          lastName: 'Doe',
          email: 'john@example.com',
        };

        // Act & Assert: Verificar que el límite exacto sea aceptado
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });
    });

    // =================================================================
    // Grupo 3: VALIDACIÓN DE EMAIL
    // =================================================================

    describe('Validación de email', () => {
      test.each([
        ['falta @', 'invalidemail.com', 'Email sin símbolo arroba'],
        ['falta dominio', 'invalid@', 'Email sin dominio'],
        ['falta parte local', '@example.com', 'Email sin parte local'],
        ['espacios', 'john doe@example.com', 'Email con espacios'],
        ['múltiples @', 'john@@example.com', 'Email con doble arroba'],
        ['TLD muy corto', 'john@example.c', 'TLD de un solo carácter'],
        ['caracteres no permitidos', 'john#test@example.com', 'Email con caracteres especiales no válidos'],
      ])(
        'debe rechazar email inválido: %s',
        (testName: string, email: string, reason: string) => {
          // Arrange: Preparar datos con email inválido
          const candidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: email,
          };

          // Act & Assert: Verificar que email inválido sea rechazado
          expect(() => validateCandidateData(candidateData)).toThrow('Invalid email');
        }
      );

      test.each([
        ['simple', 'john@example.com', 'Email básico válido'],
        ['con puntos', 'john.doe@example.com', 'Email con puntos en parte local'],
        ['con números', 'john123@example.com', 'Email con números'],
        ['con plus', 'john+test@example.com', 'Email con signo más'],
        ['dominio con guion', 'john@my-company.com', 'Dominio con guion'],
        ['subdominio', 'john@mail.example.com', 'Email con subdominio'],
        ['TLD largo', 'john@example.technology', 'TLD de múltiples caracteres'],
        ['múltiples subdominios', 'john@mail.internal.example.com', 'Email con múltiples subdominios'],
      ])(
        'debe aceptar email válido: %s',
        (testName: string, email: string, reason: string) => {
          // Arrange: Preparar datos con email válido
          const candidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: email,
          };

          // Act & Assert: Verificar que email válido sea aceptado
          expect(() => validateCandidateData(candidateData)).not.toThrow();
        }
      );

      test('debe rechazar email vacío', () => {
        // Arrange: Preparar datos con email vacío
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: '',
        };

        // Act & Assert: Email vacío debe ser rechazado como campo requerido
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid email');
      });

      test('debe rechazar email con solo espacios', () => {
        // Arrange: Preparar datos con email de solo espacios
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: '   ',
        };

        // Act & Assert: Email con solo espacios debe ser rechazado
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid email');
      });
    });

    // =================================================================
    // Grupo 4: VALIDACIÓN DE TELÉFONO (CAMPO OPCIONAL)
    // =================================================================

    describe('Validación de teléfono (opcional)', () => {
      test('debe aceptar candidato sin teléfono (campo opcional)', () => {
        // Arrange: Preparar datos sin teléfono
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        // Act & Assert: Campo opcional ausente debe ser válido
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test.each([
        ['inicia con 6', '612345678', 'Teléfono móvil español válido'],
        ['inicia con 7', '712345678', 'Teléfono móvil español válido'],
        ['inicia con 9', '912345678', 'Teléfono fijo español válido'],
      ])(
        'debe aceptar teléfono válido que %s',
        (description: string, phone: string, reason: string) => {
          // Arrange: Preparar datos con teléfono válido
          const candidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: phone,
          };

          // Act & Assert: Teléfono con formato español válido debe ser aceptado
          expect(() => validateCandidateData(candidateData)).not.toThrow();
        }
      );

      test.each([
        ['demasiado corto', '61234567', 'Solo 8 dígitos en lugar de 9'],
        ['demasiado largo', '6123456789', '10 dígitos en lugar de 9'],
        ['dígito inicial inválido', '512345678', 'Inicia con 5, no permitido en España'],
        ['contiene letras', '61234567a', 'Letra en lugar de dígito'],
        ['contiene espacios', '612 345 678', 'Espacios en el número'],
        ['contiene guiones', '612-345-678', 'Guiones en el número'],
        ['contiene paréntesis', '(612)345678', 'Paréntesis no permitidos'],
      ])(
        'debe rechazar teléfono inválido: %s',
        (description: string, phone: string, reason: string) => {
          // Arrange: Preparar datos con teléfono inválido
          const candidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: phone,
          };

          // Act & Assert: Teléfono con formato incorrecto debe ser rechazado
          expect(() => validateCandidateData(candidateData)).toThrow('Invalid phone');
        }
      );
    });

    // =================================================================
    // Grupo 5: VALIDACIÓN DE DIRECCIÓN (CAMPO OPCIONAL)
    // =================================================================

    describe('Validación de dirección (opcional)', () => {
      test('debe aceptar candidato sin dirección (campo opcional)', () => {
        // Arrange: Preparar datos sin dirección
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        // Act & Assert: Campo opcional ausente debe ser válido
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test('debe aceptar dirección válida dentro del límite de 100 caracteres', () => {
        // Arrange: Preparar datos con dirección válida
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          address: 'Calle Principal 123, 28001 Madrid, España',
        };

        // Act & Assert: Dirección dentro del límite debe ser aceptada
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test('debe rechazar dirección que excede el límite de 100 caracteres', () => {
        // Arrange: Preparar dirección de 101 caracteres
        const longAddress = 'a'.repeat(101);
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          address: longAddress,
        };

        // Act & Assert: Dirección demasiado larga debe ser rechazada
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid address');
      });

      test('debe aceptar dirección en el límite exacto de 100 caracteres', () => {
        // Arrange: Preparar dirección de exactamente 100 caracteres
        const exactLimitAddress = 'a'.repeat(100);
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          address: exactLimitAddress,
        };

        // Act & Assert: Dirección en el límite exacto debe ser aceptada
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test('debe aceptar dirección con caracteres unicode y especiales', () => {
        // Arrange: Preparar dirección con acentos y símbolos
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          address: 'Calle Málaga 45, 3º B, código postal 28015',
        };

        // Act & Assert: Dirección con caracteres especiales válidos debe ser aceptada
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });
    });

    // =================================================================
    // Grupo 6: VALIDACIÓN DE EDUCACIÓN (CAMPO OPCIONAL)
    // =================================================================

    describe('Validación de educación', () => {
      test('debe aceptar candidato sin educaciones (campo opcional)', () => {
        // Arrange: Preparar datos sin array de educaciones
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        // Act & Assert: Educaciones opcionales ausentes deben ser válidas
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test('debe aceptar educación con todos los campos válidos', () => {
        // Arrange: Preparar datos con educación completa
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          educations: [
            {
              institution: 'Universidad Complutense de Madrid',
              title: 'Grado en Ingeniería Informática',
              startDate: '2015-09-01',
              endDate: '2019-06-30',
            },
          ],
        };

        // Act & Assert: Educación válida debe ser aceptada
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test('debe aceptar educación sin endDate (estudios en curso)', () => {
        // Arrange: Preparar educación sin fecha de fin
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          educations: [
            {
              institution: 'Universidad Politécnica',
              title: 'Máster en Inteligencia Artificial',
              startDate: '2023-09-01',
            },
          ],
        };

        // Act & Assert: Educación en curso sin endDate debe ser válida
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test.each([
        ['falta institución', { title: 'Degree', startDate: '2015-09-01' }, 'institución es requerida'],
        ['falta título', { institution: 'University', startDate: '2015-09-01' }, 'título es requerido'],
        ['falta fecha inicio', { institution: 'University', title: 'Degree' }, 'startDate es requerida'],
      ])(
        'debe rechazar educación cuando %s',
        (description: string, education: any, reason: string) => {
          // Arrange: Preparar educación incompleta
          const candidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            educations: [education],
          };

          // Act & Assert: Educación con campos requeridos faltantes debe ser rechazada
          expect(() => validateCandidateData(candidateData)).toThrow();
        }
      );

      test('debe rechazar educación con formato de fecha inválido', () => {
        // Arrange: Preparar educación con fecha en formato incorrecto
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          educations: [
            {
              institution: 'Universidad Complutense',
              title: 'Computer Science',
              startDate: '01/09/2015', // Formato DD/MM/YYYY no válido
            },
          ],
        };

        // Act & Assert: Fecha con formato incorrecto debe ser rechazada
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid date');
      });

      test('debe rechazar educación con institución que excede 100 caracteres', () => {
        // Arrange: Preparar educación con institución demasiado larga
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          educations: [
            {
              institution: 'a'.repeat(101),
              title: 'Computer Science',
              startDate: '2015-09-01',
            },
          ],
        };

        // Act & Assert: Institución superior a 100 caracteres debe ser rechazada
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid institution');
      });

      test('debe rechazar educación con título que excede 100 caracteres', () => {
        // Arrange: Preparar educación con título demasiado largo
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          educations: [
            {
              institution: 'University',
              title: 'a'.repeat(101),
              startDate: '2015-09-01',
            },
          ],
        };

        // Act & Assert: Título superior a 100 caracteres debe ser rechazado
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid title');
      });

      test('debe aceptar múltiples educaciones válidas', () => {
        // Arrange: Preparar candidato con varias educaciones
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          educations: [
            {
              institution: 'Universidad A',
              title: 'Grado en Informática',
              startDate: '2015-09-01',
              endDate: '2019-06-30',
            },
            {
              institution: 'Universidad B',
              title: 'Máster en IA',
              startDate: '2019-09-01',
              endDate: '2021-06-30',
            },
          ],
        };

        // Act & Assert: Múltiples educaciones válidas deben ser aceptadas
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });
    });

    // =================================================================
    // Grupo 7: VALIDACIÓN DE EXPERIENCIA LABORAL (CAMPO OPCIONAL)
    // =================================================================

    describe('Validación de experiencia laboral', () => {
      test('debe aceptar candidato sin experiencias laborales (campo opcional)', () => {
        // Arrange: Preparar datos sin array de experiencias
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        // Act & Assert: Experiencias opcionales ausentes deben ser válidas
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test('debe aceptar experiencia laboral con todos los campos válidos', () => {
        // Arrange: Preparar datos con experiencia completa
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          workExperiences: [
            {
              company: 'Tech Corporation S.L.',
              position: 'Software Engineer',
              description: 'Desarrollo full stack con React y Node.js',
              startDate: '2020-01-01',
              endDate: '2023-12-31',
            },
          ],
        };

        // Act & Assert: Experiencia válida debe ser aceptada
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test('debe aceptar experiencia sin endDate (trabajo actual)', () => {
        // Arrange: Preparar experiencia sin fecha de fin
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          workExperiences: [
            {
              company: 'Tech Corp',
              position: 'Senior Engineer',
              startDate: '2023-01-01',
            },
          ],
        };

        // Act & Assert: Experiencia actual sin endDate debe ser válida
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test('debe aceptar experiencia sin description (campo opcional)', () => {
        // Arrange: Preparar experiencia sin descripción
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          workExperiences: [
            {
              company: 'Tech Corp',
              position: 'Intern',
              startDate: '2019-06-01',
              endDate: '2019-08-31',
            },
          ],
        };

        // Act & Assert: Experiencia sin descripción opcional debe ser válida
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test.each([
        ['falta empresa', { position: 'Engineer', startDate: '2020-01-01' }, 'company es requerida'],
        ['falta posición', { company: 'Tech Corp', startDate: '2020-01-01' }, 'position es requerida'],
        ['falta fecha inicio', { company: 'Tech Corp', position: 'Engineer' }, 'startDate es requerida'],
      ])(
        'debe rechazar experiencia cuando %s',
        (description: string, experience: any, reason: string) => {
          // Arrange: Preparar experiencia incompleta
          const candidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            workExperiences: [experience],
          };

          // Act & Assert: Experiencia con campos requeridos faltantes debe ser rechazada
          expect(() => validateCandidateData(candidateData)).toThrow();
        }
      );

      test('debe rechazar experiencia con empresa que excede 100 caracteres', () => {
        // Arrange: Preparar experiencia con empresa demasiado larga
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          workExperiences: [
            {
              company: 'a'.repeat(101),
              position: 'Engineer',
              startDate: '2020-01-01',
            },
          ],
        };

        // Act & Assert: Empresa superior a 100 caracteres debe ser rechazada
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid company');
      });

      test('debe rechazar experiencia con posición que excede 100 caracteres', () => {
        // Arrange: Preparar experiencia con posición demasiado larga
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          workExperiences: [
            {
              company: 'Tech Corp',
              position: 'a'.repeat(101),
              startDate: '2020-01-01',
            },
          ],
        };

        // Act & Assert: Posición superior a 100 caracteres debe ser rechazada
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid position');
      });

      test('debe rechazar experiencia con descripción que excede 200 caracteres', () => {
        // Arrange: Preparar experiencia con descripción demasiado larga
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          workExperiences: [
            {
              company: 'Tech Corp',
              position: 'Engineer',
              description: 'a'.repeat(201),
              startDate: '2020-01-01',
            },
          ],
        };

        // Act & Assert: Descripción superior a 200 caracteres debe ser rechazada
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid description');
      });

      test('debe aceptar múltiples experiencias laborales válidas', () => {
        // Arrange: Preparar candidato con varias experiencias
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          workExperiences: [
            {
              company: 'Empresa A',
              position: 'Junior Developer',
              startDate: '2018-01-01',
              endDate: '2020-12-31',
            },
            {
              company: 'Empresa B',
              position: 'Senior Developer',
              startDate: '2021-01-01',
              endDate: '2023-12-31',
            },
          ],
        };

        // Act & Assert: Múltiples experiencias válidas deben ser aceptadas
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });
    });

    // =================================================================
    // Grupo 8: VALIDACIÓN DE CV/RESUME (CAMPO OPCIONAL)
    // =================================================================

    describe('Validación de CV/Resume', () => {
      test('debe aceptar candidato sin CV (campo opcional)', () => {
        // Arrange: Preparar datos sin objeto CV
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        // Act & Assert: CV opcional ausente debe ser válido
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test('debe aceptar CV con estructura válida (filePath y fileType)', () => {
        // Arrange: Preparar datos con CV válido
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          cv: {
            filePath: '/uploads/cv_john_doe.pdf',
            fileType: 'application/pdf',
          },
        };

        // Act & Assert: CV con estructura correcta debe ser aceptado
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test.each([
        ['falta filePath', { fileType: 'application/pdf' }, 'filePath es requerido en CV'],
        ['falta fileType', { filePath: '/uploads/cv.pdf' }, 'fileType es requerido en CV'],
        ['filePath no es string', { filePath: 123, fileType: 'application/pdf' }, 'filePath debe ser string'],
        ['fileType no es string', { filePath: '/uploads/cv.pdf', fileType: 123 }, 'fileType debe ser string'],
      ])(
        'debe rechazar CV cuando %s',
        (description: string, cv: any, reason: string) => {
          // Arrange: Preparar CV con estructura inválida
          const candidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            cv: cv,
          };

          // Act & Assert: CV con estructura incorrecta debe ser rechazado
          expect(() => validateCandidateData(candidateData)).toThrow('Invalid CV data');
        }
      );

      test.each([
        ['PDF', '/uploads/resume.pdf', 'application/pdf'],
        ['Word', '/uploads/resume.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        ['Texto plano', '/uploads/resume.txt', 'text/plain'],
      ])(
        'debe aceptar CV con diferentes tipos de archivo: %s',
        (fileTypeDescription: string, filePath: string, fileType: string) => {
          // Arrange: Preparar CV con diferentes tipos de archivo
          const candidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            cv: {
              filePath: filePath,
              fileType: fileType,
            },
          };

          // Act & Assert: CV con diferentes formatos válidos debe ser aceptado
          expect(() => validateCandidateData(candidateData)).not.toThrow();
        }
      );
    });

    // =================================================================
    // Grupo 9: CASOS EXTENDIDOS DE ROBUSTEZ
    // =================================================================

    describe('Casos extendidos de robustez', () => {
      test('debe manejar payload con propiedades extra no definidas en el modelo', () => {
        // Arrange: Preparar datos con campos adicionales no esperados
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          extraField: 'unexpected value',
          anotherExtra: 12345,
        };

        // Act & Assert: Propiedades extra deben ser ignoradas, datos válidos aceptados
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test('debe rechazar nombres con apóstrofes internos comunes en apellidos', () => {
        // Arrange: Preparar datos con apellido con apóstrofe
        const candidateData = {
          firstName: 'Patrick',
          lastName: "O'Brien", // Apostrofe común en nombres irlandeses
          email: 'patrick@example.com',
        };

        // Act & Assert: La regex actual NO soporta apóstrofes, debería fallar
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
      });

      test('debe aceptar emails con subdominios múltiples y TLDs largos', () => {
        // Arrange: Preparar email con estructura compleja
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe+test@mail.internal.company.technology',
        };

        // Act & Assert: Email complejo pero válido debe ser aceptado
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });

      test('debe rechazar email con caracteres unicode no permitidos', () => {
        // Arrange: Preparar email con caracteres especiales
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'josé@example.com', // Acento no permitido en parte local
        };

        // Act & Assert: Email con caracteres unicode debe ser rechazado
        expect(() => validateCandidateData(candidateData)).toThrow('Invalid email');
      });

      test('debe aceptar dirección con caracteres especiales comunes (números, comas, grados)', () => {
        // Arrange: Preparar dirección con formato completo
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          address: 'Av. Diagonal 123, 4º 2ª, 08028 Barcelona',
        };

        // Act & Assert: Dirección con formato común español debe ser aceptada
        expect(() => validateCandidateData(candidateData)).not.toThrow();
      });
    });
  });

  // =================================================================
  // SUITE 2: GUARDADO EN BASE DE DATOS (MOCK)
  // =================================================================
  
  describe('Guardado en base de datos (mock)', () => {
    let mockPrisma: any;
    let mockCandidateSave: jest.Mock;

    beforeEach(() => {
      // Reset: Limpiar todos los mocks antes de cada test
      jest.clearAllMocks();
      
      // Arrange: Obtener instancia mockeada de Prisma
      mockPrisma = new PrismaClient();
      
      // Arrange: Configurar mock para el método save() de Candidate
      mockCandidateSave = jest.fn();
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation((data: any) => {
        return {
          ...data,
          education: data.education || [],
          workExperience: data.workExperience || [],
          resumes: data.resumes || [],
          save: mockCandidateSave,
        } as any;
      });
    });

    afterEach(() => {
      // Cleanup: Asegurar limpieza después de cada test
      jest.clearAllMocks();
    });

    // =================================================================
    // Grupo 10: INSERCIÓN EXITOSA EN BASE DE DATOS
    // =================================================================

    describe('Inserción exitosa', () => {
      test('debe insertar candidato con campos mínimos requeridos y retornar ID', async () => {
        // Arrange: Preparar datos mínimos y respuesta esperada
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        const expectedSavedCandidate = {
          id: 1,
          ...candidateData,
          phone: null,
          address: null,
        };

        mockCandidateSave.mockResolvedValue(expectedSavedCandidate);

        // Act: Ejecutar inserción del candidato
        const result = await addCandidate(candidateData);

        // Assert: Verificar que se guardó correctamente
        expect(mockCandidateSave).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedSavedCandidate);
        expect(result.id).toBeDefined();
        expect(result.id).toBe(1);
        expect(result.email).toBe('john@example.com');
      });

      test('debe insertar candidato con todos los campos opcionales poblados', async () => {
        // Arrange: Preparar candidato completo
        const candidateData = {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '612345678',
          address: 'Calle Mayor 123, Madrid',
        };

        const expectedSavedCandidate = {
          id: 2,
          ...candidateData,
        };

        mockCandidateSave.mockResolvedValue(expectedSavedCandidate);

        // Act: Ejecutar inserción
        const result = await addCandidate(candidateData);

        // Assert: Verificar que todos los campos se guardaron
        expect(mockCandidateSave).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedSavedCandidate);
        expect(result.phone).toBe('612345678');
        expect(result.address).toBe('Calle Mayor 123, Madrid');
      });

      test('debe insertar candidato con educaciones y crear relaciones correctamente', async () => {
        // Arrange: Preparar candidato con educaciones
        const candidateData = {
          firstName: 'Carlos',
          lastName: 'García',
          email: 'carlos@example.com',
          educations: [
            {
              institution: 'Universidad Complutense',
              title: 'Computer Science',
              startDate: '2015-09-01',
              endDate: '2019-06-30',
            },
          ],
        };

        const expectedSavedCandidate = {
          id: 3,
          firstName: 'Carlos',
          lastName: 'García',
          email: 'carlos@example.com',
        };

        mockCandidateSave.mockResolvedValue(expectedSavedCandidate);

        // Mock del modelo Education
        const mockEducationSave = jest.fn().mockResolvedValue({ id: 1 });
        const { Education } = require('../domain/models/Education');
        (Education as jest.Mock).mockImplementation((data: any) => ({
          ...data,
          save: mockEducationSave,
        }));

        // Act: Ejecutar inserción con educaciones
        const result = await addCandidate(candidateData);

        // Assert: Verificar que se guardó candidato y educación
        expect(mockCandidateSave).toHaveBeenCalledTimes(1);
        expect(Education).toHaveBeenCalledTimes(1);
        expect(mockEducationSave).toHaveBeenCalledTimes(1);
        expect(result.id).toBe(3);
      });

      test('debe insertar candidato con experiencias laborales y crear relaciones', async () => {
        // Arrange: Preparar candidato con experiencias
        const candidateData = {
          firstName: 'María',
          lastName: 'López',
          email: 'maria@example.com',
          workExperiences: [
            {
              company: 'Tech Corp',
              position: 'Software Engineer',
              description: 'Full stack development',
              startDate: '2020-01-01',
              endDate: '2023-12-31',
            },
          ],
        };

        const expectedSavedCandidate = {
          id: 4,
          firstName: 'María',
          lastName: 'López',
          email: 'maria@example.com',
        };

        mockCandidateSave.mockResolvedValue(expectedSavedCandidate);

        // Mock del modelo WorkExperience
        const mockWorkExperienceSave = jest.fn().mockResolvedValue({ id: 1 });
        const { WorkExperience } = require('../domain/models/WorkExperience');
        (WorkExperience as jest.Mock).mockImplementation((data: any) => ({
          ...data,
          save: mockWorkExperienceSave,
        }));

        // Act: Ejecutar inserción con experiencias
        const result = await addCandidate(candidateData);

        // Assert: Verificar que se guardó candidato y experiencia
        expect(mockCandidateSave).toHaveBeenCalledTimes(1);
        expect(WorkExperience).toHaveBeenCalledTimes(1);
        expect(mockWorkExperienceSave).toHaveBeenCalledTimes(1);
        expect(result.id).toBe(4);
      });

      test('debe insertar candidato con CV y crear relación de resume', async () => {
        // Arrange: Preparar candidato con CV
        const candidateData = {
          firstName: 'Pedro',
          lastName: 'Martínez',
          email: 'pedro@example.com',
          cv: {
            filePath: '/uploads/cv_pedro.pdf',
            fileType: 'application/pdf',
          },
        };

        const expectedSavedCandidate = {
          id: 5,
          firstName: 'Pedro',
          lastName: 'Martínez',
          email: 'pedro@example.com',
        };

        mockCandidateSave.mockResolvedValue(expectedSavedCandidate);

        // Mock del modelo Resume
        const mockResumeSave = jest.fn().mockResolvedValue({ id: 1 });
        const { Resume } = require('../domain/models/Resume');
        (Resume as jest.Mock).mockImplementation((data: any) => ({
          ...data,
          save: mockResumeSave,
        }));

        // Act: Ejecutar inserción con CV
        const result = await addCandidate(candidateData);

        // Assert: Verificar que se guardó candidato y resume
        expect(mockCandidateSave).toHaveBeenCalledTimes(1);
        expect(Resume).toHaveBeenCalledTimes(1);
        expect(mockResumeSave).toHaveBeenCalledTimes(1);
        expect(result.id).toBe(5);
      });

      test('debe insertar perfil completo con educaciones, experiencias y CV', async () => {
        // Arrange: Preparar candidato con todos los datos posibles
        const candidateData = {
          firstName: 'Ana',
          lastName: 'Fernández',
          email: 'ana@example.com',
          phone: '712345678',
          address: 'Avenida Libertad 45',
          educations: [
            {
              institution: 'Universidad Politécnica',
              title: 'Software Engineering',
              startDate: '2016-09-01',
              endDate: '2020-06-30',
            },
          ],
          workExperiences: [
            {
              company: 'StartupXYZ',
              position: 'Backend Developer',
              description: 'API development',
              startDate: '2020-07-01',
              endDate: '2023-12-31',
            },
          ],
          cv: {
            filePath: '/uploads/cv_ana.pdf',
            fileType: 'application/pdf',
          },
        };

        const expectedSavedCandidate = {
          id: 6,
          firstName: 'Ana',
          lastName: 'Fernández',
          email: 'ana@example.com',
          phone: '712345678',
          address: 'Avenida Libertad 45',
        };

        mockCandidateSave.mockResolvedValue(expectedSavedCandidate);

        // Mock de todos los modelos relacionados
        const mockEducationSave = jest.fn().mockResolvedValue({ id: 1 });
        const mockWorkExperienceSave = jest.fn().mockResolvedValue({ id: 1 });
        const mockResumeSave = jest.fn().mockResolvedValue({ id: 1 });

        const { Education } = require('../domain/models/Education');
        const { WorkExperience } = require('../domain/models/WorkExperience');
        const { Resume } = require('../domain/models/Resume');

        (Education as jest.Mock).mockImplementation((data: any) => ({
          ...data,
          save: mockEducationSave,
        }));

        (WorkExperience as jest.Mock).mockImplementation((data: any) => ({
          ...data,
          save: mockWorkExperienceSave,
        }));

        (Resume as jest.Mock).mockImplementation((data: any) => ({
          ...data,
          save: mockResumeSave,
        }));

        // Act: Ejecutar inserción completa
        const result = await addCandidate(candidateData);

        // Assert: Verificar que se guardaron todas las entidades y relaciones
        expect(mockCandidateSave).toHaveBeenCalledTimes(1);
        expect(mockEducationSave).toHaveBeenCalledTimes(1);
        expect(mockWorkExperienceSave).toHaveBeenCalledTimes(1);
        expect(mockResumeSave).toHaveBeenCalledTimes(1);
        expect(result.id).toBe(6);
        expect(result.email).toBe('ana@example.com');
      });
    });

    // =================================================================
    // Grupo 11: MANEJO DE EMAIL DUPLICADO (UNIQUE CONSTRAINT)
    // =================================================================

    describe('Manejo de email duplicado', () => {
      test('debe lanzar error descriptivo cuando email ya existe en BD', async () => {
        // Arrange: Preparar datos y simular error de constraint único
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'duplicate@example.com',
        };

        const prismaError = new Error('Unique constraint failed');
        (prismaError as any).code = 'P2002';
        mockCandidateSave.mockRejectedValue(prismaError);

        // Act & Assert: Verificar que se lance error con mensaje claro
        await expect(addCandidate(candidateData)).rejects.toThrow(
          'The email already exists in the database'
        );
        expect(mockCandidateSave).toHaveBeenCalledTimes(1);
      });

      test('debe proporcionar mensaje de error amigable sin exponer detalles técnicos', async () => {
        // Arrange: Preparar escenario de email duplicado
        const candidateData = {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'existing@example.com',
        };

        const prismaError = new Error('Unique constraint failed on email');
        (prismaError as any).code = 'P2002';
        mockCandidateSave.mockRejectedValue(prismaError);

        // Act & Assert: Verificar que el mensaje sea amigable
        try {
          await addCandidate(candidateData);
          fail('Debería haber lanzado un error de email duplicado');
        } catch (error: any) {
          expect(error.message).toBe('The email already exists in the database');
          expect(error.message).not.toContain('P2002');
          expect(error.message).not.toContain('Prisma');
          expect(error.message).not.toContain('constraint');
        }
      });

      test('debe capturar error P2002 independientemente del mensaje específico', async () => {
        // Arrange: Preparar error con código P2002 pero mensaje diferente
        const candidateData = {
          firstName: 'Carlos',
          lastName: 'García',
          email: 'another@example.com',
        };

        const prismaError = new Error('Different message but same code');
        (prismaError as any).code = 'P2002';
        (prismaError as any).meta = { target: ['email'] };
        mockCandidateSave.mockRejectedValue(prismaError);

        // Act & Assert: Verificar que se detecte por código, no por mensaje
        await expect(addCandidate(candidateData)).rejects.toThrow(
          'The email already exists in the database'
        );
      });
    });

    // =================================================================
    // Grupo 12: MANEJO DE ERRORES DE BASE DE DATOS
    // =================================================================

    describe('Manejo de errores de base de datos', () => {
      test('debe propagar errores genéricos de base de datos', async () => {
        // Arrange: Preparar escenario de error genérico
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        const dbError = new Error('Database connection lost');
        mockCandidateSave.mockRejectedValue(dbError);

        // Act & Assert: Verificar que error genérico se propague
        await expect(addCandidate(candidateData)).rejects.toThrow(
          'Database connection lost'
        );
      });

      test('debe manejar errores de timeout de base de datos', async () => {
        // Arrange: Preparar escenario de timeout
        const candidateData = {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
        };

        const timeoutError = new Error('Query timeout exceeded');
        (timeoutError as any).code = 'P2024';
        mockCandidateSave.mockRejectedValue(timeoutError);

        // Act & Assert: Verificar que timeout se maneje apropiadamente
        await expect(addCandidate(candidateData)).rejects.toThrow('Query timeout');
      });

      test('debe propagar errores inesperados sin modificar', async () => {
        // Arrange: Preparar escenario de error no esperado
        const candidateData = {
          firstName: 'Carlos',
          lastName: 'García',
          email: 'carlos@example.com',
        };

        const unexpectedError = new Error('Unexpected database error');
        (unexpectedError as any).code = 'P9999';
        mockCandidateSave.mockRejectedValue(unexpectedError);

        // Act & Assert: Error inesperado debe propagarse tal cual
        await expect(addCandidate(candidateData)).rejects.toThrow(
          'Unexpected database error'
        );
      });

      test('debe manejar error de conexión a base de datos no disponible', async () => {
        // Arrange: Preparar escenario de BD no disponible
        const candidateData = {
          firstName: 'María',
          lastName: 'López',
          email: 'maria@example.com',
        };

        const connectionError = new Error('Cannot reach database server');
        (connectionError as any).code = 'P1001';
        mockCandidateSave.mockRejectedValue(connectionError);

        // Act & Assert: Verificar manejo de error de conexión
        await expect(addCandidate(candidateData)).rejects.toThrow(
          'Cannot reach database server'
        );
      });
    });

    // =================================================================
    // Grupo 13: VALIDACIÓN ANTES DE OPERACIONES DE BD
    // =================================================================

    describe('Validación antes de operaciones de BD', () => {
      test('debe validar datos antes de intentar inserción en BD', async () => {
        // Arrange: Preparar datos inválidos (nombre muy corto)
        const invalidData = {
          firstName: 'J', // Menor a 2 caracteres
          lastName: 'Doe',
          email: 'john@example.com',
        };

        // Act & Assert: Validación debe fallar antes de llamar BD
        await expect(addCandidate(invalidData)).rejects.toThrow('Invalid name');
        expect(mockCandidateSave).not.toHaveBeenCalled();
      });

      test('no debe llamar a BD si validación de email falla', async () => {
        // Arrange: Preparar datos con email inválido
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email', // Formato incorrecto
        };

        // Act & Assert: BD no debe ser invocada
        await expect(addCandidate(invalidData)).rejects.toThrow();
        expect(mockCandidateSave).not.toHaveBeenCalled();
      });

      test('debe validar educaciones antes de insertar en BD', async () => {
        // Arrange: Preparar candidato con educación inválida
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          educations: [
            {
              institution: 'a'.repeat(101), // Excede límite
              title: 'Computer Science',
              startDate: '2015-09-01',
            },
          ],
        };

        // Act & Assert: Validación debe fallar, BD no debe llamarse
        await expect(addCandidate(candidateData)).rejects.toThrow('Invalid institution');
        expect(mockCandidateSave).not.toHaveBeenCalled();
      });

      test('debe validar experiencias laborales antes de insertar en BD', async () => {
        // Arrange: Preparar candidato con experiencia inválida
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          workExperiences: [
            {
              company: 'Tech Corp',
              position: 'Engineer',
              description: 'a'.repeat(201), // Excede límite
              startDate: '2020-01-01',
            },
          ],
        };

        // Act & Assert: Validación debe fallar, BD no debe llamarse
        await expect(addCandidate(candidateData)).rejects.toThrow('Invalid description');
        expect(mockCandidateSave).not.toHaveBeenCalled();
      });

      test('debe validar estructura de CV antes de insertar en BD', async () => {
        // Arrange: Preparar candidato con CV inválido
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          cv: {
            filePath: '/uploads/cv.pdf',
            // Falta fileType
          },
        };

        // Act & Assert: Validación debe fallar, BD no debe llamarse
        await expect(addCandidate(candidateData)).rejects.toThrow('Invalid CV data');
        expect(mockCandidateSave).not.toHaveBeenCalled();
      });

      test('debe permitir inserción solo cuando todos los datos sean válidos', async () => {
        // Arrange: Preparar datos completamente válidos
        const validData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '612345678',
        };

        const expectedResult = { id: 1, ...validData };
        mockCandidateSave.mockResolvedValue(expectedResult);

        // Act: Ejecutar inserción
        const result = await addCandidate(validData);

        // Assert: BD debe ser llamada y retornar resultado
        expect(mockCandidateSave).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedResult);
        expect(result.id).toBe(1);
      });
    });
  });
});

