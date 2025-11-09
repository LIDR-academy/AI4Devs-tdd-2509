# PLAN DE DESARROLLO DE PRUEBAS UNITARIAS
## Proyecto: LTI (Talent Tracking System)

### RESUMEN EJECUTIVO

**Estado actual:**
- 0% de cobertura (no existen pruebas unitarias)
- 10 archivos TypeScript en backend sin pruebas
- 5 archivos JavaScript/React en frontend sin pruebas
- Jest y ts-jest ya configurados en backend
- Jest disponible en frontend

**Objetivo:** Alcanzar ≥ 90% de cobertura de código mediante pruebas unitarias

---

## FASE 1: CONFIGURACIÓN DEL ENTORNO DE PRUEBAS

### 1.1 Backend - Configuración Jest

**Archivo a crear:** `backend/jest.config.js`

**Configuración requerida:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',  // Excluir archivo principal de servidor
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
```

### 1.2 Frontend - Configuración Jest

**Archivo a crear:** `frontend/jest.config.js`

**Configuración requerida:**
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/react-app-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  }
};
```

### 1.3 Scripts adicionales package.json

**Backend:**
```json
"test:coverage": "jest --coverage",
"test:watch": "jest --watch",
"test:verbose": "jest --verbose"
```

**Frontend:**
```json
"test:coverage": "jest --coverage",
"test:watch": "jest --watch"
```

---

## FASE 2: PRUEBAS UNITARIAS BACKEND (PRIORIDAD ALTA)

### 2.1 Validadores - `backend/src/application/validator.ts`

**Archivo de pruebas:** `backend/src/application/__tests__/validator.test.ts`

**Complejidad:** Media
**Prioridad:** ALTA (código crítico de validación)
**Estimación:** 4-6 horas

**Casos de prueba requeridos (33 test cases):**

#### validateName
1. ✓ Debe aceptar nombres válidos con letras españolas
2. ✓ Debe rechazar nombres con menos de 2 caracteres
3. ✓ Debe rechazar nombres con más de 100 caracteres
4. ✓ Debe rechazar nombres con caracteres especiales inválidos
5. ✓ Debe rechazar nombres undefined o null

#### validateEmail
6. ✓ Debe aceptar emails válidos
7. ✓ Debe rechazar emails sin @
8. ✓ Debe rechazar emails sin dominio
9. ✓ Debe rechazar emails undefined o null

#### validatePhone
10. ✓ Debe aceptar teléfonos válidos españoles (6|7|9 + 8 dígitos)
11. ✓ Debe permitir phone undefined (campo opcional)
12. ✓ Debe rechazar teléfonos con formato inválido

#### validateDate
13. ✓ Debe aceptar fechas en formato YYYY-MM-DD
14. ✓ Debe rechazar fechas en formato incorrecto
15. ✓ Debe rechazar fechas undefined o null

#### validateAddress
16. ✓ Debe aceptar direcciones válidas
17. ✓ Debe rechazar direcciones con más de 100 caracteres
18. ✓ Debe permitir address undefined (campo opcional)

#### validateEducation
19. ✓ Debe aceptar educación válida completa
20. ✓ Debe rechazar educación sin institución o con institución > 100 chars
21. ✓ Debe rechazar educación sin título o con título > 100 chars
22. ✓ Debe validar fechas de educación

#### validateExperience
23. ✓ Debe aceptar experiencia válida completa
24. ✓ Debe rechazar experiencia sin compañía o con compañía > 100 chars
25. ✓ Debe rechazar experiencia sin posición o con posición > 100 chars
26. ✓ Debe validar que description no exceda 200 chars

#### validateCV
27. ✓ Debe aceptar CV válido con filePath y fileType
28. ✓ Debe rechazar CV sin filePath
29. ✓ Debe rechazar CV sin fileType

#### validateCandidateData (función principal)
30. ✓ Debe validar candidato completo válido
31. ✓ Debe saltear validaciones si id está presente (edición)
32. ✓ Debe validar arrays de educaciones
33. ✓ Debe validar arrays de experiencias laborales

**Cobertura esperada:** 95-100%

