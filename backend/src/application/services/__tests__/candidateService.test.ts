import { addCandidate } from '../candidateService';
import { validateCandidateData } from '../../validator';
import { Candidate } from '../../../domain/models/Candidate';
import { Education } from '../../../domain/models/Education';
import { WorkExperience } from '../../../domain/models/WorkExperience';
import { Resume } from '../../../domain/models/Resume';

// Mock dependencies
jest.mock('../../validator');
jest.mock('../../../domain/models/Candidate');
jest.mock('../../../domain/models/Education');
jest.mock('../../../domain/models/WorkExperience');
jest.mock('../../../domain/models/Resume');

describe('CandidateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addCandidate - Casos exitosos', () => {
    it('debería crear candidato sin educación ni experiencia ni CV', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      const savedCandidate = { id: 1, ...candidateData };

      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(mockCandidateInstance.save).toHaveBeenCalled();
      expect(result).toEqual(savedCandidate);
    });

    it('debería crear candidato con educación', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        educations: [{
          institution: 'Universidad',
          title: 'Ingeniería',
          startDate: '2020-09-01',
          endDate: '2024-06-30'
        }]
      };

      const savedCandidate = { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };

      const mockEducationInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined
      };

      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (Education as jest.MockedClass<typeof Education>).mockImplementation(() => mockEducationInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(Education).toHaveBeenCalledWith(candidateData.educations[0]);
      expect(mockEducationInstance.candidateId).toBe(1);
      expect(mockEducationInstance.save).toHaveBeenCalled();
      expect(mockCandidateInstance.education).toHaveLength(1);
      expect(result).toEqual(savedCandidate);
    });

    it('debería crear candidato con experiencia laboral', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        workExperiences: [{
          company: 'Tech Corp',
          position: 'Developer',
          description: 'Software development',
          startDate: '2020-01-01',
          endDate: '2023-12-31'
        }]
      };

      const savedCandidate = { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };

      const mockWorkExperienceInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined
      };

      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (WorkExperience as jest.MockedClass<typeof WorkExperience>).mockImplementation(() => mockWorkExperienceInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(WorkExperience).toHaveBeenCalledWith(candidateData.workExperiences[0]);
      expect(mockWorkExperienceInstance.candidateId).toBe(1);
      expect(mockWorkExperienceInstance.save).toHaveBeenCalled();
      expect(mockCandidateInstance.workExperience).toHaveLength(1);
      expect(result).toEqual(savedCandidate);
    });

    it('debería crear candidato con CV', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        cv: {
          filePath: '/uploads/cv.pdf',
          fileType: 'application/pdf'
        }
      };

      const savedCandidate = { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };

      const mockResumeInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined
      };

      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (Resume as jest.MockedClass<typeof Resume>).mockImplementation(() => mockResumeInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(Resume).toHaveBeenCalledWith(candidateData.cv);
      expect(mockResumeInstance.candidateId).toBe(1);
      expect(mockResumeInstance.save).toHaveBeenCalled();
      expect(mockCandidateInstance.resumes).toHaveLength(1);
      expect(result).toEqual(savedCandidate);
    });

    it('debería crear candidato completo (con educación, experiencia y CV)', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        educations: [{
          institution: 'Universidad',
          title: 'Ingeniería',
          startDate: '2020-09-01'
        }],
        workExperiences: [{
          company: 'Tech Corp',
          position: 'Developer',
          startDate: '2020-01-01'
        }],
        cv: {
          filePath: '/uploads/cv.pdf',
          fileType: 'application/pdf'
        }
      };

      const savedCandidate = { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };

      const mockEducationInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined
      };

      const mockWorkExperienceInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined
      };

      const mockResumeInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined
      };

      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (Education as jest.MockedClass<typeof Education>).mockImplementation(() => mockEducationInstance as any);
      (WorkExperience as jest.MockedClass<typeof WorkExperience>).mockImplementation(() => mockWorkExperienceInstance as any);
      (Resume as jest.MockedClass<typeof Resume>).mockImplementation(() => mockResumeInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(Education).toHaveBeenCalled();
      expect(WorkExperience).toHaveBeenCalled();
      expect(Resume).toHaveBeenCalled();
      expect(mockCandidateInstance.education).toHaveLength(1);
      expect(mockCandidateInstance.workExperience).toHaveLength(1);
      expect(mockCandidateInstance.resumes).toHaveLength(1);
      expect(result).toEqual(savedCandidate);
    });

    it('debería asignar candidateId correcto a educaciones', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        educations: [
          { institution: 'Uni 1', title: 'Título 1', startDate: '2020-09-01' },
          { institution: 'Uni 2', title: 'Título 2', startDate: '2018-09-01' }
        ]
      };

      const savedCandidate = { id: 123, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };

      const mockEducationInstances = [
        { save: jest.fn().mockResolvedValue({ id: 1 }), candidateId: undefined },
        { save: jest.fn().mockResolvedValue({ id: 2 }), candidateId: undefined }
      ];

      let callIndex = 0;
      (Education as jest.MockedClass<typeof Education>).mockImplementation(() => mockEducationInstances[callIndex++] as any);

      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockEducationInstances[0].candidateId).toBe(123);
      expect(mockEducationInstances[1].candidateId).toBe(123);
    });

    it('debería asignar candidateId correcto a experiencias', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        workExperiences: [
          { company: 'Company 1', position: 'Dev 1', startDate: '2020-01-01' },
          { company: 'Company 2', position: 'Dev 2', startDate: '2018-01-01' }
        ]
      };

      const savedCandidate = { id: 456, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };

      const mockWorkExperienceInstances = [
        { save: jest.fn().mockResolvedValue({ id: 1 }), candidateId: undefined },
        { save: jest.fn().mockResolvedValue({ id: 2 }), candidateId: undefined }
      ];

      let callIndex = 0;
      (WorkExperience as jest.MockedClass<typeof WorkExperience>).mockImplementation(() => mockWorkExperienceInstances[callIndex++] as any);

      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockWorkExperienceInstances[0].candidateId).toBe(456);
      expect(mockWorkExperienceInstances[1].candidateId).toBe(456);
    });

    it('debería asignar candidateId correcto a CV', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        cv: {
          filePath: '/uploads/cv.pdf',
          fileType: 'application/pdf'
        }
      };

      const savedCandidate = { id: 789, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };

      const mockResumeInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined
      };

      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (Resume as jest.MockedClass<typeof Resume>).mockImplementation(() => mockResumeInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(mockResumeInstance.candidateId).toBe(789);
    });
  });

  describe('addCandidate - Validación', () => {
    it('debería llamar a validateCandidateData antes de guardar', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue({ id: 1, ...candidateData }),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
      expect(validateCandidateData).toHaveBeenCalled();
      expect(mockCandidateInstance.save).toHaveBeenCalled();
    });

    it('debería lanzar error si validación falla', async () => {
      // Arrange
      const candidateData = {
        firstName: 'J', // Inválido
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid name');
      });

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });

    it('debería propagar errores de validación correctamente', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'invalid-email',
        phone: '612345678'
      };

      const validationError = new Error('Invalid email');
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw validationError;
      });

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow(validationError);
    });
  });

  describe('addCandidate - Manejo de errores', () => {
    it('debería manejar error P2002 (email duplicado)', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'duplicate@example.com',
        phone: '612345678'
      };

      const prismaError = { code: 'P2002' };

      const mockCandidateInstance = {
        save: jest.fn().mockRejectedValue(prismaError),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
    });

    it('debería lanzar mensaje específico para email duplicado', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'duplicate@example.com',
        phone: '612345678'
      };

      const mockCandidateInstance = {
        save: jest.fn().mockRejectedValue({ code: 'P2002', meta: { target: ['email'] } }),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
    });

    it('debería propagar otros errores de Prisma', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678'
      };

      const otherError = new Error('Database connection failed');

      const mockCandidateInstance = {
        save: jest.fn().mockRejectedValue(otherError),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow(otherError);
    });

    it('debería manejar errores al guardar educación/experiencia', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        educations: [{
          institution: 'Universidad',
          title: 'Ingeniería',
          startDate: '2020-09-01'
        }]
      };

      const savedCandidate = { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };
      const educationError = new Error('Failed to save education');

      const mockEducationInstance = {
        save: jest.fn().mockRejectedValue(educationError),
        candidateId: undefined
      };

      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
      (Education as jest.MockedClass<typeof Education>).mockImplementation(() => mockEducationInstance as any);
      (validateCandidateData as jest.Mock).mockReturnValue(undefined);

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow(educationError);
    });
  });
});
