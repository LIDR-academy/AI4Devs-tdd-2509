# Herramienta utilizada: Claude Code

## PROMPT 0: Instrucciones Generales

### Información del Proyecto

-   **Sistema**: LTI ATS - Applicant Tracking System
-   **Stack**: Node.js + TypeScript + Express + Prisma + PostgreSQL
-   **Framework de tests**: Jest + ts-jest
-   **Archivo de salida**: `backend/src/test/tests-ldlb.test.ts`

### Objetivo Principal

Crear una suite completa de tests unitarios para la funcionalidad de **inserción de candidatos** (endpoint `POST /candidates`) siguiendo metodología TDD.

### Alcance del Testing

El sistema permite insertar candidatos a través de un endpoint REST que valida datos y los persiste en PostgreSQL usando Prisma ORM.

**Dos familias principales de tests:**

1. **Validación de datos de entrada** (recepción del formulario)
2. **Persistencia en base de datos** (guardado con Prisma mockeado)

### Flujo de Datos

```
POST /candidates
  ↓
candidateRoutes.ts
  ↓
candidateService.addCandidate()
  ├─→ validateCandidateData() [FAMILIA 1: VALIDACIÓN]
  └─→ Persistencia con Prisma [FAMILIA 2: BD]
      ├─→ Candidate.save() → prisma.candidate.create()
      ├─→ Education.save() (loop) → prisma.education.create()
      ├─→ WorkExperience.save() (loop) → prisma.workExperience.create()
      └─→ Resume.save() → prisma.resume.create()
```

### Estructura de Datos del Candidato

El sistema permite insertar candidatos con:

-   **Datos personales básicos**: firstName, lastName, email, phone (opcional), address (opcional)
-   **Educaciones** (array): institution, title, startDate (obligatorios); endDate (opcional)
-   **Experiencias laborales** (array): company, position, startDate (obligatorios); description, endDate (opcionales)
-   **CV** (opcional): filePath, fileType

### Metodología de Tests

**Patrón obligatorio**: AAA (Arrange, Act, Assert)

```typescript
test('descripción del test', () => {
	// Arrange
	const testData = {
		/* datos de prueba */
	};

	// Act
	const result = functionUnderTest(testData);

	// Assert
	expect(result).toBe(expectedValue);
});
```

### Principios Importantes

1. **NO modificar la base de datos real**: Todos los métodos de Prisma deben ser mockeados
2. **Aislar componentes**: Cada familia de tests debe centrarse en su responsabilidad específica
3. **Nombres descriptivos**: Tests en español con descripción clara del caso
4. **Cobertura mínima**: 80% en validator.ts y candidateService.ts
5. **Tests independientes**: Cada test debe poder ejecutarse de forma aislada

### Comandos Básicos

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con cobertura
npm test -- --coverage

# Solo el archivo de tests
npx jest tests-ldlb.test.ts

