// Mock Prisma Client - shared instance for all models
// This must be defined before any imports that use PrismaClient
const mockPrismaClient = {
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

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn(() => mockPrismaClient),
        Prisma: {
            PrismaClientInitializationError: class PrismaClientInitializationError extends Error {
                code = 'P2000';
            },
        },
    };
});

import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { validateCandidateData } from '../application/validator';
import { addCandidate } from '../application/services/candidateService';
import { addCandidateController } from '../presentation/controllers/candidateController';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';

describe('Historia de Usuario #1 y #2: Sistema de Seguimiento de Talento', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ============================================
    // TESTS PARA VALIDADOR (validator.ts)
    // ============================================

    describe('Validator - validateCandidateData', () => {
        describe('Validación de firstName y lastName', () => {
            test.each([
                { field: 'firstName', value: 'Juan', description: 'nombre válido simple' },
                { field: 'firstName', value: 'María José', description: 'nombre con espacio' },
                { field: 'firstName', value: 'José', description: 'nombre con acento' },
                { field: 'firstName', value: 'Niño', description: 'nombre con ñ' },
                { field: 'firstName', value: 'A'.repeat(100), description: 'nombre con longitud máxima (100 caracteres)' },
                { field: 'firstName', value: 'Ab', description: 'nombre con longitud mínima (2 caracteres)' },
                { field: 'lastName', value: 'García', description: 'apellido válido simple' },
                { field: 'lastName', value: 'García López', description: 'apellido compuesto' },
                { field: 'lastName', value: 'Muñoz', description: 'apellido con ñ' },
            ])('debe aceptar $field cuando tiene $description', ({ field, value }) => {
                // Arrange
                const validData = {
                    firstName: field === 'firstName' ? value : 'Juan',
                    lastName: field === 'lastName' ? value : 'García',
                    email: 'test@example.com',
                };

                // Act & Assert
                expect(() => validateCandidateData(validData)).not.toThrow();
            });

            test.each([
                { field: 'firstName', value: '', description: 'está vacío' },
                { field: 'firstName', value: 'A', description: 'tiene menos de 2 caracteres' },
                { field: 'firstName', value: 'A'.repeat(101), description: 'excede 100 caracteres' },
                { field: 'firstName', value: 'Juan123', description: 'contiene números' },
                { field: 'firstName', value: 'Juan@', description: 'contiene caracteres especiales no permitidos' },
                { field: 'firstName', value: undefined, description: 'es undefined' },
                { field: 'firstName', value: null, description: 'es null' },
                { field: 'lastName', value: '', description: 'está vacío' },
                { field: 'lastName', value: 'G', description: 'tiene menos de 2 caracteres' },
                { field: 'lastName', value: 'G'.repeat(101), description: 'excede 100 caracteres' },
                { field: 'lastName', value: 'García123', description: 'contiene números' },
            ])('debe lanzar error cuando $field $description', ({ field, value }) => {
                // Arrange
                const invalidData: any = {
                    firstName: field === 'firstName' ? value : 'Juan',
                    lastName: field === 'lastName' ? value : 'García',
                    email: 'test@example.com',
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
            });
        });

        describe('Validación de email', () => {
            test.each([
                { email: 'test@example.com', description: 'formato estándar' },
                { email: 'user.name@example.co.uk', description: 'con subdominio y múltiples puntos' },
                { email: 'user+tag@example.com', description: 'con signo más' },
                { email: 'user_name@example.com', description: 'con guion bajo' },
                { email: 'user-name@example.com', description: 'con guion' },
                { email: 'user123@example.com', description: 'con números' },
                { email: 'user.name+tag@sub.example.com', description: 'complejo válido' },
            ])('debe aceptar email cuando tiene $description', ({ email }) => {
                // Arrange
                const validData = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email,
                };

                // Act & Assert
                expect(() => validateCandidateData(validData)).not.toThrow();
            });

            test.each([
                { email: '', description: 'está vacío' },
                { email: 'invalid-email', description: 'no tiene @' },
                { email: '@example.com', description: 'no tiene parte local' },
                { email: 'user@', description: 'no tiene dominio' },
                { email: 'user@example', description: 'no tiene TLD' },
                { email: 'user @example.com', description: 'tiene espacio' },
                { email: 'user@exam ple.com', description: 'tiene espacio en dominio' },
                { email: undefined, description: 'es undefined' },
                { email: null, description: 'es null' },
            ])('debe lanzar error cuando el email $description', ({ email }) => {
                // Arrange
                const invalidData: any = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email,
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
            });
        });

        describe('Validación de phone', () => {
            test.each([
                { phone: '612345678', description: 'comienza con 6' },
                { phone: '712345678', description: 'comienza con 7' },
                { phone: '912345678', description: 'comienza con 9' },
                { phone: undefined, description: 'es undefined (opcional)' },
                { phone: null, description: 'es null (opcional)' },
            ])('debe aceptar phone cuando $description', ({ phone }) => {
                // Arrange
                const validData: any = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    phone,
                };

                // Act & Assert
                expect(() => validateCandidateData(validData)).not.toThrow();
            });

            test.each([
                { phone: '512345678', description: 'comienza con 5' },
                { phone: '812345678', description: 'comienza con 8' },
                { phone: '61234567', description: 'tiene menos de 9 dígitos' },
                { phone: '6123456789', description: 'tiene más de 9 dígitos' },
                { phone: '61234567a', description: 'contiene letras' },
                { phone: '612-345-678', description: 'contiene guiones' },
                { phone: '+34612345678', description: 'contiene prefijo internacional' },
            ])('debe lanzar error cuando el phone $description', ({ phone }) => {
                // Arrange
                const invalidData = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    phone,
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow('Invalid phone');
            });
        });

        describe('Validación de address', () => {
            test.each([
                { address: 'Calle Principal 123', description: 'dirección válida' },
                { address: 'A'.repeat(100), description: 'dirección con longitud máxima (100 caracteres)' },
                { address: undefined, description: 'es undefined (opcional)' },
                { address: null, description: 'es null (opcional)' },
                { address: '', description: 'está vacío (opcional)' },
            ])('debe aceptar address cuando $description', ({ address }) => {
                // Arrange
                const validData: any = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    address,
                };

                // Act & Assert
                expect(() => validateCandidateData(validData)).not.toThrow();
            });

            test('debe lanzar error cuando address excede 100 caracteres', () => {
                // Arrange
                const invalidData = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    address: 'A'.repeat(101),
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow('Invalid address');
            });
        });

        describe('Validación de educations', () => {
            test('debe aceptar educations válidas', () => {
                // Arrange
                const validData = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    educations: [
                        {
                            institution: 'Universidad de Madrid',
                            title: 'Ingeniería Informática',
                            startDate: '2020-09-01',
                            endDate: '2024-06-30',
                        },
                        {
                            institution: 'Instituto Tecnológico',
                            title: 'Bachillerato',
                            startDate: '2018-09-01',
                        },
                    ],
                };

                // Act & Assert
                expect(() => validateCandidateData(validData)).not.toThrow();
            });

            test.each([
                { field: 'institution', value: '', description: 'institución está vacía' },
                { field: 'institution', value: 'A'.repeat(101), description: 'institución excede 100 caracteres' },
                { field: 'institution', value: undefined, description: 'institución es undefined' },
                { field: 'title', value: '', description: 'título está vacío' },
                { field: 'title', value: 'A'.repeat(101), description: 'título excede 100 caracteres' },
                { field: 'title', value: undefined, description: 'título es undefined' },
            ])('debe lanzar error cuando $field en education $description', ({ field, value }) => {
                // Arrange
                const invalidData: any = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    educations: [
                        {
                            institution: field === 'institution' ? value : 'Universidad',
                            title: field === 'title' ? value : 'Título',
                            startDate: '2020-09-01',
                        },
                    ],
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow();
            });

            test.each([
                { date: '', description: 'startDate está vacío' },
                { date: '2020/09/01', description: 'startDate tiene formato incorrecto' },
                { date: '01-09-2020', description: 'startDate tiene formato DD-MM-YYYY' },
                { date: '20-09-01', description: 'startDate tiene formato YY-MM-DD' },
                { date: undefined, description: 'startDate es undefined' },
                { date: null, description: 'startDate es null' },
            ])('debe lanzar error cuando $description', ({ date }) => {
                // Arrange
                const invalidData: any = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    educations: [
                        {
                            institution: 'Universidad',
                            title: 'Título',
                            startDate: date,
                        },
                    ],
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow('Invalid date');
            });

            test('debe lanzar error cuando endDate tiene formato incorrecto', () => {
                // Arrange
                const invalidData = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    educations: [
                        {
                            institution: 'Universidad',
                            title: 'Título',
                            startDate: '2020-09-01',
                            endDate: '2024/06/30',
                        },
                    ],
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow('Invalid end date');
            });

            test('debe aceptar endDate cuando es undefined (opcional)', () => {
                // Arrange
                const validData = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    educations: [
                        {
                            institution: 'Universidad',
                            title: 'Título',
                            startDate: '2020-09-01',
                            endDate: undefined,
                        },
                    ],
                };

                // Act & Assert
                expect(() => validateCandidateData(validData)).not.toThrow();
            });
        });

        describe('Validación de workExperiences', () => {
            test('debe aceptar workExperiences válidas', () => {
                // Arrange
                const validData = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    workExperiences: [
                        {
                            company: 'Tech Corp',
                            position: 'Desarrollador Senior',
                            description: 'Desarrollo de aplicaciones web',
                            startDate: '2020-01-15',
                            endDate: '2023-12-31',
                        },
                        {
                            company: 'Startup XYZ',
                            position: 'Desarrollador Junior',
                            startDate: '2018-06-01',
                        },
                    ],
                };

                // Act & Assert
                expect(() => validateCandidateData(validData)).not.toThrow();
            });

            test.each([
                { field: 'company', value: '', description: 'empresa está vacía' },
                { field: 'company', value: 'A'.repeat(101), description: 'empresa excede 100 caracteres' },
                { field: 'company', value: undefined, description: 'empresa es undefined' },
                { field: 'position', value: '', description: 'puesto está vacío' },
                { field: 'position', value: 'A'.repeat(101), description: 'puesto excede 100 caracteres' },
                { field: 'position', value: undefined, description: 'puesto es undefined' },
            ])('debe lanzar error cuando $field en workExperience $description', ({ field, value }) => {
                // Arrange
                const invalidData: any = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    workExperiences: [
                        {
                            company: field === 'company' ? value : 'Tech Corp',
                            position: field === 'position' ? value : 'Desarrollador',
                            startDate: '2020-01-15',
                        },
                    ],
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow();
            });

            test('debe lanzar error cuando description excede 200 caracteres', () => {
                // Arrange
                const invalidData = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    workExperiences: [
                        {
                            company: 'Tech Corp',
                            position: 'Desarrollador',
                            description: 'A'.repeat(201),
                            startDate: '2020-01-15',
                        },
                    ],
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow('Invalid description');
            });

            test('debe aceptar description cuando es undefined (opcional)', () => {
                // Arrange
                const validData = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    workExperiences: [
                        {
                            company: 'Tech Corp',
                            position: 'Desarrollador',
                            description: undefined,
                            startDate: '2020-01-15',
                        },
                    ],
                };

                // Act & Assert
                expect(() => validateCandidateData(validData)).not.toThrow();
            });

            test.each([
                { date: '', description: 'startDate está vacío' },
                { date: '2020/01/15', description: 'startDate tiene formato incorrecto' },
                { date: undefined, description: 'startDate es undefined' },
            ])('debe lanzar error cuando $description en workExperience', ({ date }) => {
                // Arrange
                const invalidData: any = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    workExperiences: [
                        {
                            company: 'Tech Corp',
                            position: 'Desarrollador',
                            startDate: date,
                        },
                    ],
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow('Invalid date');
            });

            test('debe lanzar error cuando endDate tiene formato incorrecto', () => {
                // Arrange
                const invalidData = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    workExperiences: [
                        {
                            company: 'Tech Corp',
                            position: 'Desarrollador',
                            startDate: '2020-01-15',
                            endDate: '2023/12/31',
                        },
                    ],
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow('Invalid end date');
            });
        });

        describe('Validación de CV', () => {
            test('debe aceptar CV válido', () => {
                // Arrange
                const validData = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    cv: {
                        filePath: '/uploads/cv.pdf',
                        fileType: 'application/pdf',
                    },
                };

                // Act & Assert
                expect(() => validateCandidateData(validData)).not.toThrow();
            });

            test.each([
                { cv: undefined, description: 'cv es undefined' },
                { cv: null, description: 'cv es null' },
                { cv: {}, description: 'cv es objeto vacío' },
            ])('debe aceptar cuando $description (opcional)', ({ cv }) => {
                // Arrange
                const validData: any = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    cv,
                };

                // Act & Assert
                expect(() => validateCandidateData(validData)).not.toThrow();
            });

            test.each([
                { cv: { filePath: '', fileType: 'application/pdf' }, description: 'filePath está vacío' },
                { cv: { filePath: '/uploads/cv.pdf', fileType: '' }, description: 'fileType está vacío' },
                { cv: { filePath: undefined, fileType: 'application/pdf' }, description: 'filePath es undefined' },
                { cv: { filePath: '/uploads/cv.pdf', fileType: undefined }, description: 'fileType es undefined' },
                { cv: { filePath: 123, fileType: 'application/pdf' }, description: 'filePath no es string' },
                { cv: { filePath: '/uploads/cv.pdf', fileType: 123 }, description: 'fileType no es string' },
                { cv: 'not-an-object', description: 'cv no es un objeto' },
            ])('debe lanzar error cuando $description', ({ cv }) => {
                // Arrange
                const invalidData: any = {
                    firstName: 'Juan',
                    lastName: 'García',
                    email: 'test@example.com',
                    cv,
                };

                // Act & Assert
                expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
            });
        });

        describe('Validación de datos completos', () => {
            test('debe aceptar datos completos válidos con todos los campos', () => {
                // Arrange
                const completeValidData = {
                    firstName: 'Juan',
                    lastName: 'García López',
                    email: 'juan.garcia@example.com',
                    phone: '612345678',
                    address: 'Calle Principal 123, Madrid',
                    educations: [
                        {
                            institution: 'Universidad Complutense de Madrid',
                            title: 'Ingeniería Informática',
                            startDate: '2020-09-01',
                            endDate: '2024-06-30',
                        },
                    ],
                    workExperiences: [
                        {
                            company: 'Tech Solutions S.L.',
                            position: 'Desarrollador Full Stack',
                            description: 'Desarrollo de aplicaciones web con React y Node.js',
                            startDate: '2022-01-15',
                            endDate: '2023-12-31',
                        },
                    ],
                    cv: {
                        filePath: '/uploads/juan_garcia_cv.pdf',
                        fileType: 'application/pdf',
                    },
                };

                // Act & Assert
                expect(() => validateCandidateData(completeValidData)).not.toThrow();
            });

            test('debe aceptar datos mínimos válidos (solo campos requeridos)', () => {
                // Arrange
                const minimalValidData = {
                    firstName: 'María',
                    lastName: 'González',
                    email: 'maria@example.com',
                };

                // Act & Assert
                expect(() => validateCandidateData(minimalValidData)).not.toThrow();
            });

            test('debe omitir validación cuando se proporciona id (edición)', () => {
                // Arrange
                const dataWithId = {
                    id: 1,
                    firstName: '', // Incluso con datos inválidos, no debe validar
                    lastName: '',
                    email: 'invalid-email',
                };

                // Act & Assert
                expect(() => validateCandidateData(dataWithId)).not.toThrow();
            });
        });
    });

    // ============================================
    // TESTS PARA CANDIDATE SERVICE (candidateService.ts)
    // ============================================

    describe('Candidate Service - addCandidate', () => {
        const mockValidCandidateData = {
            firstName: 'Juan',
            lastName: 'García',
            email: 'juan@example.com',
            phone: '612345678',
            address: 'Calle Principal 123',
            educations: [
                {
                    institution: 'Universidad de Madrid',
                    title: 'Ingeniería Informática',
                    startDate: '2020-09-01',
                    endDate: '2024-06-30',
                },
            ],
            workExperiences: [
                {
                    company: 'Tech Corp',
                    position: 'Desarrollador',
                    description: 'Desarrollo de aplicaciones',
                    startDate: '2022-01-15',
                    endDate: '2023-12-31',
                },
            ],
            cv: {
                filePath: '/uploads/cv.pdf',
                fileType: 'application/pdf',
            },
        };

        beforeEach(() => {
            // Mock Candidate.save()
            jest.spyOn(Candidate.prototype, 'save').mockResolvedValue({
                id: 1,
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
                phone: '612345678',
                address: 'Calle Principal 123',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any);

            // Mock Education.save()
            jest.spyOn(Education.prototype, 'save').mockResolvedValue({
                id: 1,
                institution: 'Universidad de Madrid',
                title: 'Ingeniería Informática',
                startDate: new Date('2020-09-01'),
                endDate: new Date('2024-06-30'),
                candidateId: 1,
            } as any);

            // Mock WorkExperience.save()
            jest.spyOn(WorkExperience.prototype, 'save').mockResolvedValue({
                id: 1,
                company: 'Tech Corp',
                position: 'Desarrollador',
                description: 'Desarrollo de aplicaciones',
                startDate: new Date('2022-01-15'),
                endDate: new Date('2023-12-31'),
                candidateId: 1,
            } as any);

            // Mock Resume.save()
            jest.spyOn(Resume.prototype, 'save').mockResolvedValue({
                id: 1,
                candidateId: 1,
                filePath: '/uploads/cv.pdf',
                fileType: 'application/pdf',
                uploadDate: new Date(),
            } as any);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('debe crear candidato exitosamente con todos los datos', async () => {
            // Arrange
            const candidateData = { ...mockValidCandidateData };

            // Act
            const result = await addCandidate(candidateData);

            // Assert
            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(result.firstName).toBe('Juan');
            expect(result.lastName).toBe('García');
            expect(result.email).toBe('juan@example.com');
            expect(Candidate.prototype.save).toHaveBeenCalledTimes(1);
            expect(Education.prototype.save).toHaveBeenCalledTimes(1);
            expect(WorkExperience.prototype.save).toHaveBeenCalledTimes(1);
            expect(Resume.prototype.save).toHaveBeenCalledTimes(1);
        });

        test('debe crear candidato exitosamente sin campos opcionales', async () => {
            // Arrange
            const minimalData = {
                firstName: 'María',
                lastName: 'González',
                email: 'maria@example.com',
            };

            // Act
            const result = await addCandidate(minimalData);

            // Assert
            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(Candidate.prototype.save).toHaveBeenCalledTimes(1);
            expect(Education.prototype.save).not.toHaveBeenCalled();
            expect(WorkExperience.prototype.save).not.toHaveBeenCalled();
            expect(Resume.prototype.save).not.toHaveBeenCalled();
        });

        test('debe crear candidato con múltiples educations', async () => {
            // Arrange
            const candidateData = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
                educations: [
                    {
                        institution: 'Universidad 1',
                        title: 'Título 1',
                        startDate: '2020-09-01',
                    },
                    {
                        institution: 'Universidad 2',
                        title: 'Título 2',
                        startDate: '2018-09-01',
                    },
                ],
            };

            // Act
            await addCandidate(candidateData);

            // Assert
            expect(Education.prototype.save).toHaveBeenCalledTimes(2);
        });

        test('debe crear candidato con múltiples workExperiences', async () => {
            // Arrange
            const candidateData = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
                workExperiences: [
                    {
                        company: 'Empresa 1',
                        position: 'Puesto 1',
                        startDate: '2020-01-15',
                    },
                    {
                        company: 'Empresa 2',
                        position: 'Puesto 2',
                        startDate: '2022-01-15',
                    },
                ],
            };

            // Act
            await addCandidate(candidateData);

            // Assert
            expect(WorkExperience.prototype.save).toHaveBeenCalledTimes(2);
        });

        test('debe lanzar error cuando los datos de validación son inválidos', async () => {
            // Arrange
            const invalidData = {
                firstName: '', // Inválido
                lastName: 'García',
                email: 'juan@example.com',
            };

            // Act & Assert
            await expect(addCandidate(invalidData)).rejects.toThrow('Invalid name');
            expect(Candidate.prototype.save).not.toHaveBeenCalled();
        });

        test('debe lanzar error cuando el email ya existe en la base de datos (P2002)', async () => {
            // Arrange
            const duplicateEmailData = { ...mockValidCandidateData };
            const prismaError = new Error('Unique constraint failed');
            (prismaError as any).code = 'P2002';

            jest.spyOn(Candidate.prototype, 'save').mockRejectedValue(prismaError);

            // Act & Assert
            await expect(addCandidate(duplicateEmailData)).rejects.toThrow(
                'The email already exists in the database'
            );
        });

        test('debe propagar otros errores de Prisma sin modificar el mensaje', async () => {
            // Arrange
            const candidateData = { ...mockValidCandidateData };
            const prismaError = new Error('Database connection error');
            (prismaError as any).code = 'P1001';

            jest.spyOn(Candidate.prototype, 'save').mockRejectedValue(prismaError);

            // Act & Assert
            await expect(addCandidate(candidateData)).rejects.toThrow('Database connection error');
        });

        test('debe asignar candidateId a educations después de crear el candidato', async () => {
            // Arrange
            const candidateData = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
                educations: [
                    {
                        institution: 'Universidad',
                        title: 'Título',
                        startDate: '2020-09-01',
                    },
                ],
            };

            // Act
            await addCandidate(candidateData);

            // Assert
            expect(Education.prototype.save).toHaveBeenCalled();
            const educationInstance = (Education.prototype.save as jest.Mock).mock.contexts[0];
            expect(educationInstance.candidateId).toBe(1);
        });

        test('debe asignar candidateId a workExperiences después de crear el candidato', async () => {
            // Arrange
            const candidateData = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
                workExperiences: [
                    {
                        company: 'Tech Corp',
                        position: 'Desarrollador',
                        startDate: '2020-01-15',
                    },
                ],
            };

            // Act
            await addCandidate(candidateData);

            // Assert
            expect(WorkExperience.prototype.save).toHaveBeenCalled();
            const workExperienceInstance = (WorkExperience.prototype.save as jest.Mock).mock.contexts[0];
            expect(workExperienceInstance.candidateId).toBe(1);
        });

        test('debe asignar candidateId a resume después de crear el candidato', async () => {
            // Arrange
            const candidateData = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
                cv: {
                    filePath: '/uploads/cv.pdf',
                    fileType: 'application/pdf',
                },
            };

            // Act
            await addCandidate(candidateData);

            // Assert
            expect(Resume.prototype.save).toHaveBeenCalled();
            const resumeInstance = (Resume.prototype.save as jest.Mock).mock.contexts[0];
            expect(resumeInstance.candidateId).toBe(1);
        });

        test('debe crear candidato sin CV cuando cv es objeto vacío', async () => {
            // Arrange
            const candidateData = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
                cv: {},
            };

            // Act
            await addCandidate(candidateData);

            // Assert
            expect(Resume.prototype.save).not.toHaveBeenCalled();
        });
    });

    // ============================================
    // TESTS PARA CANDIDATE CONTROLLER (candidateController.ts)
    // ============================================

    describe('Candidate Controller - addCandidateController', () => {
        let mockRequest: Partial<Request>;
        let mockResponse: Partial<Response>;
        let mockJson: jest.Mock;
        let mockStatus: jest.Mock;

        beforeEach(() => {
            mockJson = jest.fn().mockReturnThis();
            mockStatus = jest.fn().mockReturnValue({ json: mockJson });
            mockResponse = {
                status: mockStatus,
                json: mockJson,
            };
            mockRequest = {
                body: {},
            };
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        test('debe retornar status 201 y mensaje de éxito cuando el candidato se crea correctamente', async () => {
            // Arrange
            const savedCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
                phone: '612345678',
                address: 'Calle Principal 123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(require('../application/services/candidateService'), 'addCandidate').mockResolvedValue(
                savedCandidate as any
            );

            mockRequest.body = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
            };

            // Act
            await addCandidateController(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Candidate added successfully',
                data: savedCandidate,
            });
        });

        test('debe retornar status 400 y mensaje de error cuando falla la validación', async () => {
            // Arrange
            const validationError = new Error('Invalid name');
            jest.spyOn(require('../application/services/candidateService'), 'addCandidate').mockRejectedValue(
                validationError
            );

            mockRequest.body = {
                firstName: '', // Inválido
                lastName: 'García',
                email: 'juan@example.com',
            };

            // Act
            await addCandidateController(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'Invalid name',
            });
        });

        test('debe retornar status 400 y mensaje de error cuando el email ya existe', async () => {
            // Arrange
            const duplicateEmailError = new Error('The email already exists in the database');
            jest.spyOn(require('../application/services/candidateService'), 'addCandidate').mockRejectedValue(
                duplicateEmailError
            );

            mockRequest.body = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'existing@example.com',
            };

            // Act
            await addCandidateController(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'The email already exists in the database',
            });
        });

        test('debe retornar status 400 y mensaje de error genérico cuando el error no es una instancia de Error', async () => {
            // Arrange
            jest.spyOn(require('../application/services/candidateService'), 'addCandidate').mockRejectedValue(
                'String error'
            );

            mockRequest.body = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
            };

            // Act
            await addCandidateController(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'Unknown error',
            });
        });

        test('debe retornar status 400 cuando hay error de conexión a la base de datos', async () => {
            // Arrange
            const dbError = new Error('No se pudo conectar con la base de datos');
            jest.spyOn(require('../application/services/candidateService'), 'addCandidate').mockRejectedValue(dbError);

            mockRequest.body = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
            };

            // Act
            await addCandidateController(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'No se pudo conectar con la base de datos',
            });
        });
    });

    // ============================================
    // TESTS PARA DOMAIN MODELS
    // ============================================

    describe('Domain Models - Candidate.save()', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('debe crear un nuevo candidato en la base de datos', async () => {
            // Arrange
            const candidateData = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
                phone: '612345678',
                address: 'Calle Principal 123',
            };

            const mockCreatedCandidate = {
                id: 1,
                ...candidateData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrismaClient.candidate.create.mockResolvedValue(mockCreatedCandidate);

            const candidate = new Candidate(candidateData);

            // Act
            const result = await candidate.save();

            // Assert
            expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
                data: candidateData,
            });
            expect(result).toEqual(mockCreatedCandidate);
            expect(mockPrismaClient.candidate.update).not.toHaveBeenCalled();
        });

        test('debe crear candidato con educations relacionadas', async () => {
            // Arrange
            const candidateData = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
            };

            const mockCreatedCandidate = {
                id: 1,
                ...candidateData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrismaClient.candidate.create.mockResolvedValue(mockCreatedCandidate);

            const education = new Education({
                institution: 'Universidad',
                title: 'Título',
                startDate: '2020-09-01',
            });
            const candidate = new Candidate(candidateData);
            candidate.education.push(education);

            // Act
            await candidate.save();

            // Assert
            expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
                data: {
                    ...candidateData,
                    educations: {
                        create: [
                            {
                                institution: 'Universidad',
                                title: 'Título',
                                startDate: new Date('2020-09-01'),
                                endDate: undefined,
                            },
                        ],
                    },
                },
            });
        });

        test('debe crear candidato con workExperiences relacionadas', async () => {
            // Arrange
            const candidateData = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
            };

            const mockCreatedCandidate = {
                id: 1,
                ...candidateData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrismaClient.candidate.create.mockResolvedValue(mockCreatedCandidate);

            const workExperience = new WorkExperience({
                company: 'Tech Corp',
                position: 'Desarrollador',
                startDate: '2020-01-15',
            });
            const candidate = new Candidate(candidateData);
            candidate.workExperience.push(workExperience);

            // Act
            await candidate.save();

            // Assert
            expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
                data: {
                    ...candidateData,
                    workExperiences: {
                        create: [
                            {
                                company: 'Tech Corp',
                                position: 'Desarrollador',
                                description: undefined,
                                startDate: new Date('2020-01-15'),
                                endDate: undefined,
                            },
                        ],
                    },
                },
            });
        });

        test('debe crear candidato con resume relacionado', async () => {
            // Arrange
            const candidateData = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
            };

            const mockCreatedCandidate = {
                id: 1,
                ...candidateData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrismaClient.candidate.create.mockResolvedValue(mockCreatedCandidate);

            const resume = new Resume({
                filePath: '/uploads/cv.pdf',
                fileType: 'application/pdf',
            });
            const candidate = new Candidate(candidateData);
            candidate.resumes.push(resume);

            // Act
            await candidate.save();

            // Assert
            expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
                data: {
                    ...candidateData,
                    resumes: {
                        create: [
                            {
                                filePath: '/uploads/cv.pdf',
                                fileType: 'application/pdf',
                            },
                        ],
                    },
                },
            });
        });

        test('debe lanzar error cuando falla la conexión a la base de datos', async () => {
            // Arrange
            const candidateData = {
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
            };

            const dbError = Object.create(Prisma.PrismaClientInitializationError.prototype);
            dbError.message = 'Connection failed';
            mockPrismaClient.candidate.create.mockRejectedValue(dbError);

            const candidate = new Candidate(candidateData);

            // Act & Assert
            await expect(candidate.save()).rejects.toThrow(
                'No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.'
            );
        });

        test('debe actualizar candidato existente cuando se proporciona id', async () => {
            // Arrange
            const candidateData = {
                id: 1,
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
            };

            const mockUpdatedCandidate = {
                ...candidateData,
                updatedAt: new Date(),
            };

            mockPrismaClient.candidate.update.mockResolvedValue(mockUpdatedCandidate);

            const candidate = new Candidate(candidateData);

            // Act
            const result = await candidate.save();

            // Assert
            expect(mockPrismaClient.candidate.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    firstName: candidateData.firstName,
                    lastName: candidateData.lastName,
                    email: candidateData.email,
                },
            });
            expect(result).toEqual(mockUpdatedCandidate);
            expect(mockPrismaClient.candidate.create).not.toHaveBeenCalled();
        });

        test('debe lanzar error cuando no se encuentra el candidato para actualizar (P2025)', async () => {
            // Arrange
            const candidateData = {
                id: 999,
                firstName: 'Juan',
                lastName: 'García',
                email: 'juan@example.com',
            };

            const notFoundError = new Error('Record not found');
            (notFoundError as any).code = 'P2025';
            mockPrismaClient.candidate.update.mockRejectedValue(notFoundError);

            const candidate = new Candidate(candidateData);

            // Act & Assert
            await expect(candidate.save()).rejects.toThrow(
                'No se pudo encontrar el registro del candidato con el ID proporcionado.'
            );
        });
    });

    describe('Domain Models - Education.save()', () => {
        test('debe crear una nueva educación en la base de datos', async () => {
            // Arrange
            const educationData = {
                institution: 'Universidad de Madrid',
                title: 'Ingeniería Informática',
                startDate: '2020-09-01',
                endDate: '2024-06-30',
                candidateId: 1,
            };

            const mockCreatedEducation = {
                id: 1,
                ...educationData,
                startDate: new Date(educationData.startDate),
                endDate: new Date(educationData.endDate),
            };

            mockPrismaClient.education.create.mockResolvedValue(mockCreatedEducation);

            const education = new Education(educationData);

            // Act
            const result = await education.save();

            // Assert
            expect(mockPrismaClient.education.create).toHaveBeenCalledWith({
                data: {
                    institution: educationData.institution,
                    title: educationData.title,
                    startDate: new Date(educationData.startDate),
                    endDate: new Date(educationData.endDate),
                    candidateId: 1,
                },
            });
            expect(result).toEqual(mockCreatedEducation);
        });

        test('debe actualizar una educación existente cuando se proporciona id', async () => {
            // Arrange
            const educationData = {
                id: 1,
                institution: 'Universidad Actualizada',
                title: 'Título Actualizado',
                startDate: '2020-09-01',
                candidateId: 1,
            };

            const mockUpdatedEducation = {
                ...educationData,
                startDate: new Date(educationData.startDate),
            };

            mockPrismaClient.education.update.mockResolvedValue(mockUpdatedEducation);

            const education = new Education(educationData);

            // Act
            const result = await education.save();

            // Assert
            expect(mockPrismaClient.education.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    institution: educationData.institution,
                    title: educationData.title,
                    startDate: new Date(educationData.startDate),
                    endDate: undefined,
                    candidateId: 1,
                },
            });
            expect(result).toEqual(mockUpdatedEducation);
        });
    });

    describe('Domain Models - WorkExperience.save()', () => {
        test('debe crear una nueva experiencia laboral en la base de datos', async () => {
            // Arrange
            const workExperienceData = {
                company: 'Tech Corp',
                position: 'Desarrollador',
                description: 'Desarrollo de aplicaciones',
                startDate: '2020-01-15',
                endDate: '2023-12-31',
                candidateId: 1,
            };

            const mockCreatedWorkExperience = {
                id: 1,
                ...workExperienceData,
                startDate: new Date(workExperienceData.startDate),
                endDate: new Date(workExperienceData.endDate),
            };

            mockPrismaClient.workExperience.create.mockResolvedValue(mockCreatedWorkExperience);

            const workExperience = new WorkExperience(workExperienceData);

            // Act
            const result = await workExperience.save();

            // Assert
            expect(mockPrismaClient.workExperience.create).toHaveBeenCalledWith({
                data: {
                    company: workExperienceData.company,
                    position: workExperienceData.position,
                    description: workExperienceData.description,
                    startDate: new Date(workExperienceData.startDate),
                    endDate: new Date(workExperienceData.endDate),
                    candidateId: 1,
                },
            });
            expect(result).toEqual(mockCreatedWorkExperience);
        });

        test('debe actualizar una experiencia laboral existente cuando se proporciona id', async () => {
            // Arrange
            const workExperienceData = {
                id: 1,
                company: 'Nueva Empresa',
                position: 'Nuevo Puesto',
                startDate: '2022-01-15',
                candidateId: 1,
            };

            const mockUpdatedWorkExperience = {
                ...workExperienceData,
                startDate: new Date(workExperienceData.startDate),
            };

            mockPrismaClient.workExperience.update.mockResolvedValue(mockUpdatedWorkExperience);

            const workExperience = new WorkExperience(workExperienceData);

            // Act
            const result = await workExperience.save();

            // Assert
            expect(mockPrismaClient.workExperience.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    company: workExperienceData.company,
                    position: workExperienceData.position,
                    description: undefined,
                    startDate: new Date(workExperienceData.startDate),
                    endDate: undefined,
                    candidateId: 1,
                },
            });
            expect(result).toEqual(mockUpdatedWorkExperience);
        });
    });

    describe('Domain Models - Resume.save()', () => {
        test('debe crear un nuevo resume en la base de datos', async () => {
            // Arrange
            const resumeData = {
                candidateId: 1,
                filePath: '/uploads/cv.pdf',
                fileType: 'application/pdf',
            };

            const mockCreatedResume = {
                id: 1,
                ...resumeData,
                uploadDate: new Date(),
            };

            mockPrismaClient.resume.create.mockResolvedValue(mockCreatedResume);

            const resume = new Resume(resumeData);

            // Act
            const result = await resume.save();

            // Assert
            expect(mockPrismaClient.resume.create).toHaveBeenCalledWith({
                data: {
                    candidateId: 1,
                    filePath: '/uploads/cv.pdf',
                    fileType: 'application/pdf',
                    uploadDate: expect.any(Date),
                },
            });
            expect(result).toBeInstanceOf(Resume);
        });

        test('debe lanzar error cuando se intenta actualizar un resume existente', async () => {
            // Arrange
            const resumeData = {
                id: 1,
                candidateId: 1,
                filePath: '/uploads/cv.pdf',
                fileType: 'application/pdf',
            };

            const resume = new Resume(resumeData);

            // Act & Assert
            await expect(resume.save()).rejects.toThrow(
                'No se permite la actualización de un currículum existente.'
            );
        });
    });
});