---

### 2.2 Servicios - `backend/src/application/services/candidateService.ts`

**Archivo de pruebas:** `backend/src/application/services/__tests__/candidateService.test.ts`

**Complejidad:** Alta
**Prioridad:** ALTA (lógica de negocio crítica)
**Estimación:** 6-8 horas

**Dependencias a mockear:**
- Prisma Client
- Validator
- Modelos (Candidate, Education, WorkExperience, Resume)

**Casos de prueba requeridos (15 test cases):**

#### addCandidate - Casos exitosos
1. ✓ Debe crear candidato sin educación ni experiencia ni CV
2. ✓ Debe crear candidato con educación
3. ✓ Debe crear candidato con experiencia laboral
4. ✓ Debe crear candidato con CV
5. ✓ Debe crear candidato completo (con educación, experiencia y CV)
6. ✓ Debe asignar candidateId correcto a educaciones
7. ✓ Debe asignar candidateId correcto a experiencias
8. ✓ Debe asignar candidateId correcto a CV

#### addCandidate - Validación
9. ✓ Debe llamar a validateCandidateData antes de guardar
10. ✓ Debe lanzar error si validación falla
11. ✓ Debe propagar errores de validación correctamente

#### addCandidate - Manejo de errores
12. ✓ Debe manejar error P2002 (email duplicado)
13. ✓ Debe lanzar mensaje específico para email duplicado
14. ✓ Debe propagar otros errores de Prisma
15. ✓ Debe manejar errores al guardar educación/experiencia

**Estrategia de mocking:**
- Mockear `validateCandidateData` para controlar validaciones
- Mockear constructores y métodos `save()` de modelos
- Mockear respuestas de Prisma

**Cobertura esperada:** 90-95%

---

### 2.3 Modelos de Dominio

#### 2.3.1 `backend/src/domain/models/Candidate.ts`

**Archivo de pruebas:** `backend/src/domain/models/__tests__/Candidate.test.ts`

**Complejidad:** Alta
**Prioridad:** ALTA
**Estimación:** 6-8 horas

**Casos de prueba requeridos (21 test cases):**

##### Constructor
1. ✓ Debe crear instancia con datos mínimos requeridos
2. ✓ Debe inicializar arrays vacíos si no se proporcionan
3. ✓ Debe asignar correctamente todos los campos opcionales
4. ✓ Debe manejar datos undefined en campos opcionales

##### save() - Creación (sin id)
5. ✓ Debe llamar a prisma.candidate.create con datos correctos
6. ✓ Debe incluir solo campos no undefined
7. ✓ Debe crear relaciones de educations si existen
8. ✓ Debe crear relaciones de workExperiences si existen
9. ✓ Debe crear relaciones de resumes si existen
10. ✓ Debe retornar candidato creado
11. ✓ Debe manejar PrismaClientInitializationError (DB no conectada)
12. ✓ Debe propagar otros errores de creación

##### save() - Actualización (con id)
13. ✓ Debe llamar a prisma.candidate.update cuando id existe
14. ✓ Debe usar where: { id } correcto
15. ✓ Debe actualizar solo campos proporcionados
16. ✓ Debe manejar error P2025 (registro no encontrado)
17. ✓ Debe lanzar mensaje específico para registro no encontrado
18. ✓ Debe propagar otros errores de actualización

##### findOne()
19. ✓ Debe buscar candidato por id
20. ✓ Debe retornar null si no encuentra candidato
21. ✓ Debe retornar instancia de Candidate si encuentra

**Dependencias a mockear:**
- PrismaClient completo

**Cobertura esperada:** 85-90%

---

#### 2.3.2 `backend/src/domain/models/Education.ts`

**Archivo de pruebas:** `backend/src/domain/models/__tests__/Education.test.ts`

**Complejidad:** Media
**Prioridad:** MEDIA
**Estimación:** 3-4 horas

**Casos de prueba requeridos (12 test cases):**

##### Constructor
1. ✓ Debe crear instancia con datos completos
2. ✓ Debe convertir startDate a objeto Date
3. ✓ Debe convertir endDate a objeto Date si existe
4. ✓ Debe manejar endDate undefined
5. ✓ Debe asignar candidateId si se proporciona

