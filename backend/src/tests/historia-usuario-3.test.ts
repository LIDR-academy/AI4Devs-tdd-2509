/**
 * Historia de Usuario 3: Registro de Experiencia Laboral del Candidato
 * 
 * Criterios cubiertos: CA-3.1 a CA-3.10
 * 
 * Módulos testeados:
 * - src/application/validator.ts (validateExperience, validateCandidateData)
 * - src/application/services/candidateService.ts (addCandidate con workExperiences)
 * - src/domain/models/WorkExperience.ts (save)
 */

import { validateCandidateData } from '../application/validator';

// Mock de PrismaClient ANTES de importar módulos que lo usan
const mockCandidateCreate = jest.fn();
const mockWorkExperienceCreate = jest.fn();
const mockWorkExperienceUpdate = jest.fn();

jest.mock('@prisma/client', () => {
  const actualPrisma = jest.requireActual('@prisma/client');
  return {
    ...actualPrisma,
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        candidate: {
          create: mockCandidateCreate,
        },
        workExperience: {
          create: mockWorkExperienceCreate,
          update: mockWorkExperienceUpdate,
        },
      };
    }),
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

import { addCandidate } from '../application/services/candidateService';

describe('Historia de Usuario 3: Registro de Experiencia Laboral del Candidato', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CA-3.1: Registro de candidato con una experiencia laboral
  describe('CA-3.1: Registro de candidato con una experiencia laboral', () => {
    
    it('debe crear candidato con un registro de experiencia asociado', async () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Solutions SA',
            position: 'Software Developer',
            description: 'Desarrollo de aplicaciones web con React y Node.js',
            startDate: '2020-01-15',
            endDate: '2023-06-30'
          }
        ]
      };

      const mockCandidate = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: null,
        address: null
      };

      const mockExperience = {
        id: 1,
        company: 'Tech Solutions SA',
        position: 'Software Developer',
        description: 'Desarrollo de aplicaciones web con React y Node.js',
        startDate: new Date('2020-01-15'),
        endDate: new Date('2023-06-30'),
        candidateId: 1
      };

      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockWorkExperienceCreate.mockResolvedValue(mockExperience);

      // Act
      const result = await addCandidate(inputData);

      // Assert
      expect(result).toEqual(mockCandidate);
      expect(mockCandidateCreate).toHaveBeenCalledTimes(1);
      expect(mockWorkExperienceCreate).toHaveBeenCalledTimes(1);
      expect(mockWorkExperienceCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          company: 'Tech Solutions SA',
          position: 'Software Developer',
          candidateId: 1
        })
      });
    });

    it('debe vincular la experiencia al candidato mediante candidateId', async () => {
      // Arrange
      const inputData = {
        firstName: 'María',
        lastName: 'García',
        email: 'maria@example.com',
        workExperiences: [
          {
            company: 'Consulting Group',
            position: 'Business Analyst',
            startDate: '2019-03-01'
          }
        ]
      };

      const mockCandidate = { id: 5, firstName: 'María', lastName: 'García', email: 'maria@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockWorkExperienceCreate.mockResolvedValue({ id: 2, candidateId: 5 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockWorkExperienceCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          candidateId: 5
        })
      });
    });
  });

  // CA-3.2: Registro de candidato con múltiples experiencias laborales
  describe('CA-3.2: Registro de candidato con múltiples experiencias laborales', () => {
    
    it('debe crear candidato con múltiples registros de experiencia', async () => {
      // Arrange
      const inputData = {
        firstName: 'Carlos',
        lastName: 'Ruiz',
        email: 'carlos@example.com',
        workExperiences: [
          {
            company: 'StartUp Inc',
            position: 'Junior Developer',
            startDate: '2018-06-01',
            endDate: '2020-05-31'
          },
          {
            company: 'Tech Corp',
            position: 'Senior Developer',
            description: 'Liderazgo de equipo de desarrollo',
            startDate: '2020-06-01',
            endDate: '2023-12-31'
          },
          {
            company: 'Innovation Labs',
            position: 'Tech Lead',
            startDate: '2024-01-01'
          }
        ]
      };

      const mockCandidate = { id: 10, firstName: 'Carlos', lastName: 'Ruiz', email: 'carlos@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockWorkExperienceCreate.mockResolvedValue({ id: 1 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockWorkExperienceCreate).toHaveBeenCalledTimes(3);
      expect(mockWorkExperienceCreate).toHaveBeenNthCalledWith(1, {
        data: expect.objectContaining({
          company: 'StartUp Inc',
          position: 'Junior Developer',
          candidateId: 10
        })
      });
      expect(mockWorkExperienceCreate).toHaveBeenNthCalledWith(2, {
        data: expect.objectContaining({
          company: 'Tech Corp',
          position: 'Senior Developer',
          candidateId: 10
        })
      });
      expect(mockWorkExperienceCreate).toHaveBeenNthCalledWith(3, {
        data: expect.objectContaining({
          company: 'Innovation Labs',
          position: 'Tech Lead',
          candidateId: 10
        })
      });
    });

    it('debe permitir array vacío de workExperiences', async () => {
      // Arrange
      const inputData = {
        firstName: 'Ana',
        lastName: 'López',
        email: 'ana@example.com',
        workExperiences: []
      };

      const mockCandidate = { id: 11, firstName: 'Ana', lastName: 'López', email: 'ana@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockCandidateCreate).toHaveBeenCalledTimes(1);
      expect(mockWorkExperienceCreate).not.toHaveBeenCalled();
    });

    it('debe permitir workExperiences como undefined', async () => {
      // Arrange
      const inputData = {
        firstName: 'Pedro',
        lastName: 'Martínez',
        email: 'pedro@example.com'
        // workExperiences: undefined (omitido)
      };

      const mockCandidate = { id: 12, firstName: 'Pedro', lastName: 'Martínez', email: 'pedro@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockCandidateCreate).toHaveBeenCalledTimes(1);
      expect(mockWorkExperienceCreate).not.toHaveBeenCalled();
    });
  });

  // CA-3.3: Registro de experiencia con descripción
  describe('CA-3.3: Registro de experiencia con descripción', () => {
    
    it('debe almacenar correctamente description cuando se proporciona', async () => {
      // Arrange
      const inputData = {
        firstName: 'Laura',
        lastName: 'Sánchez',
        email: 'laura@example.com',
        workExperiences: [
          {
            company: 'Marketing Agency',
            position: 'Digital Marketing Manager',
            description: 'Gestión de campañas digitales y estrategias de marketing online',
            startDate: '2021-01-15',
            endDate: '2024-03-30'
          }
        ]
      };

      const mockCandidate = { id: 20, firstName: 'Laura', lastName: 'Sánchez', email: 'laura@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockWorkExperienceCreate.mockResolvedValue({ id: 1 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockWorkExperienceCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          description: 'Gestión de campañas digitales y estrategias de marketing online'
        })
      });
    });
  });

  // CA-3.4: Registro de experiencia sin descripción
  describe('CA-3.4: Registro de experiencia sin descripción', () => {
    
    it('debe almacenar experiencia con description como undefined cuando se omite', async () => {
      // Arrange
      const inputData = {
        firstName: 'Diego',
        lastName: 'Fernández',
        email: 'diego@example.com',
        workExperiences: [
          {
            company: 'Retail Company',
            position: 'Store Manager',
            startDate: '2020-05-01'
            // description omitido
          }
        ]
      };

      const mockCandidate = { id: 30, firstName: 'Diego', lastName: 'Fernández', email: 'diego@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockWorkExperienceCreate.mockResolvedValue({ id: 1 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockWorkExperienceCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          company: 'Retail Company',
          position: 'Store Manager'
        })
      });
    });

    it('debe aceptar description como null explícitamente', async () => {
      // Arrange
      const inputData = {
        firstName: 'Sofia',
        lastName: 'Torres',
        email: 'sofia@example.com',
        workExperiences: [
          {
            company: 'Finance Corp',
            position: 'Financial Analyst',
            description: null,
            startDate: '2022-01-10'
          }
        ]
      };

      const mockCandidate = { id: 31, firstName: 'Sofia', lastName: 'Torres', email: 'sofia@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockWorkExperienceCreate.mockResolvedValue({ id: 1 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockWorkExperienceCreate).toHaveBeenCalled();
    });
  });

  // CA-3.5: Registro de experiencia con fecha de finalización
  describe('CA-3.5: Registro de experiencia con fecha de finalización', () => {
    
    it('debe almacenar correctamente startDate y endDate', async () => {
      // Arrange
      const inputData = {
        firstName: 'Alberto',
        lastName: 'Navarro',
        email: 'alberto@example.com',
        workExperiences: [
          {
            company: 'Construction Ltd',
            position: 'Project Manager',
            startDate: '2017-03-01',
            endDate: '2021-12-31'
          }
        ]
      };

      const mockCandidate = { id: 40, firstName: 'Alberto', lastName: 'Navarro', email: 'alberto@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockWorkExperienceCreate.mockResolvedValue({ id: 1 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockWorkExperienceCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          startDate: expect.any(Date),
          endDate: expect.any(Date)
        })
      });
    });
  });

  // CA-3.6: Registro de experiencia actual (sin fecha de finalización)
  describe('CA-3.6: Registro de experiencia actual (sin fecha de finalización)', () => {
    
    it('debe almacenar experiencia con endDate como undefined cuando se omite', async () => {
      // Arrange
      const inputData = {
        firstName: 'Elena',
        lastName: 'Vega',
        email: 'elena@example.com',
        workExperiences: [
          {
            company: 'Healthcare Solutions',
            position: 'Medical Director',
            description: 'Supervisión del departamento médico',
            startDate: '2023-01-15'
            // endDate omitido - trabajo actual
          }
        ]
      };

      const mockCandidate = { id: 50, firstName: 'Elena', lastName: 'Vega', email: 'elena@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockWorkExperienceCreate.mockResolvedValue({ id: 1 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockWorkExperienceCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          startDate: expect.any(Date),
          endDate: undefined
        })
      });
    });

    it('debe aceptar endDate como null explícitamente para trabajo actual', async () => {
      // Arrange
      const inputData = {
        firstName: 'Roberto',
        lastName: 'Campos',
        email: 'roberto@example.com',
        workExperiences: [
          {
            company: 'Legal Associates',
            position: 'Senior Attorney',
            startDate: '2022-09-01',
            endDate: null
          }
        ]
      };

      const mockCandidate = { id: 51, firstName: 'Roberto', lastName: 'Campos', email: 'roberto@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockWorkExperienceCreate.mockResolvedValue({ id: 1 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockWorkExperienceCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          startDate: expect.any(Date),
          endDate: undefined
        })
      });
    });
  });

  // CA-3.7: Validación de empresa
  describe('CA-3.7: Validación de empresa', () => {
    
    it('debe rechazar experiencia sin company', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            // company omitido
            position: 'Developer',
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid company');
    });

    it('debe rechazar company vacío', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: '',
            position: 'Developer',
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid company');
    });

    it('debe rechazar company con más de 100 caracteres', () => {
      // Arrange
      const longCompany = 'A'.repeat(101);
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: longCompany,
            position: 'Developer',
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid company');
    });

    it('debe aceptar company con exactamente 100 caracteres', () => {
      // Arrange
      const exactCompany = 'A'.repeat(100);
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: exactCompany,
            position: 'Developer',
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });
  });

  // CA-3.8: Validación de posición
  describe('CA-3.8: Validación de posición', () => {
    
    it('debe rechazar experiencia sin position', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            // position omitido
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid position');
    });

    it('debe rechazar position vacío', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: '',
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid position');
    });

    it('debe rechazar position con más de 100 caracteres', () => {
      // Arrange
      const longPosition = 'B'.repeat(101);
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: longPosition,
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid position');
    });

    it('debe aceptar position con exactamente 100 caracteres', () => {
      // Arrange
      const exactPosition = 'B'.repeat(100);
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: exactPosition,
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });
  });

  // CA-3.9: Validación de descripción
  describe('CA-3.9: Validación de descripción', () => {
    
    it('debe rechazar description con más de 200 caracteres', () => {
      // Arrange
      const longDescription = 'C'.repeat(201);
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            description: longDescription,
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid description');
    });

    it('debe aceptar description con exactamente 200 caracteres', () => {
      // Arrange
      const exactDescription = 'C'.repeat(200);
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            description: exactDescription,
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });

    it('debe aceptar description como undefined (omitido)', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: '2020-01-01'
            // description omitido
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });

    it('debe aceptar description como null', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            description: null,
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });
  });

  // CA-3.10: Validación de fechas de experiencia
  describe('CA-3.10: Validación de fechas de experiencia', () => {
    
    it('debe rechazar experiencia sin startDate', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer'
            // startDate omitido
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid date');
    });

    it('debe rechazar startDate vacío', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: ''
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid date');
    });

    it('debe rechazar startDate con formato inválido YYYY/MM/DD', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: '2020/01/15'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid date');
    });

    it('debe rechazar startDate con formato inválido DD-MM-YYYY', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: '15-01-2020'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid date');
    });

    it('debe aceptar startDate con formato válido YYYY-MM-DD', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: '2020-01-15'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });

    it('debe rechazar endDate con formato inválido YYYY/MM/DD', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: '2020-01-15',
            endDate: '2023/06/30'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid end date');
    });

    it('debe rechazar endDate con formato inválido DD-MM-YYYY', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: '2020-01-15',
            endDate: '30-06-2023'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid end date');
    });

    it('debe aceptar endDate con formato válido YYYY-MM-DD', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: '2020-01-15',
            endDate: '2023-06-30'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });

    it('debe aceptar endDate como null (trabajo actual)', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: '2020-01-15',
            endDate: null
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });

    it('debe aceptar endDate como undefined (omitido)', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: '2020-01-15'
            // endDate omitido
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });
  });
});
