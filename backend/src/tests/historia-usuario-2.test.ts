/**
 * Historia de Usuario 2: Registro de Historial Educativo del Candidato
 * 
 * Criterios cubiertos: CA-2.1 a CA-2.8
 * 
 * Módulos testeados:
 * - src/application/validator.ts (validateEducation, validateCandidateData)
 * - src/application/services/candidateService.ts (addCandidate con educations)
 * - src/domain/models/Education.ts (save)
 */

import { validateCandidateData } from '../application/validator';

// Mock de PrismaClient ANTES de importar módulos que lo usan
const mockCandidateCreate = jest.fn();
const mockEducationCreate = jest.fn();
const mockEducationUpdate = jest.fn();

jest.mock('@prisma/client', () => {
  const actualPrisma = jest.requireActual('@prisma/client');
  return {
    ...actualPrisma,
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        candidate: {
          create: mockCandidateCreate,
        },
        education: {
          create: mockEducationCreate,
          update: mockEducationUpdate,
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

describe('Historia de Usuario 2: Registro de Historial Educativo del Candidato', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CA-2.1: Registro de candidato con una educación
  describe('CA-2.1: Registro de candidato con una educación', () => {
    
    it('debe crear candidato con un registro de educación asociado', async () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: 'Ingeniería Informática',
            startDate: '2015-09-01',
            endDate: '2019-06-30'
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

      const mockEducation = {
        id: 1,
        institution: 'Universidad de Madrid',
        title: 'Ingeniería Informática',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2019-06-30'),
        candidateId: 1
      };

      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockEducationCreate.mockResolvedValue(mockEducation);

      // Act
      const result = await addCandidate(inputData);

      // Assert
      expect(result).toEqual(mockCandidate);
      expect(mockCandidateCreate).toHaveBeenCalledTimes(1);
      expect(mockEducationCreate).toHaveBeenCalledTimes(1);
      expect(mockEducationCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          institution: 'Universidad de Madrid',
          title: 'Ingeniería Informática',
          candidateId: 1
        })
      });
    });

    it('debe vincular la educación al candidato mediante candidateId', async () => {
      // Arrange
      const inputData = {
        firstName: 'María',
        lastName: 'García',
        email: 'maria@example.com',
        educations: [
          {
            institution: 'Universidad Complutense',
            title: 'Medicina',
            startDate: '2018-09-01'
          }
        ]
      };

      const mockCandidate = { id: 5, firstName: 'María', lastName: 'García', email: 'maria@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockEducationCreate.mockResolvedValue({ id: 2, candidateId: 5 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockEducationCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          candidateId: 5
        })
      });
    });
  });

  // CA-2.2: Registro de candidato con múltiples educaciones
  describe('CA-2.2: Registro de candidato con múltiples educaciones', () => {
    
    it('debe crear candidato con múltiples registros de educación', async () => {
      // Arrange
      const inputData = {
        firstName: 'Carlos',
        lastName: 'Ruiz',
        email: 'carlos@example.com',
        educations: [
          {
            institution: 'Universidad Politécnica',
            title: 'Ingeniería Civil',
            startDate: '2012-09-01',
            endDate: '2016-06-30'
          },
          {
            institution: 'IE Business School',
            title: 'MBA',
            startDate: '2017-09-01',
            endDate: '2019-06-30'
          },
          {
            institution: 'Universidad de Barcelona',
            title: 'Máster en Project Management',
            startDate: '2020-09-01'
          }
        ]
      };

      const mockCandidate = { id: 10, firstName: 'Carlos', lastName: 'Ruiz', email: 'carlos@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockEducationCreate.mockResolvedValue({ id: 1 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockEducationCreate).toHaveBeenCalledTimes(3);
      expect(mockEducationCreate).toHaveBeenNthCalledWith(1, {
        data: expect.objectContaining({
          institution: 'Universidad Politécnica',
          title: 'Ingeniería Civil',
          candidateId: 10
        })
      });
      expect(mockEducationCreate).toHaveBeenNthCalledWith(2, {
        data: expect.objectContaining({
          institution: 'IE Business School',
          title: 'MBA',
          candidateId: 10
        })
      });
      expect(mockEducationCreate).toHaveBeenNthCalledWith(3, {
        data: expect.objectContaining({
          institution: 'Universidad de Barcelona',
          candidateId: 10
        })
      });
    });

    it('debe permitir array vacío de educations', async () => {
      // Arrange
      const inputData = {
        firstName: 'Ana',
        lastName: 'López',
        email: 'ana@example.com',
        educations: []
      };

      const mockCandidate = { id: 11, firstName: 'Ana', lastName: 'López', email: 'ana@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockCandidateCreate).toHaveBeenCalledTimes(1);
      expect(mockEducationCreate).not.toHaveBeenCalled();
    });

    it('debe permitir educations como undefined', async () => {
      // Arrange
      const inputData = {
        firstName: 'Pedro',
        lastName: 'Martínez',
        email: 'pedro@example.com'
        // educations: undefined (omitido)
      };

      const mockCandidate = { id: 12, firstName: 'Pedro', lastName: 'Martínez', email: 'pedro@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockCandidateCreate).toHaveBeenCalledTimes(1);
      expect(mockEducationCreate).not.toHaveBeenCalled();
    });
  });

  // CA-2.3: Registro de educación con fecha de finalización
  describe('CA-2.3: Registro de educación con fecha de finalización', () => {
    
    it('debe almacenar correctamente startDate y endDate', async () => {
      // Arrange
      const inputData = {
        firstName: 'Laura',
        lastName: 'Sánchez',
        email: 'laura@example.com',
        educations: [
          {
            institution: 'Universidad Autónoma',
            title: 'Derecho',
            startDate: '2014-09-01',
            endDate: '2018-06-30'
          }
        ]
      };

      const mockCandidate = { id: 20, firstName: 'Laura', lastName: 'Sánchez', email: 'laura@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockEducationCreate.mockResolvedValue({ id: 1 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockEducationCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          startDate: expect.any(Date),
          endDate: expect.any(Date)
        })
      });
    });
  });

  // CA-2.4: Registro de educación sin fecha de finalización (en curso)
  describe('CA-2.4: Registro de educación sin fecha de finalización (en curso)', () => {
    
    it('debe almacenar educación con endDate como undefined cuando se omite', async () => {
      // Arrange
      const inputData = {
        firstName: 'Diego',
        lastName: 'Fernández',
        email: 'diego@example.com',
        educations: [
          {
            institution: 'UNED',
            title: 'Psicología',
            startDate: '2022-09-01'
            // endDate omitido - educación en curso
          }
        ]
      };

      const mockCandidate = { id: 30, firstName: 'Diego', lastName: 'Fernández', email: 'diego@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockEducationCreate.mockResolvedValue({ id: 1 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockEducationCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          startDate: expect.any(Date),
          endDate: undefined
        })
      });
    });

    it('debe aceptar endDate como null explícitamente', async () => {
      // Arrange
      const inputData = {
        firstName: 'Sofia',
        lastName: 'Torres',
        email: 'sofia@example.com',
        educations: [
          {
            institution: 'Universidad de Valencia',
            title: 'Arquitectura',
            startDate: '2021-09-01',
            endDate: null
          }
        ]
      };

      const mockCandidate = { id: 31, firstName: 'Sofia', lastName: 'Torres', email: 'sofia@example.com', phone: null, address: null };
      mockCandidateCreate.mockResolvedValue(mockCandidate);
      mockEducationCreate.mockResolvedValue({ id: 1 });

      // Act
      await addCandidate(inputData);

      // Assert
      expect(mockEducationCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          startDate: expect.any(Date),
          endDate: undefined
        })
      });
    });
  });

  // CA-2.5: Validación de institución
  describe('CA-2.5: Validación de institución', () => {
    
    it('debe rechazar educación sin institution', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            // institution omitido
            title: 'Ingeniería',
            startDate: '2015-09-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid institution');
    });

    it('debe rechazar institution vacío', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: '',
            title: 'Ingeniería',
            startDate: '2015-09-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid institution');
    });

    it('debe rechazar institution con más de 100 caracteres', () => {
      // Arrange
      const longInstitution = 'A'.repeat(101);
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: longInstitution,
            title: 'Ingeniería',
            startDate: '2015-09-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid institution');
    });

    it('debe aceptar institution con exactamente 100 caracteres', () => {
      // Arrange
      const exactInstitution = 'A'.repeat(100);
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: exactInstitution,
            title: 'Ingeniería',
            startDate: '2015-09-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });
  });

  // CA-2.6: Validación de título
  describe('CA-2.6: Validación de título', () => {
    
    it('debe rechazar educación sin title', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad de Madrid',
            // title omitido
            startDate: '2015-09-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid title');
    });

    it('debe rechazar title vacío', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: '',
            startDate: '2015-09-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid title');
    });

    it('debe rechazar title con más de 100 caracteres', () => {
      // Arrange
      const longTitle = 'B'.repeat(101);
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: longTitle,
            startDate: '2015-09-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).toThrow('Invalid title');
    });

    it('debe aceptar title con exactamente 100 caracteres', () => {
      // Arrange
      const exactTitle = 'B'.repeat(100);
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: exactTitle,
            startDate: '2015-09-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });
  });

  // CA-2.7: Validación de fecha de inicio
  describe('CA-2.7: Validación de fecha de inicio', () => {
    
    it('debe rechazar educación sin startDate', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: 'Ingeniería',
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
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: 'Ingeniería',
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
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: 'Ingeniería',
            startDate: '2020/09/01'
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
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: 'Ingeniería',
            startDate: '01-09-2020'
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
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: 'Ingeniería',
            startDate: '2020-09-01'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });
  });

  // CA-2.8: Validación de fecha de finalización
  describe('CA-2.8: Validación de fecha de finalización', () => {
    
    it('debe rechazar endDate con formato inválido YYYY/MM/DD', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: 'Ingeniería',
            startDate: '2015-09-01',
            endDate: '2019/06/30'
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
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: 'Ingeniería',
            startDate: '2015-09-01',
            endDate: '30-06-2019'
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
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: 'Ingeniería',
            startDate: '2015-09-01',
            endDate: '2019-06-30'
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });

    it('debe aceptar endDate como null (educación en curso)', () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: 'Ingeniería',
            startDate: '2015-09-01',
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
        educations: [
          {
            institution: 'Universidad de Madrid',
            title: 'Ingeniería',
            startDate: '2015-09-01'
            // endDate omitido
          }
        ]
      };

      // Act & Assert
      expect(() => validateCandidateData(inputData)).not.toThrow();
    });
  });
});