##### save() - Creación
6. ✓ Debe llamar a prisma.education.create
7. ✓ Debe incluir candidateId si está definido
8. ✓ Debe retornar educación creada

##### save() - Actualización
9. ✓ Debe llamar a prisma.education.update cuando id existe
10. ✓ Debe usar where: { id } correcto
11. ✓ Debe incluir todos los campos requeridos
12. ✓ Debe manejar errores de Prisma

**Cobertura esperada:** 90-95%

---

#### 2.3.3 `backend/src/domain/models/WorkExperience.ts`

**Archivo de pruebas:** `backend/src/domain/models/__tests__/WorkExperience.test.ts`

**Complejidad:** Media
**Prioridad:** MEDIA
**Estimación:** 3-4 horas

**Casos de prueba requeridos (13 test cases):**

##### Constructor
1. ✓ Debe crear instancia con datos completos
2. ✓ Debe convertir startDate a objeto Date
3. ✓ Debe convertir endDate a objeto Date si existe
4. ✓ Debe manejar campos opcionales (description, endDate)
5. ✓ Debe asignar candidateId si se proporciona

##### save() - Creación
6. ✓ Debe llamar a prisma.workExperience.create
7. ✓ Debe incluir candidateId si está definido
8. ✓ Debe incluir description si está definida
9. ✓ Debe retornar experiencia creada

##### save() - Actualización
10. ✓ Debe llamar a prisma.workExperience.update cuando id existe
11. ✓ Debe usar where: { id } correcto
12. ✓ Debe incluir todos los campos
13. ✓ Debe manejar errores de Prisma

**Cobertura esperada:** 90-95%

---

#### 2.3.4 `backend/src/domain/models/Resume.ts`

**Archivo de pruebas:** `backend/src/domain/models/__tests__/Resume.test.ts`

**Complejidad:** Baja-Media
**Prioridad:** MEDIA
**Estimación:** 2-3 horas

**Casos de prueba requeridos (9 test cases):**

##### Constructor
1. ✓ Debe crear instancia con datos completos
2. ✓ Debe inicializar uploadDate con fecha actual
3. ✓ Debe manejar datos undefined con operador ?

##### save()
4. ✓ Debe llamar a create() si no tiene id
5. ✓ Debe lanzar error si intenta actualizar (id existe)
6. ✓ Debe incluir mensaje específico de error para actualización

##### create()
7. ✓ Debe llamar a prisma.resume.create con datos correctos
8. ✓ Debe retornar instancia de Resume creada
9. ✓ Debe manejar errores de Prisma

**Cobertura esperada:** 90-95%

---

### 2.4 Controladores - `backend/src/presentation/controllers/candidateController.ts`

**Archivo de pruebas:** `backend/src/presentation/controllers/__tests__/candidateController.test.ts`

**Complejidad:** Baja
**Prioridad:** MEDIA
**Estimación:** 2-3 horas

**Casos de prueba requeridos (6 test cases):**

#### addCandidateController
1. ✓ Debe retornar 201 con mensaje de éxito cuando se crea candidato
2. ✓ Debe llamar a addCandidate con req.body
3. ✓ Debe retornar datos del candidato creado
4. ✓ Debe retornar 400 con mensaje de error cuando falla
5. ✓ Debe manejar errores de tipo Error
6. ✓ Debe manejar errores desconocidos (no Error)

**Dependencias a mockear:**
- addCandidate service
- Request y Response de Express

**Cobertura esperada:** 95-100%

---

### 2.5 Servicios de Archivo - `backend/src/application/services/fileUploadService.ts`

**Archivo de pruebas:** `backend/src/application/services/__tests__/fileUploadService.test.ts`

**Complejidad:** Alta
**Prioridad:** MEDIA (funcionalidad importante pero no crítica)
**Estimación:** 4-5 horas

**Casos de prueba requeridos (12 test cases):**

#### Configuración de storage
1. ✓ Debe configurar destination a '../uploads/'
2. ✓ Debe generar filename con timestamp y nombre original

