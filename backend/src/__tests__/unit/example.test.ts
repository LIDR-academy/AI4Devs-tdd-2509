import { createMockCandidate } from '../helpers/testHelpers';
import { createMockPrismaClient } from '../helpers/prismaMock';

describe('Configuración de Tests - Ejemplo', () => {
  it('debería ejecutar un test básico correctamente', () => {
    expect(1 + 1).toBe(2);
  });

  it('debería poder usar helpers de test', () => {
    const candidate = createMockCandidate({ firstName: 'Jane' });
    
    expect(candidate.firstName).toBe('Jane');
    expect(candidate.email).toBe('john.doe@example.com');
  });

  it('debería poder crear un mock de Prisma', () => {
    const mockPrisma = createMockPrismaClient();
    
    expect(mockPrisma.candidate).toBeDefined();
    expect(mockPrisma.candidate.create).toBeDefined();
    expect(typeof mockPrisma.candidate.create).toBe('function');
  });

  it('debería poder usar el mock de Prisma para simular operaciones', async () => {
    const mockPrisma = createMockPrismaClient();
    const mockCandidate = createMockCandidate();
    
    (mockPrisma.candidate.create as jest.Mock).mockResolvedValue(mockCandidate);
    
    const result = await mockPrisma.candidate.create({ 
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      } as any
    });
    
    expect(result).toEqual(mockCandidate);
    expect(mockPrisma.candidate.create).toHaveBeenCalledTimes(1);
  });
});

