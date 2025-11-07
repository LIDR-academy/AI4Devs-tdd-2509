# Generación de Tests Unitarios por Historia de Usuario

## Contexto
Tienes acceso al archivo `backend/docs/history.md` que contiene historias de usuario completamente documentadas con sus criterios de aceptación (CA).

## Objetivo
Crear archivos de test individuales en Jest/TypeScript para cada historia de usuario, siguiendo metodología TDD.

---

## Instrucciones

### 1. Estructura de Archivos
Por cada historia de usuario en `history.md`, crea un archivo:
```
backend/src/tests/historia-usuario-<numero>.test.ts
```

Ejemplo:
- `backend/src/tests/historia-usuario-1.test.ts` → Registro de Candidato con Datos Básicos
- `backend/src/tests/historia-usuario-2.test.ts` → Registro de Historial Educativo
- `backend/src/tests/historia-usuario-3.test.ts` → Registro de Experiencia Laboral
- `backend/src/tests/historia-usuario-4.test.ts` → Carga de Currículum

### 2. Estructura de Cada Archivo de Test

Cada archivo debe contener:

```typescript
/**
 * Historia de Usuario <numero>: <Título de la Historia>
 * 
 * Criterios cubiertos: CA-<numero>.1 a CA-<numero>.<último>
 * 
 * Módulos testeados:
 * - <servicio principal>
 * - <validadores>
 * - <modelos>
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
// Importar módulos necesarios

// Mock de Prisma u otras dependencias
jest.mock('@prisma/client');

describe('Historia de Usuario <numero>: <Título>', () => {

  // Contenido
});
```

### 3. Requisitos por Test

#### A. Configuración de Mocks
- Mock de `@prisma/client` para operaciones de base de datos
- Mock de dependencias externas (multer, filesystem, etc.)
- Limpiar mocks en `beforeEach` con `jest.clearAllMocks()`

#### B. Patrón Arrange-Act-Assert
Cada test debe seguir esta estructura:

```typescript
// Arrange: preparar datos y configurar mocks
const mockData = { firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };
prismaClientMock.candidate.create.mockResolvedValue(mockData);

// Act: ejecutar la función a testear
const result = await candidateService.addCandidate(mockData);

// Assert: verificar el resultado
expect(result).toEqual(expectedOutput);
expect(prismaClientMock.candidate.create).toHaveBeenCalledTimes(1);
```

#### C. Coverage de Criterios de Aceptación
- **1 describe** por cada criterio de aceptación (CA-X.Y)
- **Mínimo 2 tests** por CA: uno positivo y uno negativo
- **Tests adicionales** para edge cases y validaciones complejas
- **Comentario** indicando qué CA se está testeando

#### D. Tipos de Tests por Módulo

**Para Validadores (validator.ts):**
- ✅ Valores válidos: mínimos, máximos, formatos correctos
- ❌ Valores inválidos: vacíos, que exceden límites, formatos incorrectos
- ✅ Valores opcionales como undefined/null
- ❌ Tipos incorrectos (number cuando se espera string)

**Para Servicios (candidateService.ts):**
- ✅ Operaciones exitosas con datos mínimos
- ✅ Operaciones exitosas con datos completos
- ❌ Errores de validación propagados correctamente
- ❌ Errores de base de datos (email duplicado, conexión fallida)
- ✅ Creación de entidades relacionadas (educations, workExperiences, cv)

**Para Modelos (Candidate.ts, Education.ts, etc.):**
- ✅ CREATE cuando no tiene id
- ✅ UPDATE cuando tiene id
- ✅ Manejo correcto de relaciones (candidateId)
- ❌ Errores de Prisma específicos

**Para Endpoints (candidateRoutes.ts):**
- ✅ Status codes correctos (200, 201)
- ❌ Status codes de error (400, 500)
- ✅ Estructura de response correcta
- ❌ Mensajes de error descriptivos

### 4. Focos Específicos por Historia

#### Historia 1: Registro de Candidato con Datos Básicos
**Módulos:** `validator.ts`, `candidateService.ts`, `Candidate.ts`
**Focos principales:**
- Validaciones de campos obligatorios (firstName, lastName, email)
- Validaciones de formato (email RFC 5322, teléfono español)
- Validación de longitud (nombres 2-100 chars, dirección max 100)
- Unicidad de email en base de datos
- Manejo de campos opcionales (phone, address)

#### Historia 2: Registro de Historial Educativo
**Módulos:** `validator.ts`, `candidateService.ts`, `Education.ts`
**Focos principales:**
- Validación de arrays (vacío, un elemento, múltiples elementos)
- Validación de fechas (formato YYYY-MM-DD)
- endDate opcional (puede ser null para educación en curso)
- Validación de institution y title (1-100 caracteres)
- Creación múltiple con candidateId correcto

#### Historia 3: Registro de Experiencia Laboral
**Módulos:** `validator.ts`, `candidateService.ts`, `WorkExperience.ts`
**Focos principales:**
- Validación de company y position (1-100 caracteres)
- Validación de description opcional (max 200 caracteres)
- Fechas de experiencia actual (endDate null)
- Validación de formato de fechas
- Creación múltiple con candidateId correcto

#### Historia 4: Carga de Currículum del Candidato
**Módulos:** `fileUploadService.ts`, `validator.ts`, `Resume.ts`
**Focos principales:**
- Multer file filter (solo PDF y DOCX permitidos)
- Generación de nombre único con timestamp
- Límite de tamaño de archivo (10MB)
- Validación de objeto CV (filePath y fileType)
- Asociación Resume con Candidate
- Candidato sin CV (campo opcional)