#### fileFilter
3. ✓ Debe aceptar archivos PDF (application/pdf)
4. ✓ Debe aceptar archivos DOCX
5. ✓ Debe rechazar otros tipos de archivo
6. ✓ Debe llamar callback con true para archivos válidos
7. ✓ Debe llamar callback con false para archivos inválidos

#### uploadFile
8. ✓ Debe retornar 200 con filePath y fileType en éxito
9. ✓ Debe retornar 500 con mensaje de error para MulterError
10. ✓ Debe retornar 500 para otros errores
11. ✓ Debe retornar 400 si no hay archivo (rechazado por filtro)
12. ✓ Debe verificar límite de tamaño (10MB)

**Dependencias a mockear:**
- multer
- Request y Response de Express
- File object

**Cobertura esperada:** 85-90%

---

### 2.6 Rutas - `backend/src/routes/candidateRoutes.ts`

**Archivo de pruebas:** `backend/src/routes/__tests__/candidateRoutes.test.ts`

**Complejidad:** Baja
**Prioridad:** BAJA (routing simple)
**Estimación:** 2-3 horas

**Casos de prueba requeridos (5 test cases):**

1. ✓ Debe definir ruta POST /
2. ✓ Debe llamar a addCandidate con req.body
3. ✓ Debe retornar 201 con resultado en éxito
4. ✓ Debe retornar 400 con mensaje de error para Error
5. ✓ Debe retornar 500 para errores no esperados

**Estrategia:** Usar supertest para pruebas de integración ligeras

**Cobertura esperada:** 85-90%

---

### 2.7 Archivo principal - `backend/src/index.ts`

**Archivo de pruebas:** `backend/src/__tests__/index.test.ts`

**Complejidad:** Media
**Prioridad:** BAJA (configuración de servidor)
**Estimación:** 3-4 horas

**Nota:** Este archivo mayormente configura Express. Se puede alcanzar 90% sin probarlo exhaustivamente, o bien crear pruebas de integración.

**Casos de prueba sugeridos (8 test cases):**

1. ✓ Debe exportar app correctamente
2. ✓ Debe configurar middleware JSON
3. ✓ Debe configurar CORS con origin correcto
4. ✓ Debe registrar ruta /candidates
5. ✓ Debe registrar ruta /upload
6. ✓ Debe responder en GET /
7. ✓ Debe manejar errores con middleware de error
8. ✓ NO probar app.listen() (inicialización de servidor)

**Estrategia:** Usar supertest sin iniciar servidor

**Cobertura esperada:** 70-80% (excluir app.listen)

---

## FASE 3: PRUEBAS UNITARIAS FRONTEND (PRIORIDAD MEDIA)

### 3.1 Servicios - `frontend/src/services/candidateService.js`

**Archivo de pruebas:** `frontend/src/services/__tests__/candidateService.test.js`

**Complejidad:** Media
**Prioridad:** ALTA (lógica de API)
**Estimación:** 3-4 horas

**Casos de prueba requeridos (10 test cases):**

#### uploadCV
1. ✓ Debe crear FormData con archivo
2. ✓ Debe hacer POST a /upload con headers correctos
3. ✓ Debe retornar response.data en éxito
4. ✓ Debe lanzar error con mensaje específico en fallo
5. ✓ Debe incluir error.response.data en mensaje de error

#### sendCandidateData
6. ✓ Debe hacer POST a /candidates con candidateData
7. ✓ Debe retornar response.data en éxito
8. ✓ Debe lanzar error con mensaje específico en fallo
9. ✓ Debe incluir error.response.data en mensaje de error
10. ✓ Debe manejar errores de red (sin response)

**Dependencias a mockear:**
- axios completo

**Cobertura esperada:** 95-100%

---

### 3.2 Componentes React

#### 3.2.1 `frontend/src/components/FileUploader.js`

**Archivo de pruebas:** `frontend/src/components/__tests__/FileUploader.test.js`

**Complejidad:** Media
**Prioridad:** ALTA
**Estimación:** 4-5 horas

**Casos de prueba requeridos (15 test cases):**

