/** @type {import('jest').Config} */
module.exports = {
  // Corre dos “proyectos” de Jest: uno para backend y otro para frontend
  projects: [
    {
      displayName: 'backend',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/backend/**/*.(test|spec).ts'],
      moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    },
    {
      displayName: 'frontend',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/frontend/**/*.(test|spec).ts'],
      moduleFileExtensions: ['ts', 'js', 'json', 'node'],
      // setupFilesAfterEnv: ['<rootDir>/frontend/jest.setup.ts'], // crea este archivo si lo necesitas
    },
  ],
  // Permite correr `jest` en raíz aunque no haya tests aún
  passWithNoTests: true,
};

