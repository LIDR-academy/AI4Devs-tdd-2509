import axios from 'axios';
import { uploadCV, sendCandidateData } from '../candidateService';

// Mock axios
jest.mock('axios');

describe('CandidateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadCV', () => {
    it('debería crear FormData con archivo', async () => {
      // Arrange
      const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      const mockResponse = {
        data: {
          filePath: '/uploads/123-test.pdf',
          fileType: 'application/pdf'
        }
      };

      axios.post.mockResolvedValue(mockResponse);

      // Act
      await uploadCV(mockFile);

      // Assert
      expect(axios.post).toHaveBeenCalled();
      const formData = axios.post.mock.calls[0][1];
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('file')).toBe(mockFile);
    });

    it('debería hacer POST a /upload con headers correctos', async () => {
      // Arrange
      const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      const mockResponse = {
        data: {
          filePath: '/uploads/123-test.pdf',
          fileType: 'application/pdf'
        }
      };

      axios.post.mockResolvedValue(mockResponse);

      // Act
      await uploadCV(mockFile);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3010/upload',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    });

    it('debería retornar response.data en éxito', async () => {
      // Arrange
      const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      const mockResponseData = {
        filePath: '/uploads/123-test.pdf',
        fileType: 'application/pdf'
      };

      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act
      const result = await uploadCV(mockFile);

      // Assert
      expect(result).toEqual(mockResponseData);
    });

    it('debería lanzar error con mensaje específico en fallo', async () => {
      // Arrange
      const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      const errorResponse = {
        response: {
          data: { error: 'File too large' }
        }
      };

      axios.post.mockRejectedValue(errorResponse);

      // Act & Assert
      await expect(uploadCV(mockFile)).rejects.toThrow('Error al subir el archivo:');
    });

    it('debería incluir error.response.data en mensaje de error', async () => {
      // Arrange
      const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      const errorMessage = 'Invalid file type';
      const errorResponse = {
        response: {
          data: errorMessage
        }
      };

      axios.post.mockRejectedValue(errorResponse);

      // Act & Assert
      try {
        await uploadCV(mockFile);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('Error al subir el archivo:');
      }
    });
  });

  describe('sendCandidateData', () => {
    it('debería hacer POST a /candidates con candidateData', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      const mockResponse = {
        data: {
          message: 'Candidate added successfully',
          data: { id: 1, ...candidateData }
        }
      };

      axios.post.mockResolvedValue(mockResponse);

      // Act
      await sendCandidateData(candidateData);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3010/candidates',
        candidateData
      );
    });

    it('debería retornar response.data en éxito', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      const mockResponseData = {
        message: 'Candidate added successfully',
        data: { id: 1, ...candidateData }
      };

      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act
      const result = await sendCandidateData(candidateData);

      // Assert
      expect(result).toEqual(mockResponseData);
    });

    it('debería lanzar error con mensaje específico en fallo', async () => {
      // Arrange
      const candidateData = {
        firstName: 'J',
        lastName: 'Pérez',
        email: 'invalid-email',
        phone: '612345678'
      };

      const errorResponse = {
        response: {
          data: { error: 'Invalid data' }
        }
      };

      axios.post.mockRejectedValue(errorResponse);

      // Act & Assert
      await expect(sendCandidateData(candidateData)).rejects.toThrow('Error al enviar datos del candidato:');
    });

    it('debería incluir error.response.data en mensaje de error', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'duplicate@example.com',
        phone: '612345678'
      };

      const errorMessage = 'Email already exists';
      const errorResponse = {
        response: {
          data: errorMessage
        }
      };

      axios.post.mockRejectedValue(errorResponse);

      // Act & Assert
      try {
        await sendCandidateData(candidateData);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('Error al enviar datos del candidato:');
      }
    });

    it('debería manejar errores de red (sin response)', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      const networkError = new Error('Network Error');
      networkError.response = undefined;

      axios.post.mockRejectedValue(networkError);

      // Act & Assert
      await expect(sendCandidateData(candidateData)).rejects.toThrow();
    });
  });
});