##### Renderizado
1. ✓ Debe renderizar input de tipo file
2. ✓ Debe renderizar botón "Subir Archivo"
3. ✓ Debe mostrar nombre de archivo seleccionado

##### handleFileChange
4. ✓ Debe actualizar estado file al seleccionar archivo
5. ✓ Debe actualizar fileName con nombre del archivo
6. ✓ Debe llamar prop onChange con archivo

##### handleFileUpload - Éxito
7. ✓ Debe crear FormData con archivo
8. ✓ Debe hacer fetch a /upload
9. ✓ Debe establecer loading=true durante subida
10. ✓ Debe establecer loading=false después de subida
11. ✓ Debe llamar prop onUpload con fileData
12. ✓ Debe mostrar mensaje de éxito

##### handleFileUpload - Error
13. ✓ Debe manejar respuesta no exitosa
14. ✓ Debe mostrar error en consola
15. ✓ Debe establecer loading=false en caso de error

**Herramientas:**
- @testing-library/react
- @testing-library/user-event
- jest.mock para fetch

**Cobertura esperada:** 90-95%

---

#### 3.2.2 `frontend/src/components/AddCandidateForm.js`

**Archivo de pruebas:** `frontend/src/components/__tests__/AddCandidateForm.test.js`

**Complejidad:** ALTA
**Prioridad:** ALTA (componente crítico)
**Estimación:** 8-10 horas

**Casos de prueba requeridos (38 test cases):**

##### Renderizado inicial
1. ✓ Debe renderizar todos los campos del formulario
2. ✓ Debe renderizar botones "Añadir Educación" y "Añadir Experiencia"
3. ✓ Debe renderizar FileUploader
4. ✓ Debe renderizar botón Submit

##### Manejo de inputs básicos
5. ✓ Debe actualizar firstName al escribir
6. ✓ Debe actualizar lastName al escribir
7. ✓ Debe actualizar email al escribir
8. ✓ Debe actualizar phone al escribir
9. ✓ Debe actualizar address al escribir

##### handleAddSection - Educaciones
10. ✓ Debe agregar nueva educación vacía al array
11. ✓ Debe agregar múltiples educaciones
12. ✓ Debe inicializar con campos correctos

##### handleRemoveSection - Educaciones
13. ✓ Debe eliminar educación por índice
14. ✓ Debe mantener otras educaciones intactas

##### handleInputChange - Educaciones
15. ✓ Debe actualizar campo institution
16. ✓ Debe actualizar campo title
17. ✓ Debe mantener otros campos sin cambios

##### handleDateChange - Educaciones
18. ✓ Debe actualizar startDate
19. ✓ Debe actualizar endDate
20. ✓ Debe manejar fechas null

##### handleAddSection - Experiencias
21. ✓ Debe agregar nueva experiencia vacía
22. ✓ Debe inicializar con campos correctos (company, position, description)

##### handleRemoveSection - Experiencias
23. ✓ Debe eliminar experiencia por índice

##### handleInputChange - Experiencias
24. ✓ Debe actualizar campo company
25. ✓ Debe actualizar campo position
26. ✓ Debe actualizar campo description

##### handleCVUpload
27. ✓ Debe actualizar estado cv con fileData

##### handleSubmit - Éxito
28. ✓ Debe prevenir comportamiento por defecto del form
29. ✓ Debe formatear fechas a YYYY-MM-DD
30. ✓ Debe hacer POST a /candidates con datos correctos
31. ✓ Debe mostrar mensaje de éxito en respuesta 201
32. ✓ Debe limpiar mensaje de error

##### handleSubmit - Errores
33. ✓ Debe mostrar error en respuesta 400
34. ✓ Debe mostrar error en respuesta 500
35. ✓ Debe mostrar error genérico en otros casos
36. ✓ Debe limpiar mensaje de éxito al fallar

##### Integración
37. ✓ Debe manejar candidato completo con educación, experiencia y CV
38. ✓ Debe omitir cv si es null en envío

**Herramientas:**
- @testing-library/react
- @testing-library/user-event
- jest.mock para fetch
- Mocks para react-datepicker