### 5. Checklist de Validación por Test

Antes de considerar un test completo, verificar:
- [ ] Tiene comentario indicando el CA correspondiente
- [ ] Sigue el patrón Arrange-Act-Assert
- [ ] Usa mocks apropiados (Prisma, filesystem, etc.)
- [ ] Verifica el resultado esperado con `expect()`
- [ ] Verifica que los mocks fueron llamados correctamente
- [ ] Cubre casos positivos Y negativos
- [ ] Nombre descriptivo que empieza con "debe..."
- [ ] El test confirma el criterio de aceptación específico
- [ ] Es independiente (no depende de otros tests)

### 6. Comandos de Ejecución

**Ejecutar todos los tests:**
```bash
npm test
```

**Ejecutar un archivo específico:**
```bash
npm test historia-usuario-1.test.ts
```

**Ejecutar con cobertura:**
```bash
npm test -- --coverage
```

---

## Entregables

### 1. Archivos de Test

Crear **4 archivos** en `backend/src/tests/`:

1. **historia-usuario-1.test.ts** (≈15-20 tests)
   - Validaciones de nombre, email, teléfono, dirección
   - Unicidad de email
   - Registro con datos mínimos y completos

2. **historia-usuario-2.test.ts** (≈10-12 tests)
   - Validaciones de educación
   - Arrays de educación (vacío, uno, múltiples)
   - Validación de fechas y campos opcionales

3. **historia-usuario-3.test.ts** (≈10-12 tests)
   - Validaciones de experiencia laboral
   - Arrays de experiencia (vacío, uno, múltiples)
   - Validación de description opcional

4. **historia-usuario-4.test.ts** (≈12-15 tests)
   - Upload de archivos (PDF, DOCX)
   - Validación de tipos de archivo
   - Límite de tamaño
   - Asociación CV con candidato

### 2. Archivo de Seguimiento

Crear `backend/.prompt/complete.md` con:

```markdown
# ✅ Checklist de Tests Implementados

## Historia de Usuario 1: Registro de Candidato con Datos Básicos
- [x] CA-1.1: Registro exitoso con datos mínimos obligatorios
- [x] CA-1.2: Registro con datos completos opcionales
- [x] CA-1.3: Validación de nombre (firstName)
- [x] CA-1.4: Validación de apellido (lastName)
- [x] CA-1.5: Validación de email único
- [x] CA-1.6: Validación de formato de email
- [x] CA-1.7: Validación de teléfono español
- [x] CA-1.8: Validación de dirección

### Observaciones
- [Comentarios sobre implementación, edge cases cubiertos, etc.]

### Recomendaciones
- [Mejoras futuras, tests adicionales sugeridos]

---

## Historia de Usuario 2: Registro de Historial Educativo
- [ ] CA-2.1: ...
...

## [Repetir para cada historia]
```

---

## Notas Importantes

- ✅ **Solo crear tests**, no modificar código de producción
- ✅ **Importar módulos existentes** desde `src/`
- ✅ **NO modificar** `history.md`
- ✅ **Seguir convenciones** de Jest y TypeScript del proyecto
- ✅ **Cada test debe ser independiente** y ejecutable individualmente
- ✅ **Priorizar legibilidad** sobre brevedad
- ✅ **Usar nombres descriptivos** para tests y variables
- ✅ **Comentar el propósito** de configuraciones complejas de mocks

---

## Estrategia de Implementación

1. **Comenzar con Historia 1** (la más completa)
2. **Validar que todos los tests pasen** antes de continuar
3. **Iterar** sobre cada historia secuencialmente
4. **Actualizar `complete.md`** después de cada historia
5. **Ejecutar suite completa** al finalizar todas las historias

---

## Ejemplo Completo - CA-1.1

```typescript
describe('CA-1.1: Registro exitoso con datos mínimos obligatorios', () => {
  it('debe crear candidato con firstName, lastName y email', async () => {
    // Arrange
    const inputData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com'
    };
    
    const expectedCandidate = {
      id: 1,
      ...inputData,
      phone: null,
      address: null
    };
    
    prismaClientMock.candidate.create.mockResolvedValue(expectedCandidate);

    // Act
    const result = await candidateService.addCandidate(inputData);

    // Assert
    expect(result).toEqual(expectedCandidate);
    expect(result.id).toBeDefined();
    expect(prismaClientMock.candidate.create).toHaveBeenCalledTimes(1);
  });

  it('debe devolver código HTTP 201 en el endpoint', async () => {
    // Arrange
    const inputData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com'
    };

    // Act
    const response = await request(app)
      .post('/candidates')
      .send(inputData);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toBe('Juan');
  });

  it('debe devolver los datos del candidato con su ID asignado', async () => {
    // Arrange
    const inputData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com'
    };
    
    const mockCandidate = { id: 123, ...inputData, phone: null, address: null };
    prismaClientMock.candidate.create.mockResolvedValue(mockCandidate);

    // Act
    const result = await candidateService.addCandidate(inputData);

    // Assert
    expect(result).toHaveProperty('id');
    expect(result.id).toBe(123);
    expect(result.firstName).toBe(inputData.firstName);
    expect(result.lastName).toBe(inputData.lastName);
    expect(result.email).toBe(inputData.email);
  });
});
```

---

**¡Listo para comenzar la implementación!**
