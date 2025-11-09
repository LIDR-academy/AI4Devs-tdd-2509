import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploader from '../FileUploader';

describe('FileUploader', () => {
  let mockOnChange;
  let mockOnUpload;

  beforeEach(() => {
    mockOnChange = jest.fn();
    mockOnUpload = jest.fn();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('debería renderizar input de tipo file', () => {
      // Arrange & Act
      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);

      // Assert
      const fileInput = screen.getByLabelText('File');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
    });

    it('debería renderizar botón "Subir Archivo"', () => {
      // Arrange & Act
      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);

      // Assert
      const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
      expect(uploadButton).toBeInTheDocument();
    });

    it('debería mostrar nombre de archivo seleccionado', async () => {
      // Arrange
      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);

      // Assert
      expect(screen.getByText(/selected file: test.pdf/i)).toBeInTheDocument();
    });
  });

  describe('handleFileChange', () => {
    it('debería actualizar estado file al seleccionar archivo', async () => {
      // Arrange
      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const file = new File(['dummy content'], 'cv.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);

      // Assert
      expect(fileInput.files[0]).toBe(file);
      expect(fileInput.files).toHaveLength(1);
    });

    it('debería actualizar fileName con nombre del archivo', async () => {
      // Arrange
      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);

      // Assert
      expect(screen.getByText(/selected file: resume.pdf/i)).toBeInTheDocument();
    });

    it('debería llamar prop onChange con archivo', async () => {
      // Arrange
      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith(file);
    });
  });

  describe('handleFileUpload - Éxito', () => {
    it('debería crear FormData con archivo', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: async () => ({
          filePath: '/uploads/123-test.pdf',
          fileType: 'application/pdf'
        })
      };

      global.fetch.mockResolvedValue(mockResponse);

      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);
      fireEvent.click(uploadButton);

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('debería hacer fetch a /upload', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: async () => ({
          filePath: '/uploads/123-test.pdf',
          fileType: 'application/pdf'
        })
      };

      global.fetch.mockResolvedValue(mockResponse);

      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);
      fireEvent.click(uploadButton);

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3010/upload',
          expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData)
          })
        );
      });
    });

    it('debería establecer loading=true durante subida', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: async () => ({
          filePath: '/uploads/123-test.pdf',
          fileType: 'application/pdf'
        })
      };

      let resolvePromise;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      global.fetch.mockReturnValue(pendingPromise);

      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);
      fireEvent.click(uploadButton);

      // Assert
      await waitFor(() => {
        const spinner = screen.queryByRole('status');
        expect(spinner).toBeInTheDocument();
      });

      // Cleanup
      resolvePromise(mockResponse);
    });

    it('debería establecer loading=false después de subida', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: async () => ({
          filePath: '/uploads/123-test.pdf',
          fileType: 'application/pdf'
        })
      };

      global.fetch.mockResolvedValue(mockResponse);

      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);
      fireEvent.click(uploadButton);

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
    });

    it('debería llamar prop onUpload con fileData', async () => {
      // Arrange
      const mockFileData = {
        filePath: '/uploads/123-test.pdf',
        fileType: 'application/pdf'
      };

      const mockResponse = {
        ok: true,
        json: async () => mockFileData
      };

      global.fetch.mockResolvedValue(mockResponse);

      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);
      fireEvent.click(uploadButton);

      // Assert
      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalledWith(mockFileData);
      });
    });

    it('debería mostrar mensaje de éxito', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: async () => ({
          filePath: '/uploads/123-test.pdf',
          fileType: 'application/pdf'
        })
      };

      global.fetch.mockResolvedValue(mockResponse);

      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);
      fireEvent.click(uploadButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/archivo subido con éxito/i)).toBeInTheDocument();
      });
    });
  });

  describe('handleFileUpload - Error', () => {
    it('debería manejar respuesta no exitosa', async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 400
      };

      global.fetch.mockResolvedValue(mockResponse);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);
      fireEvent.click(uploadButton);

      // Assert
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    it('debería mostrar error en consola', async () => {
      // Arrange
      const mockError = new Error('Network error');
      global.fetch.mockRejectedValue(mockError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);
      fireEvent.click(uploadButton);

      // Assert
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error al subir archivo:', mockError);
      });

      consoleErrorSpy.mockRestore();
    });

    it('debería establecer loading=false en caso de error', async () => {
      // Arrange
      const mockError = new Error('Upload failed');
      global.fetch.mockRejectedValue(mockError);

      jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
      const fileInput = screen.getByLabelText('File');
      const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      await userEvent.upload(fileInput, file);
      fireEvent.click(uploadButton);

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });

      console.error.mockRestore();
    });
  });
});