**Cobertura esperada:** 85-90% (componente muy grande)

---

#### 3.2.3 `frontend/src/components/RecruiterDashboard.js`

**Archivo de pruebas:** `frontend/src/components/__tests__/RecruiterDashboard.test.js`

**Complejidad:** Baja
**Prioridad:** BAJA (componente simple)
**Estimación:** 1-2 horas

**Casos de prueba requeridos (5 test cases):**

1. ✓ Debe renderizar título "Dashboard del Reclutador"
2. ✓ Debe renderizar logo de LTI
3. ✓ Debe renderizar botón "Añadir Nuevo Candidato"
4. ✓ Debe renderizar Link a /add-candidate
5. ✓ Debe tener estructura de Bootstrap correcta

**Cobertura esperada:** 95-100%

---

#### 3.2.4 `frontend/src/App.js`

**Archivo de pruebas:** `frontend/src/__tests__/App.test.js`

**Complejidad:** Baja
**Prioridad:** MEDIA
**Estimación:** 2-3 horas

**Casos de prueba requeridos (6 test cases):**

1. ✓ Debe renderizar BrowserRouter
2. ✓ Debe definir ruta / con RecruiterDashboard
3. ✓ Debe definir ruta /add-candidate con AddCandidate
4. ✓ Debe renderizar RecruiterDashboard en ruta /
5. ✓ Debe renderizar AddCandidate en ruta /add-candidate
6. ✓ Debe manejar rutas no encontradas

**Herramientas:**
- @testing-library/react
- react-router-dom mocks
- MemoryRouter para pruebas

**Cobertura esperada:** 90-95%

---

## FASE 4: MOCKS Y CONFIGURACIÓN ADICIONAL

### 4.1 Archivos de mock necesarios

#### Backend
**`backend/src/__mocks__/@prisma/client.ts`**
- Mock completo de PrismaClient
- Mock de métodos: create, update, findUnique, findMany

#### Frontend
**`frontend/src/__mocks__/axios.js`**
- Mock de axios.post
- Mock de axios.get

**`frontend/src/__mocks__/fileMock.js`**
```javascript
module.exports = 'test-file-stub';
```

**`frontend/src/setupTests.js`**
```javascript
import '@testing-library/jest-dom';
```

### 4.2 Utilidades de testing

**`backend/src/__tests__/helpers/mockPrisma.ts`**
- Factory para crear mocks de Prisma reutilizables

**`frontend/src/__tests__/helpers/renderWithRouter.js`**
- Helper para renderizar componentes con React Router

---

## RESUMEN DE ESTIMACIONES

### Backend
| Archivo | Complejidad | Prioridad | Horas | Test Cases |
|---------|-------------|-----------|-------|------------|
| validator.ts | Media | ALTA | 4-6 | 33 |
| candidateService.ts | Alta | ALTA | 6-8 | 15 |
| Candidate.ts | Alta | ALTA | 6-8 | 21 |
| Education.ts | Media | MEDIA | 3-4 | 12 |
| WorkExperience.ts | Media | MEDIA | 3-4 | 13 |
| Resume.ts | Baja-Media | MEDIA | 2-3 | 9 |
| candidateController.ts | Baja | MEDIA | 2-3 | 6 |
| fileUploadService.ts | Alta | MEDIA | 4-5 | 12 |
| candidateRoutes.ts | Baja | BAJA | 2-3 | 5 |
| index.ts | Media | BAJA | 3-4 | 8 |
| **TOTAL BACKEND** | | | **35-48 horas** | **134 tests** |

### Frontend
| Archivo | Complejidad | Prioridad | Horas | Test Cases |
|---------|-------------|-----------|-------|------------|
| candidateService.js | Media | ALTA | 3-4 | 10 |
| FileUploader.js | Media | ALTA | 4-5 | 15 |
| AddCandidateForm.js | ALTA | ALTA | 8-10 | 38 |
| RecruiterDashboard.js | Baja | BAJA | 1-2 | 5 |
| App.js | Baja | MEDIA | 2-3 | 6 |
| **TOTAL FRONTEND** | | | **18-24 horas** | **74 tests** |