# Modo watch
npm test -- --watch
```

### Notas Técnicas Críticas

**Mockeo de PrismaClient**:
Cada modelo crea `new PrismaClient()`, por eso mockear la clase completa:

```typescript
jest.mock('@prisma/client', () => ({
	PrismaClient: jest.fn().mockImplementation(() => ({
		candidate: { create: jest.fn(), update: jest.fn() },
		education: { create: jest.fn() },
		workExperience: { create: jest.fn() },
		resume: { create: jest.fn() },
	})),
}));
```

**Errores de Prisma**:

-   **P2002**: Unique constraint violation (email duplicado)
-   **P2025**: Record not found (updates)

**Conversión de Fechas**:
Los modelos convierten strings → Date objects. Mocks deben retornar `Date`, no strings.

**Arquitectura No Transaccional**:
El código NO usa transacciones. Fallo en education deja candidato huérfano. Esto es limitación conocida, NO parte del scope de tests.

Confirma que has entendido las instrucciones antes de proceder.

---

## PROMPT 1: Tests de Validación

### Contexto

El sistema valida datos en `src/application/validator.ts` mediante `validateCandidateData(data)`.

**Validaciones implementadas**:

-   **Campos obligatorios**: firstName, lastName, email
-   **Campos opcionales**: phone (formato español: 6/7/9 + 8 dígitos), address (max 100 chars)
-   **Formatos**: email regex, fechas YYYY-MM-DD
-   **Longitudes**: firstName/lastName (2-100 chars)
-   **Arrays**: educations[] (institution, title, startDate obligatorios; endDate opcional)
-   **Arrays**: workExperiences[] (company, position, startDate obligatorios; description max 200, endDate opcional)
-   **Objeto**: cv {filePath: string, fileType: string}

La función lanza `Error` con mensaje descriptivo si falla, o retorna void si pasa.

### Tarea

Crear tests unitarios para **todas** las validaciones en `validateCandidateData()` siguiendo el patrón AAA.

### Criterios

**Archivo**: `backend/src/test/tests-ldlb.test.ts`
**Suite**: `describe('Validación de datos de candidato', ...)`

**Casos mínimos a cubrir** (~20 tests):

**firstName**:

-   [OK] válido (letras con acentos y espacios)
-   [ERROR] ausente/vacío
-   [ERROR] < 2 caracteres
-   [ERROR] > 100 caracteres
-   [ERROR] con números o caracteres especiales

**lastName**: (mismo patrón que firstName)

**email**:

-   [OK] formato válido
-   [ERROR] ausente
-   [ERROR] formato inválido (sin @, sin dominio, etc.)

**phone** (opcional):

-   [OK] ausente/null/undefined/vacío
-   [OK] válido (612345678, 712345678, 912345678)
-   [ERROR] formato inválido (8 dígitos, empieza con 5, etc.)

**address** (opcional):

-   [OK] ausente
-   [OK] válido (<=100 chars)
-   [ERROR] > 100 caracteres

**educations[]**:

-   [OK] array vacío
-   [OK] todos los campos obligatorios válidos
-   [ERROR] sin institution/title/startDate
-   [ERROR] startDate formato incorrecto
-   [OK] sin endDate (opcional)
-   [ERROR] endDate formato incorrecto

**workExperiences[]**:

-   [OK] array vacío
-   [OK] todos los campos obligatorios válidos
-   [ERROR] sin company/position/startDate
-   [OK] sin description (opcional)
-   [ERROR] description > 200 caracteres
-   [ERROR] fecha formato incorrecto

**cv** (opcional):

-   [OK] ausente
-   [OK] con filePath y fileType válidos
-   [ERROR] sin filePath/fileType

**Patrón AAA (obligatorio)**:

```typescript
test('debe lanzar error si firstName está ausente', () => {
	// Arrange
	const invalidData = { lastName: 'Pérez', email: 'juan@example.com' };

	// Act & Assert
	expect(() => validateCandidateData(invalidData)).toThrow(
		'El nombre es obligatorio y debe ser un texto.'
	);
});
```

**NO mockear** `validateCandidateData()` - es la función bajo test.

**Datos de ejemplo**:

```typescript
// Candidato mínimo válido
{ firstName: 'Ana', lastName: 'Martínez', email: 'ana@example.com' }

