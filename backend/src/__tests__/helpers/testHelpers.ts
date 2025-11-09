// Factory functions para crear datos de prueba
// Estas funciones facilitan la creación de objetos de prueba con valores por defecto
// y permiten sobrescribir campos específicos mediante el parámetro overrides

export const createMockCandidate = (overrides?: Partial<any>) => {
  return {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '612345678',
    address: '123 Test Street',
    education: [],
    workExperience: [],
    resumes: [],
    ...overrides,
  };
};

export const createMockEducation = (overrides?: Partial<any>) => {
  return {
    id: 1,
    institution: 'Test University',
    title: 'Computer Science',
    startDate: new Date('2020-01-01'),
    endDate: new Date('2024-01-01'),
    candidateId: 1,
    ...overrides,
  };
};

export const createMockWorkExperience = (overrides?: Partial<any>) => {
  return {
    id: 1,
    company: 'Test Company',
    position: 'Software Developer',
    description: 'Test description',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2023-12-31'),
    candidateId: 1,
    ...overrides,
  };
};

export const createMockResume = (overrides?: Partial<any>) => {
  return {
    id: 1,
    filePath: '/uploads/test-resume.pdf',
    fileType: 'application/pdf',
    uploadDate: new Date(),
    candidateId: 1,
    ...overrides,
  };
};