### Configuración y Mocks
| Tarea | Horas |
|-------|-------|
| Configuración Jest (backend + frontend) | 2-3 |
| Creación de mocks y helpers | 3-4 |
| **TOTAL CONFIGURACIÓN** | **5-7 horas** |

---

## ESTIMACIÓN TOTAL DEL PROYECTO

**Desarrollo:** 58-79 horas
**Total de Test Cases:** 208 pruebas unitarias
**Cobertura esperada:** 90-95%

---

## ORDEN DE IMPLEMENTACIÓN RECOMENDADO

### Sprint 1 (Backend Crítico) - 20-26 horas
1. Configuración Jest backend
2. validator.ts (ALTA prioridad)
3. candidateService.ts (ALTA prioridad)
4. Candidate.ts (ALTA prioridad)

### Sprint 2 (Backend Modelos) - 15-21 horas
5. Education.ts
6. WorkExperience.ts
7. Resume.ts
8. candidateController.ts
9. fileUploadService.ts

### Sprint 3 (Frontend Crítico) - 15-19 horas
10. Configuración Jest frontend
11. candidateService.js (ALTA prioridad)
12. FileUploader.js (ALTA prioridad)
13. AddCandidateForm.js (ALTA prioridad)

### Sprint 4 (Completar y Ajustar) - 8-13 horas
14. App.js
15. RecruiterDashboard.js
16. candidateRoutes.ts
17. index.ts
18. Ajustes de cobertura
19. Corrección de tests fallidos

---

## CRITERIOS DE ACEPTACIÓN

1. ✅ Todas las pruebas pasan (jest exitoso)
2. ✅ Cobertura global ≥ 90% en backend
3. ✅ Cobertura global ≥ 85% en frontend
4. ✅ No hay código duplicado en tests
5. ✅ Mocks apropiados para dependencias externas
6. ✅ Tests son deterministas (no fallan aleatoriamente)
7. ✅ Tests son rápidos (< 30 segundos total)
8. ✅ Documentación de helpers y mocks

---

## COMANDOS DE VERIFICACIÓN

### Backend
```bash
cd backend
npm test -- --coverage
npm test -- --coverage --verbose
```

### Frontend
```bash
cd frontend
npm run test:coverage
```

### Verificación de umbrales
Los tests fallarán automáticamente si no se alcanza el 90% de cobertura gracias a `coverageThreshold` en jest.config.js

---

## NOTAS IMPORTANTES PARA EL DESARROLLADOR

1. **Prisma Mocking:** Usar `jest.mock('@prisma/client')` y crear instancia mockeada completa
2. **Fechas:** Mockear `Date.now()` y `new Date()` para tests deterministas
3. **Fetch/Axios:** Mockear completamente con jest.mock
4. **React Testing Library:** Usar queries por rol y texto, evitar testId
5. **Async/Await:** Todos los tests asíncronos deben usar async/await correctamente
6. **Isolation:** Cada test debe ser independiente (beforeEach para resetear mocks)
7. **Coverage:** Revisar reporte HTML en `coverage/lcov-report/index.html`

---

## ARCHIVOS SIN PRUEBAS IDENTIFICADOS

### Backend (10 archivos)
1. `backend/src/application/validator.ts`
2. `backend/src/application/services/candidateService.ts`
3. `backend/src/application/services/fileUploadService.ts`
4. `backend/src/domain/models/Candidate.ts`
5. `backend/src/domain/models/Education.ts`
6. `backend/src/domain/models/Resume.ts`
7. `backend/src/domain/models/WorkExperience.ts`
8. `backend/src/presentation/controllers/candidateController.ts`
9. `backend/src/routes/candidateRoutes.ts`
10. `backend/src/index.ts`

### Frontend (5 archivos)
1. `frontend/src/services/candidateService.js`
2. `frontend/src/components/FileUploader.js`
3. `frontend/src/components/AddCandidateForm.js`
4. `frontend/src/components/RecruiterDashboard.js`
5. `frontend/src/App.js`

**Total de archivos a probar:** 15 archivos
