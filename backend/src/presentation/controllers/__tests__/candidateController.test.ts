import { Request, Response } from 'express';
import { addCandidateController } from '../candidateController';
import { addCandidate } from '../../../application/services/candidateService';

// Mock the candidateService
jest.mock('../../../application/services/candidateService');

describe('CandidateController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock response object
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      body: {}
    };

    mockResponse = {
      status: statusMock,
      json: jsonMock
    };
  });

  describe('addCandidateController', () => {
    it('debería retornar 201 con mensaje de éxito cuando se crea candidato', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      const savedCandidate = {
        id: 1,
        ...candidateData
      };

      mockRequest.body = candidateData;
      (addCandidate as jest.Mock).mockResolvedValue(savedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: savedCandidate
      });
    });

    it('debería llamar a addCandidate con req.body', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      mockRequest.body = candidateData;
      (addCandidate as jest.Mock).mockResolvedValue({ id: 1, ...candidateData });

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(addCandidate).toHaveBeenCalledWith(candidateData);
    });

    it('debería retornar datos del candidato creado', async () => {
      // Arrange
      const candidateData = {
        firstName: 'María',
        lastName: 'García',
        email: 'maria@example.com',
        phone: '712345678',
        address: 'Calle Mayor 123'
      };

      const savedCandidate = {
        id: 42,
        ...candidateData,
        createdAt: new Date()
      };

      mockRequest.body = candidateData;
      (addCandidate as jest.Mock).mockResolvedValue(savedCandidate);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: savedCandidate
      });
    });

    it('debería retornar 400 con mensaje de error cuando falla', async () => {
      // Arrange
      const candidateData = {
        firstName: 'J', // Invalid - too short
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      const error = new Error('Invalid name');

      mockRequest.body = candidateData;
      (addCandidate as jest.Mock).mockRejectedValue(error);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Invalid name'
      });
    });

    it('debería manejar errores de tipo Error', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'duplicate@example.com',
        phone: '612345678'
      };

      const error = new Error('The email already exists in the database');

      mockRequest.body = candidateData;
      (addCandidate as jest.Mock).mockRejectedValue(error);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'The email already exists in the database'
      });
    });

    it('debería manejar errores desconocidos (no Error)', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      const unknownError = 'Something went wrong'; // Not an Error instance

      mockRequest.body = candidateData;
      (addCandidate as jest.Mock).mockRejectedValue(unknownError);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Unknown error'
      });
    });
  });
});
