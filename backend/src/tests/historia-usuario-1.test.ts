/**
 * Historia de Usuario 1: Registro de Candidato con Datos Básicos
 * 
 * Criterios cubiertos: CA-1.1 a CA-1.8
 * 
 * Módulos testeados:
 * - src/application/validator.ts (validateName, validateEmail, validatePhone, validateAddress, validateCandidateData)
 * - src/application/services/candidateService.ts (addCandidate)
 * - src/domain/models/Candidate.ts (save)
 */

import { validateCandidateData } from '../application/validator';

// Mock de PrismaClient ANTES de importar cualquier módulo que lo use
const mockCreate = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();

jest.mock('@prisma/client', () => {
  const actualPrisma = jest.requireActual('@prisma/client');
  return {
    ...actualPrisma,
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        candidate: {
          create: mockCreate,
          findUnique: mockFindUnique,
          update: mockUpdate,
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

// AHORA sí, importamos el servicio que usa Prisma
import { addCandidate } from '../application/services/candidateService';

describe('Historia de Usuario 1: Registro de Candidato con Datos Básicos', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CA-1.1: Registro exitoso con datos mínimos obligatorios
  describe('CA-1.1: Registro exitoso con datos mínimos obligatorios', () => {
    
    it('debe crear candidato con firstName, lastName y email', async () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };
      
      const expectedCandidate = {
        id: 1,
        ...inputData,
        phone: null,
        address: null
      };
      
      mockCreate.mockResolvedValue(expectedCandidate);

      // Act
      const result = await addCandidate(inputData);

      // Assert
      expect(result).toEqual(expectedCandidate);
      expect(result.id).toBeDefined();
      expect(result.firstName).toBe('Juan');
      expect(result.lastName).toBe('Pérez');
      expect(result.email).toBe('juan@example.com');
    });

    it('debe asignar ID autoincremental al candidato creado', async () => {
      // Arrange
      const inputData = {
        firstName: 'María',
        lastName: 'García',
        email: 'maria@example.com'
      };
      
      const mockCandidate = { id: 123, ...inputData, phone: null, address: null };
      mockCreate.mockResolvedValue(mockCandidate);

      // Act
      const result = await addCandidate(inputData);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.id).toBe(123);
    });

    it('debe devolver objeto con estructura correcta', async () => {
      // Arrange
      const inputData = {
        firstName: 'Pedro',
        lastName: 'López',
        email: 'pedro@example.com'
      };
      
      const mockCandidate = { 
        id: 1, 
        firstName: 'Pedro', 
        lastName: 'López', 
        email: 'pedro@example.com',
        phone: null,
        address: null
      };
      mockCreate.mockResolvedValue(mockCandidate);

      // Act
      const result = await addCandidate(inputData);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('firstName');
      expect(result).toHaveProperty('lastName');
      expect(result).toHaveProperty('email');
    });
  });

  // CA-1.2: Registro con datos completos opcionales
  describe('CA-1.2: Registro con datos completos opcionales', () => {
    
    it('debe crear candidato con todos los campos incluyendo phone y address', async () => {
      // Arrange
      const inputData = {
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana@example.com',
        phone: '612345678',
        address: 'Calle Mayor 123, Madrid'
      };
      
      const expectedCandidate = {
        id: 2,
        ...inputData
      };
      
      mockCreate.mockResolvedValue(expectedCandidate);

      // Act
      const result = await addCandidate(inputData);

      // Assert
      expect(result).toEqual(expectedCandidate);
      expect(result.phone).toBe('612345678');
      expect(result.address).toBe('Calle Mayor 123, Madrid');
    });

    it('debe almacenar correctamente todos los datos proporcionados', async () => {
      // Arrange
      const inputData = {
        firstName: 'Carlos',
        lastName: 'Ruiz',
        email: 'carlos@example.com',
        phone: '712345678',
        address: 'Avenida Principal 456'
      };
      
      const mockCandidate = { id: 3, ...inputData };
      mockCreate.mockResolvedValue(mockCandidate);

      // Act
      const result = await addCandidate(inputData);

      // Assert
      expect(result.firstName).toBe(inputData.firstName);
      expect(result.lastName).toBe(inputData.lastName);
      expect(result.email).toBe(inputData.email);
      expect(result.phone).toBe(inputData.phone);
      expect(result.address).toBe(inputData.address);
    });
  });

  // CA-1.3: Validación de nombre (firstName)
  describe('CA-1.3: Validación de nombre (firstName)', () => {
    
    it('debe aceptar nombres válidos con caracteres españoles', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com' 
      })).not.toThrow();
      
      expect(() => validateCandidateData({ 
        firstName: 'María José', 
        lastName: 'García', 
        email: 'test@example.com' 
      })).not.toThrow();
      
      expect(() => validateCandidateData({ 
        firstName: 'Ñoño', 
        lastName: 'López', 
        email: 'test@example.com' 
      })).not.toThrow();
    });

    it('debe aceptar nombres con acentos', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'José', 
        lastName: 'Martínez', 
        email: 'test@example.com' 
      })).not.toThrow();
      
      expect(() => validateCandidateData({ 
        firstName: 'Álvaro', 
        lastName: 'Sánchez', 
        email: 'test@example.com' 
      })).not.toThrow();
    });

    it('debe rechazar nombres con menos de 2 caracteres', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'J', 
        lastName: 'Pérez', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
    });

    it('debe rechazar nombres con más de 100 caracteres', () => {
      // Arrange
      const longName = 'A'.repeat(101);
      
      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: longName, 
        lastName: 'Pérez', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
    });

    it('debe rechazar nombres con números', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan123', 
        lastName: 'Pérez', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
    });

    it('debe rechazar nombres con caracteres especiales', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan@', 
        lastName: 'Pérez', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
      
      expect(() => validateCandidateData({ 
        firstName: 'Juan#', 
        lastName: 'Pérez', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
    });

    it('debe rechazar nombres vacíos', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: '', 
        lastName: 'Pérez', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
    });

    it('debe rechazar nombres null o undefined', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: null as any, 
        lastName: 'Pérez', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
      
      expect(() => validateCandidateData({ 
        firstName: undefined as any, 
        lastName: 'Pérez', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
    });
  });

  // CA-1.4: Validación de apellido (lastName)
  describe('CA-1.4: Validación de apellido (lastName)', () => {
    
    it('debe aceptar apellidos válidos con caracteres españoles', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com' 
      })).not.toThrow();
      
      expect(() => validateCandidateData({ 
        firstName: 'María', 
        lastName: 'García López', 
        email: 'test@example.com' 
      })).not.toThrow();
    });

    it('debe rechazar apellidos con menos de 2 caracteres', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'P', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
    });

    it('debe rechazar apellidos con más de 100 caracteres', () => {
      // Arrange
      const longLastName = 'B'.repeat(101);
      
      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: longLastName, 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
    });

    it('debe rechazar apellidos con números', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez123', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
    });

    it('debe rechazar apellidos con caracteres especiales', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez@', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
    });

    it('debe rechazar apellidos vacíos o null', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: '', 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
      
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: null as any, 
        email: 'test@example.com' 
      })).toThrow('Invalid name');
    });
  });

  // CA-1.5: Validación de email único
  describe('CA-1.5: Validación de email único', () => {
    
    it('debe rechazar email duplicado con error de base de datos', async () => {
      // Arrange
      const inputData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };
      
      const prismaError = new Error('Unique constraint failed');
      (prismaError as any).code = 'P2002';
      mockCreate.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(addCandidate(inputData)).rejects.toThrow('The email already exists in the database');
    });

    it('debe manejar correctamente error Prisma P2002', async () => {
      // Arrange
      const inputData = {
        firstName: 'María',
        lastName: 'García',
        email: 'maria@example.com'
      };
      
      const prismaError = { code: 'P2002', message: 'Unique constraint failed' };
      mockCreate.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(addCandidate(inputData)).rejects.toThrow('The email already exists in the database');
    });
  });

  // CA-1.6: Validación de formato de email
  describe('CA-1.6: Validación de formato de email', () => {
    
    it('debe aceptar emails válidos', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com' 
      })).not.toThrow();
      
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'user.name@domain.co.uk' 
      })).not.toThrow();
    });

    it('debe rechazar emails sin @', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'testexample.com' 
      })).toThrow('Invalid email');
    });

    it('debe rechazar emails sin dominio', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@' 
      })).toThrow('Invalid email');
    });

    it('debe rechazar emails sin TLD', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example' 
      })).toThrow('Invalid email');
    });

    it('debe rechazar emails vacíos', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: '' 
      })).toThrow('Invalid email');
    });

    it('debe rechazar emails null o undefined', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: null as any 
      })).toThrow('Invalid email');
      
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: undefined as any 
      })).toThrow('Invalid email');
    });

    it('debe rechazar emails con espacios', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test @example.com' 
      })).toThrow('Invalid email');
    });
  });

  // CA-1.7: Validación de teléfono español
  describe('CA-1.7: Validación de teléfono español', () => {
    
    it('debe aceptar teléfonos válidos que empiezan con 6, 7 o 9', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        phone: '612345678'
      })).not.toThrow();
      
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        phone: '712345678'
      })).not.toThrow();
      
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        phone: '912345678'
      })).not.toThrow();
    });

    it('debe aceptar phone como undefined (campo opcional)', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        phone: undefined
      })).not.toThrow();
    });

    it('debe rechazar teléfonos que no empiezan con 6, 7 o 9', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        phone: '512345678'
      })).toThrow('Invalid phone');
    });

    it('debe rechazar teléfonos con menos de 9 dígitos', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        phone: '61234567'
      })).toThrow('Invalid phone');
    });

    it('debe rechazar teléfonos con más de 9 dígitos', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        phone: '6123456789'
      })).toThrow('Invalid phone');
    });

    it('debe rechazar teléfonos con letras', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        phone: '61234567a'
      })).toThrow('Invalid phone');
    });
  });

  // CA-1.8: Validación de dirección
  describe('CA-1.8: Validación de dirección', () => {
    
    it('debe aceptar direcciones válidas de hasta 100 caracteres', () => {
      // Arrange
      const validAddress = 'Calle Mayor 123, 28013 Madrid, España';
      
      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        address: validAddress
      })).not.toThrow();
    });

    it('debe aceptar address como undefined (campo opcional)', () => {
      // Arrange & Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        address: undefined
      })).not.toThrow();
    });

    it('debe rechazar direcciones con más de 100 caracteres', () => {
      // Arrange
      const longAddress = 'A'.repeat(101);
      
      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        address: longAddress
      })).toThrow('Invalid address');
    });

    it('debe aceptar dirección exactamente de 100 caracteres', () => {
      // Arrange
      const exactAddress = 'A'.repeat(100);
      
      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'test@example.com',
        address: exactAddress
      })).not.toThrow();
    });
  });
});
