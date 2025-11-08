import { addCandidate } from '../application/services/candidateService';
import { uploadFile } from '../application/services/fileUploadService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { validateCandidateData } from '../application/validator';
import { Request, Response } from 'express';
import multer from 'multer';

// Mock all dependencies
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');
jest.mock('../application/validator');
jest.mock('multer');

const mockCandidate = Candidate as jest.MockedClass<typeof Candidate>;
const mockEducation = Education as jest.MockedClass<typeof Education>;
const mockWorkExperience = WorkExperience as jest.MockedClass<typeof WorkExperience>;
const mockResume = Resume as jest.MockedClass<typeof Resume>;
const mockValidateCandidateData = validateCandidateData as jest.MockedFunction<typeof validateCandidateData>;
const mockMulter = multer as jest.MockedFunction<typeof multer>;

describe('candidateService - addCandidate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy Path', () => {
        it('should successfully add a candidate with complete data', async () => {
            // Arrange
            const candidateData = {
                name: 'John Doe',
                email: 'john@example.com',
                educations: [{ degree: 'Bachelor', institution: 'University A' }],
                workExperiences: [{ company: 'Company A', position: 'Developer' }],
                cv: { fileName: 'resume.pdf', content: 'base64content' }
            };

            const mockSavedCandidate = { id: 1, ...candidateData };
            const mockCandidateInstance = {
                save: jest.fn().mockResolvedValue(mockSavedCandidate),
                education: [],
                workExperience: [],
                resumes: []
            };

            const mockEducationInstance = { save: jest.fn().mockResolvedValue({}), candidateId: null };
            const mockWorkExperienceInstance = { save: jest.fn().mockResolvedValue({}), candidateId: null };
            const mockResumeInstance = { save: jest.fn().mockResolvedValue({}), candidateId: null };

            mockValidateCandidateData.mockImplementation(() => {});
            mockCandidate.mockImplementation(() => mockCandidateInstance as any);
            mockEducation.mockImplementation(() => mockEducationInstance as any);
            mockWorkExperience.mockImplementation(() => mockWorkExperienceInstance as any);
            mockResume.mockImplementation(() => mockResumeInstance as any);

            // Act
            const result = await addCandidate(candidateData);

            // Assert
            expect(mockValidateCandidateData).toHaveBeenCalledWith(candidateData);
            expect(mockCandidate).toHaveBeenCalledWith(candidateData);
            expect(mockCandidateInstance.save).toHaveBeenCalled();
            expect(mockEducation).toHaveBeenCalledWith(candidateData.educations[0]);
            expect(mockEducationInstance.candidateId).toBe(1);
            expect(mockEducationInstance.save).toHaveBeenCalled();
            expect(mockWorkExperience).toHaveBeenCalledWith(candidateData.workExperiences[0]);
            expect(mockWorkExperienceInstance.candidateId).toBe(1);
            expect(mockWorkExperienceInstance.save).toHaveBeenCalled();
            expect(mockResume).toHaveBeenCalledWith(candidateData.cv);
            expect(mockResumeInstance.candidateId).toBe(1);
            expect(mockResumeInstance.save).toHaveBeenCalled();
            expect(result).toEqual(mockSavedCandidate);
        });

        it('should successfully add a candidate with minimal data', async () => {
            // Arrange
            const candidateData = {
                name: 'Jane Doe',
                email: 'jane@example.com'
            };

            const mockSavedCandidate = { id: 2, ...candidateData };
            const mockCandidateInstance = {
                save: jest.fn().mockResolvedValue(mockSavedCandidate),
                education: [],
                workExperience: [],
                resumes: []
            };

            mockValidateCandidateData.mockImplementation(() => {});
            mockCandidate.mockImplementation(() => mockCandidateInstance as any);

            // Act
            const result = await addCandidate(candidateData);

            // Assert
            expect(mockValidateCandidateData).toHaveBeenCalledWith(candidateData);
            expect(mockCandidate).toHaveBeenCalledWith(candidateData);
            expect(mockCandidateInstance.save).toHaveBeenCalled();
            expect(mockEducation).not.toHaveBeenCalled();
            expect(mockWorkExperience).not.toHaveBeenCalled();
            expect(mockResume).not.toHaveBeenCalled();
            expect(result).toEqual(mockSavedCandidate);
        });

        it('should handle empty arrays for educations and workExperiences', async () => {
            // Arrange
            const candidateData = {
                name: 'Bob Smith',
                email: 'bob@example.com',
                educations: [],
                workExperiences: []
            };

            const mockSavedCandidate = { id: 3, ...candidateData };
            const mockCandidateInstance = {
                save: jest.fn().mockResolvedValue(mockSavedCandidate),
                education: [],
                workExperience: [],
                resumes: []
            };

            mockValidateCandidateData.mockImplementation(() => {});
            mockCandidate.mockImplementation(() => mockCandidateInstance as any);

            // Act
            const result = await addCandidate(candidateData);

            // Assert
            expect(mockEducation).not.toHaveBeenCalled();
            expect(mockWorkExperience).not.toHaveBeenCalled();
            expect(result).toEqual(mockSavedCandidate);
        });

        it('should handle empty CV object', async () => {
            // Arrange
            const candidateData = {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                cv: {}
            };

            const mockSavedCandidate = { id: 4, ...candidateData };
            const mockCandidateInstance = {
                save: jest.fn().mockResolvedValue(mockSavedCandidate),
                education: [],
                workExperience: [],
                resumes: []
            };

            mockValidateCandidateData.mockImplementation(() => {});
            mockCandidate.mockImplementation(() => mockCandidateInstance as any);

            // Act
            const result = await addCandidate(candidateData);

            // Assert
            expect(mockResume).not.toHaveBeenCalled();
            expect(result).toEqual(mockSavedCandidate);
        });
    });

    describe('Error Handling', () => {
        it('should throw error when validation fails', async () => {
            // Arrange
            const candidateData = { name: '', email: 'invalid-email' };
            const validationError = 'Invalid candidate data';
            mockValidateCandidateData.mockImplementation(() => {
                throw new Error(validationError);
            });

            // Act & Assert
            await expect(addCandidate(candidateData)).rejects.toThrow(validationError);
            expect(mockCandidate).not.toHaveBeenCalled();
        });

        it('should throw specific error for duplicate email (P2002)', async () => {
            // Arrange
            const candidateData = {
                name: 'Duplicate User',
                email: 'existing@example.com'
            };

            const mockCandidateInstance = {
                save: jest.fn().mockRejectedValue({ code: 'P2002' }),
                education: [],
                workExperience: [],
                resumes: []
            };

            mockValidateCandidateData.mockImplementation(() => {});
            mockCandidate.mockImplementation(() => mockCandidateInstance as any);

            // Act & Assert
            await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
        });

        it('should propagate generic database errors', async () => {
            // Arrange
            const candidateData = {
                name: 'Test User',
                email: 'test@example.com'
            };

            const dbError = new Error('Database connection failed');
            const mockCandidateInstance = {
                save: jest.fn().mockRejectedValue(dbError),
                education: [],
                workExperience: [],
                resumes: []
            };

            mockValidateCandidateData.mockImplementation(() => {});
            mockCandidate.mockImplementation(() => mockCandidateInstance as any);

            // Act & Assert
            await expect(addCandidate(candidateData)).rejects.toThrow('Database connection failed');
        });

        it('should handle education save failure', async () => {
            // Arrange
            const candidateData = {
                name: 'Test User',
                email: 'test@example.com',
                educations: [{ degree: 'Bachelor', institution: 'University' }]
            };

            const mockSavedCandidate = { id: 5, ...candidateData };
            const mockCandidateInstance = {
                save: jest.fn().mockResolvedValue(mockSavedCandidate),
                education: [],
                workExperience: [],
                resumes: []
            };

            const educationError = new Error('Education save failed');
            const mockEducationInstance = {
                save: jest.fn().mockRejectedValue(educationError),
                candidateId: null
            };

            mockValidateCandidateData.mockImplementation(() => {});
            mockCandidate.mockImplementation(() => mockCandidateInstance as any);
            mockEducation.mockImplementation(() => mockEducationInstance as any);

            // Act & Assert
            await expect(addCandidate(candidateData)).rejects.toThrow('Education save failed');
        });

        it('should handle work experience save failure', async () => {
            // Arrange
            const candidateData = {
                name: 'Test User',
                email: 'test@example.com',
                workExperiences: [{ company: 'Company', position: 'Developer' }]
            };

            const mockSavedCandidate = { id: 6, ...candidateData };
            const mockCandidateInstance = {
                save: jest.fn().mockResolvedValue(mockSavedCandidate),
                education: [],
                workExperience: [],
                resumes: []
            };

            const workExperienceError = new Error('Work experience save failed');
            const mockWorkExperienceInstance = {
                save: jest.fn().mockRejectedValue(workExperienceError),
                candidateId: null
            };

            mockValidateCandidateData.mockImplementation(() => {});
            mockCandidate.mockImplementation(() => mockCandidateInstance as any);
            mockWorkExperience.mockImplementation(() => mockWorkExperienceInstance as any);

            // Act & Assert
            await expect(addCandidate(candidateData)).rejects.toThrow('Work experience save failed');
        });

        it('should handle resume save failure', async () => {
            // Arrange
            const candidateData = {
                name: 'Test User',
                email: 'test@example.com',
                cv: { fileName: 'resume.pdf', content: 'base64content' }
            };

            const mockSavedCandidate = { id: 7, ...candidateData };
            const mockCandidateInstance = {
                save: jest.fn().mockResolvedValue(mockSavedCandidate),
                education: [],
                workExperience: [],
                resumes: []
            };

            const resumeError = new Error('Resume save failed');
            const mockResumeInstance = {
                save: jest.fn().mockRejectedValue(resumeError),
                candidateId: null
            };

            mockValidateCandidateData.mockImplementation(() => {});
            mockCandidate.mockImplementation(() => mockCandidateInstance as any);
            mockResume.mockImplementation(() => mockResumeInstance as any);

            // Act & Assert
            await expect(addCandidate(candidateData)).rejects.toThrow('Resume save failed');
        });
    });

    describe('Multiple Records Handling', () => {
        it('should handle multiple educations and work experiences', async () => {
            // Arrange
            const candidateData = {
                name: 'Multi User',
                email: 'multi@example.com',
                educations: [
                    { degree: 'Bachelor', institution: 'University A' },
                    { degree: 'Master', institution: 'University B' }
                ],
                workExperiences: [
                    { company: 'Company A', position: 'Junior Dev' },
                    { company: 'Company B', position: 'Senior Dev' },
                    { company: 'Company C', position: 'Tech Lead' }
                ]
            };

            const mockSavedCandidate = { id: 8, ...candidateData };
            const mockCandidateInstance = {
                save: jest.fn().mockResolvedValue(mockSavedCandidate),
                education: [],
                workExperience: [],
                resumes: []
            };

            const mockEducationInstance = { save: jest.fn().mockResolvedValue({}), candidateId: null };
            const mockWorkExperienceInstance = { save: jest.fn().mockResolvedValue({}), candidateId: null };

            mockValidateCandidateData.mockImplementation(() => {});
            mockCandidate.mockImplementation(() => mockCandidateInstance as any);
            mockEducation.mockImplementation(() => mockEducationInstance as any);
            mockWorkExperience.mockImplementation(() => mockWorkExperienceInstance as any);

            // Act
            const result = await addCandidate(candidateData);

            // Assert
            expect(mockEducation).toHaveBeenCalledTimes(2);
            expect(mockWorkExperience).toHaveBeenCalledTimes(3);
            expect(mockEducationInstance.save).toHaveBeenCalledTimes(2);
            expect(mockWorkExperienceInstance.save).toHaveBeenCalledTimes(3);
            expect(result).toEqual(mockSavedCandidate);
        });
    });
});