// Candidato completo válido
{
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan@example.com',
  phone: '612345678',
  address: 'Calle Mayor 123',
  educations: [{
    institution: 'Universidad Politécnica',
    title: 'Ingeniería Informática',
    startDate: '2015-09-01',
    endDate: '2019-06-30'
  }],
  workExperiences: [{
    company: 'TechCorp',
    position: 'Developer',
    description: 'Desarrollo web',
    startDate: '2019-07-01'
  }],
  cv: { filePath: '/uploads/cv.pdf', fileType: 'application/pdf' }
}
```

---

## PROMPT 2: Tests de Persistencia con Mocks

### Contexto

El servicio `candidateService.addCandidate()` (archivo: `src/application/services/candidateService.ts`):

1. Valida datos con `validateCandidateData()`
2. Guarda candidato principal: `new Candidate(data).save()` → `prisma.candidate.create()`
3. Loop educations: `new Education(data).save()` → `prisma.education.create()`
4. Loop workExperiences: `new WorkExperience(data).save()` → `prisma.workExperience.create()`
5. Guarda CV si existe: `new Resume(data).save()` → `prisma.resume.create()`
6. Maneja error P2002 (email duplicado)

**CRÍTICO**: Cada modelo crea su propia instancia `new PrismaClient()`, por eso mockear la **clase completa**.

### Tarea

Crear tests con **mocks de Prisma** para `addCandidate()` siguiendo el patrón AAA. NO modificar BD real.

### Criterios

**Archivo**: `backend/src/test/tests-ldlb.test.ts`
**Suite**: `describe('Persistencia de candidatos en base de datos', ...)`

**Mock obligatorio** (inicio del archivo):

```typescript
jest.mock('@prisma/client', () => {
	const mockPrisma = {
		candidate: { create: jest.fn(), update: jest.fn() },
		education: { create: jest.fn() },
		workExperience: { create: jest.fn() },
		resume: { create: jest.fn() },
	};
	return { PrismaClient: jest.fn(() => mockPrisma) };
});
```

**Setup en beforeEach**:

```typescript
beforeEach(() => {
	jest.clearAllMocks();
	const { PrismaClient } = require('@prisma/client');
	const prisma = new PrismaClient();

	prisma.candidate.create.mockResolvedValue({
		id: 1,
		firstName: 'Juan',
		lastName: 'Pérez',
		email: 'juan@example.com',
	});

	prisma.education.create.mockResolvedValue({
		id: 1,
		institution: 'Universidad X',
		title: 'Ingeniería',
		startDate: new Date('2015-09-01'),
		candidateId: 1,
	});
	// Similar para workExperience y resume
});
```

**Casos mínimos** (~18 tests):

**Guardado básico**:

-   [OK] Candidato solo con campos obligatorios se guarda
-   [OK] `prisma.candidate.create()` llamado con datos correctos
-   [OK] Función retorna candidato guardado

**Campos opcionales**:

-   [OK] Con phone/address se guardan
-   [OK] Sin phone/address se omiten del payload

**Relaciones - Educations**:

-   [OK] Con 1 education: `education.create()` llamado 1 vez con candidateId
-   [OK] Con múltiples (2+): `education.create()` llamado N veces
-   [OK] Sin educations (array vacío): `education.create()` NO llamado

**Relaciones - WorkExperiences** (patrón similar a educations)

**Relaciones - CV**:

-   [OK] Con CV: `resume.create()` llamado con candidateId
-   [OK] Sin CV: `resume.create()` NO llamado

**Caso completo**:

-   [OK] Con educations + workExperiences + CV: todos los métodos llamados en orden

**Errores**:

-   [ERROR] Email duplicado: mock lanza error `{code: 'P2002'}`, capturado y relanza "The email already exists in the database"
-   [ERROR] Validación falla: `prisma.candidate.create()` NO llamado
-   [ERROR] Otros errores Prisma se propagan sin modificar

**Patrón AAA (obligatorio)**:

```typescript
test('debe guardar candidato con campos obligatorios', async () => {
	// Arrange
	const candidateData = {
		firstName: 'Juan',
		lastName: 'Pérez',
		email: 'juan@example.com',
	};

	// Act
	const result = await addCandidate(candidateData);

	// Assert
	expect(result).toBeDefined();
	expect(result.email).toBe('juan@example.com');
	expect(prisma.candidate.create).toHaveBeenCalledTimes(1);
});
```

**Verificaciones**:

```typescript
expect(prisma.candidate.create).toHaveBeenCalledWith({
	data: { firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' },
});
expect(prisma.education.create).toHaveBeenCalledTimes(2);
expect(prisma.education.create).not.toHaveBeenCalled();
```

**Opcional**: Mockear validator para aislar tests de persistencia:

```typescript
jest.mock('../../application/validator', () => ({
	validateCandidateData: jest.fn(),
}));
```

**Notas técnicas**:

-   Mocks deben retornar `Date` objects para fechas, no strings
-   Error P2002 = unique constraint (email duplicado)
-   `addCandidate()` retorna solo candidato, NO relaciones guardadas

---

## PROMPT 3: Verificación de Calidad y Cobertura

### Contexto

Una vez generados todos los tests (Prompts 1, 2 y opcionalmente 3), necesitas verificar la calidad y cobertura de la suite de tests.

### Tarea

Analizar el archivo `backend/src/test/tests-ldlb.test.ts` y generar un reporte de calidad.

### Criterios de Verificación

**1. Ejecutar tests y verificar**:

```bash
# Ejecutar todos los tests
npm test

# Coverage completo
npm test -- --coverage
```

**2. Analizar cobertura**:

-   **Target mínimo**: 80% cobertura en `validator.ts` y `candidateService.ts`
-   Verificar líneas, branches, functions, statements
-   Identificar código NO cubierto

**3. Checklist de calidad**:

**Estructura**:

-   [ ] Archivo existe en `backend/src/test/tests-ldlb.test.ts`
-   [ ] Imports correctos (@prisma/client, validator, candidateService)
-   [ ] 3 describe blocks (Validación, Persistencia, Integración opcional)
-   [ ] ~35-45 tests totales (20 validación + 18 persistencia + 6 integración)

**Validación (Prompt 1)**:

-   [ ] Tests para firstName (5 casos)
-   [ ] Tests para lastName (5 casos)
-   [ ] Tests para email (3 casos)
-   [ ] Tests para phone opcional (3 casos)
-   [ ] Tests para address opcional (3 casos)
-   [ ] Tests para educations[] (6 casos)
-   [ ] Tests para workExperiences[] (6 casos)
-   [ ] Tests para cv opcional (3 casos)

**Persistencia (Prompt 2)**:

-   [ ] Mock de PrismaClient configurado
-   [ ] beforeEach limpia mocks
-   [ ] Tests guardado básico (3 casos)
-   [ ] Tests campos opcionales (3 casos)
-   [ ] Tests educations (3 casos)
-   [ ] Tests workExperiences (3 casos)
-   [ ] Tests CV (2 casos)
-   [ ] Tests caso completo (1 caso)
-   [ ] Tests manejo errores (3 casos: P2002, validación, otros)

**Integración (Prompt 3 - opcional)**:

-   [ ] 6 tests de flujo completo
-   [ ] Validator NO mockeado
-   [ ] Prisma SÍ mockeado

**Buenas prácticas**:

-   [ ] Patrón AAA aplicado consistentemente en todos los tests
-   [ ] Nombres descriptivos en español
-   [ ] Sin código duplicado excesivo
-   [ ] Datos de prueba realistas
-   [ ] Verificaciones con toHaveBeenCalledWith/toHaveBeenCalledTimes
-   [ ] Manejo de casos async con async/await
-   [ ] Sin llamadas a BD real (todo mockeado)

**4. Reporte a generar**:

Crear archivo `backend/src/test/COVERAGE-REPORT.md` con:

```markdown
# Reporte de Cobertura - Tests de Candidatos

## Resumen Ejecutivo

-   Tests totales: [X]
-   Tests pasando: [X]
-   Tests fallando: [X]
-   Cobertura global: [X]%

## Cobertura por Archivo

| Archivo             | Statements | Branches | Functions | Lines |
| ------------------- | ---------- | -------- | --------- | ----- |
| validator.ts        | X%         | X%       | X%        | X%    |
| candidateService.ts | X%         | X%       | X%        | X%    |

## Casos NO Cubiertos

[Lista de líneas/branches sin cobertura con explicación]

## Casos Edge Detectados

[Lista de edge cases testeados correctamente]

## Problemas Encontrados

[Lista de tests fallidos con razón]

## Recomendaciones

[Sugerencias para mejorar cobertura o calidad]
```

**5. Comandos útiles para debugging**:

```bash
# Ver todos los tests con detalle
npx jest tests-ldlb.test.ts --verbose

# Solo tests de validación
npx jest -t "Validación"

# Solo tests fallidos
npx jest --onlyFailures

# Watch mode
npm test -- --watch

# Coverage con HTML report
npm test -- --coverage --coverageReporters=html
# Ver en: backend/coverage/index.html
```

**6. Métricas de calidad esperadas**:

-   **Cobertura statements**: >=80%
-   **Cobertura branches**: >=75% (algunas ramas de error pueden ser difíciles)
-   **Cobertura functions**: >=90%
-   **Tests pasando**: 100%
-   **Tiempo ejecución**: <10 segundos (todos los tests)

**7. Validar errores comunes**:

-   [ ] Mocks NO están limpios entre tests (usar jest.clearAllMocks)
-   [ ] Imports de rutas relativas incorrectas
-   [ ] Mocks de Prisma no funcionan (verificar patrón mock)
-   [ ] Tests async sin await
-   [ ] Fechas en formato string en vez de Date objects
-   [ ] Tests dependientes del orden de ejecución
-   [ ] Console.log residuales
-   [ ] Patrón AAA no aplicado consistentemente

**8. Salida esperada**:

Reporte markdown con:

-   Métricas de cobertura
-   Tests pasando/fallando
-   Código sin cubrir identificado
-   Problemas encontrados
-   Recomendaciones de mejora
-   Verificación de uso correcto del patrón AAA