describe('fileUploadService - uploadFile', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockUploadSingle: jest.Mock;
    let mockMulterInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        mockUploadSingle = jest.fn();
        mockMulterInstance = {
            single: jest.fn().mockReturnValue(mockUploadSingle)
        };

        mockMulter.mockReturnValue(mockMulterInstance);
    });

    describe('Happy Path', () => {
        it('should successfully upload a PDF file', () => {
            // Arrange
            const mockFile = {
                path: '../uploads/1234567890-resume.pdf',
                mimetype: 'application/pdf',
                originalname: 'resume.pdf'
            };

            mockReq.file = mockFile as Express.Multer.File;
            mockUploadSingle.mockImplementation((req, res, callback) => {
                callback(null);
            });

            // Act
            uploadFile(mockReq as Request, mockRes as Response);

            // Assert
            expect(mockMulterInstance.single).toHaveBeenCalledWith('file');
            expect(mockUploadSingle).toHaveBeenCalledWith(mockReq, mockRes, expect.any(Function));
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                filePath: '../uploads/1234567890-resume.pdf',
                fileType: 'application/pdf'
            });
        });

        it('should successfully upload a DOCX file', () => {
            // Arrange
            const mockFile = {
                path: '../uploads/1234567890-resume.docx',
                mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                originalname: 'resume.docx'
            };

            mockReq.file = mockFile as Express.Multer.File;
            mockUploadSingle.mockImplementation((req, res, callback) => {
                callback(null);
            });

            // Act
            uploadFile(mockReq as Request, mockRes as Response);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                filePath: '../uploads/1234567890-resume.docx',
                fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle MulterError with specific error message', () => {
            // Arrange
            const multerError = new multer.MulterError('LIMIT_FILE_SIZE', 'file');
            multerError.message = 'File too large';
            
            mockUploadSingle.mockImplementation((req, res, callback) => {
                callback(multerError);
            });

            // Act
            uploadFile(mockReq as Request, mockRes as Response);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'File too large'
            });
        });

        it('should handle generic errors', () => {
            // Arrange
            const genericError = new Error('Network error');
            
            mockUploadSingle.mockImplementation((req, res, callback) => {
                callback(genericError);
            });

            // Act
            uploadFile(mockReq as Request, mockRes as Response);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Network error'
            });
        });

        it('should handle invalid file type when no file is uploaded', () => {
            // Arrange
            mockReq.file = undefined;
            mockUploadSingle.mockImplementation((req, res, callback) => {
                callback(null);
            });

            // Act
            uploadFile(mockReq as Request, mockRes as Response);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Invalid file type, only PDF and DOCX are allowed!'
            });
        });

        it('should handle file size limit error', () => {
            // Arrange
            const fileSizeError = new multer.MulterError('LIMIT_FILE_SIZE', 'file');
            fileSizeError.message = 'File size limit exceeded';
            
            mockUploadSingle.mockImplementation((req, res, callback) => {
                callback(fileSizeError);
            });

            // Act
            uploadFile(mockReq as Request, mockRes as Response);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'File size limit exceeded'
            });
        });

        it('should handle unexpected field error', () => {
            // Arrange
            const unexpectedFieldError = new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'file');
            unexpectedFieldError.message = 'Unexpected field';
            
            mockUploadSingle.mockImplementation((req, res, callback) => {
                callback(unexpectedFieldError);
            });

            // Act
            uploadFile(mockReq as Request, mockRes as Response);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Unexpected field'
            });
        });
    });

    describe('File Filter Scenarios', () => {
        it('should reject file when filter returns false (simulated by no file)', () => {
            // Arrange - This simulates the fileFilter rejecting the file
            mockReq.file = undefined;
            mockUploadSingle.mockImplementation((req, res, callback) => {
                // Simulate file being rejected by filter
                callback(null);
            });

            // Act
            uploadFile(mockReq as Request, mockRes as Response);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Invalid file type, only PDF and DOCX are allowed!'
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle file with special characters in name', () => {
            // Arrange
            const mockFile = {
                path: '../uploads/1234567890-résumé-español.pdf',
                mimetype: 'application/pdf',
                originalname: 'résumé-español.pdf'
            };

            mockReq.file = mockFile as Express.Multer.File;
            mockUploadSingle.mockImplementation((req, res, callback) => {
                callback(null);
            });

            // Act
            uploadFile(mockReq as Request, mockRes as Response);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                filePath: '../uploads/1234567890-résumé-español.pdf',
                fileType: 'application/pdf'
            });
        });

        it('should handle empty file path', () => {
            // Arrange
            const mockFile = {
                path: '',
                mimetype: 'application/pdf',
                originalname: 'resume.pdf'
            };

            mockReq.file = mockFile as Express.Multer.File;
            mockUploadSingle.mockImplementation((req, res, callback) => {
                callback(null);
            });

            // Act
            uploadFile(mockReq as Request, mockRes as Response);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                filePath: '',
                fileType: 'application/pdf'
            });
        });
    });

    describe('Multer Configuration', () => {
        it('should call multer with correct configuration', () => {
            // Act
            uploadFile(mockReq as Request, mockRes as Response);

            // Assert
            expect(mockMulter).toHaveBeenCalledWith({
                storage: expect.any(Object),
                limits: {
                    fileSize: 1024 * 1024 * 10 // 10MB
                },
                fileFilter: expect.any(Function)
            });
        });
    });
});