# 🧩 Prompt maestro unit and integration

## 🎯 Objetivo general

Actúa como **Senior QA/Backend TDD Coach** y genera la **estructura completa de testing** (unit + integration) para el repositorio existente.  
No modifiques ningún archivo de código productivo dentro de `src/`; solo crea los archivos y carpetas necesarios dentro de `backend/src/tests/`.

El objetivo es cubrir **todas las capas de la app (domain, validator, services, controllers y routes)** con pruebas limpias, consistentes y desacopladas, aplicando **TDD y buenas prácticas profesionales.**

---

## 🗂️ Estructura esperada de testing

Crea dentro de `backend/src/tests/` la siguiente jerarquía:

```
backend/src/tests/
├── unit/
│   ├── domain/
│   │   ├── candidate.domain.spec.ts
│   │   ├── education.domain.spec.ts
│   │   ├── resume.domain.spec.ts
│   │   └── work-experience.domain.spec.ts
│   │
│   ├── application/
│   │   ├── candidate.service.spec.ts
│   │   ├── file-upload.service.spec.ts
│   │   └── validator.spec.ts
│   │
│   ├── fixtures/
│   │   ├── candidate.fixture.ts
│   │   └── file.fixture.ts
│   │
│   └── mocks/
│       ├── repo.mock.ts
│       ├── storage.mock.ts
│       └── prisma.client.mock.ts
│
└── integration/
    ├── routes/
    │   ├── candidate.routes.int.spec.ts
    │   └── file-upload.routes.int.spec.ts
    │
    ├── controllers/
    │   └── candidate.controller.int.spec.ts
    │
    ├── fixtures/
    │   ├── candidate.payloads.ts
    │   └── file.payloads.ts
    │
    └── utils/
        ├── makeApp.ts
        └── repo.memory.ts
```

---

## 🧠 Alcance de cada nivel

### **UNIT TESTS**

- Cubren la **lógica pura** de negocio, validación o servicio sin dependencias reales.
- Usan **mocks** para cualquier interacción externa (repos, storage, Prisma).
- Se ejecutan rápido y de forma aislada.

**Cubre:**

- `domain/*` → entidades y value objects (validaciones, normalizaciones, reglas de negocio).
- `application/*` → orquestación de servicios (candidateService, fileUploadService, validator).
- `fixtures/` → datos estáticos reutilizables.
- `mocks/` → dobles de dependencias (`jest.fn()`), nunca datos reales.

---

### **INTEGRATION TESTS**

- Validan que los componentes se comuniquen correctamente (**Express → Controller → Service → Repo (en memoria)**).
- Usan **Supertest** con `request(app)` (sin levantar servidor).
- Limpian estado entre tests.
- No tocan base de datos real ni almacenamiento físico.

**Cubre:**

- `routes/*` → endpoints HTTP (POST /candidates, POST /files, etc.).
- `controllers/*` → traducción de servicios a HTTP (status codes, headers, contrato JSON).
- `fixtures/*` → payloads HTTP.
- `utils/` → app express inyectada y repositorios en memoria.

---

## 🧩 Tipos de dobles de prueba

| Nivel          | Tipo de doble          | Uso                                           |
| -------------- | ---------------------- | --------------------------------------------- |
| Domain         | Ninguno                | Entidades puras, sin dependencias.            |
| Application    | Mock                   | Simula dependencias (repos, Prisma, storage). |
| Integration    | In-memory Repo/Storage | Simula persistencia sin tocar DB/S3.          |
| E2E (opcional) | Ninguno                | Server real, pero fuera del alcance actual.   |

---

## ⚙️ Buenas prácticas obligatorias

### 📘 Patrón AAA

Cada test debe tener tres secciones explícitas:

- **Arrange:** preparar datos, mocks, estado inicial.
- **Act:** ejecutar la función o endpoint bajo prueba.
- **Assert:** verificar un único comportamiento principal.

### 📗 Formato GWT (Given–When–Then)

Usar descripciones legibles:

> `it('Given valid candidate When creating Then returns 201 and persists in memory', ...)`

### 📙 Principios F.I.R.S.T.

- **Fast:** sin esperas ni dependencias reales.
- **Independent:** sin dependencia entre tests.
- **Repeatable:** resultados idénticos en cada ejecución.
- **Self-validating:** aserciones claras y únicas.
- **Timely:** escritos junto al código (TDD ideal).

---

## 🧪 Cobertura esperada

### Domain

- Candidate: validación, normalización, composición.
- Education: fechas válidas, campos requeridos.
- Resume: agregación y consistencia.
- WorkExperience: duración, fechas, integridad.

### Application

- Validator: reglas sintácticas de entrada.
- CandidateService: 400, 409, 201 (sin DB real, con repoMock).
- FileUploadService: 415, 413, 201 (sin I/O real, con storageMock).

### Integration

- POST /candidates → 201/400/409, contrato JSON válido, sin abrir puerto.
- (Opcional) POST /files → 201/415/413, shape correcto.
- Estado del repo en memoria se limpia en cada test.

---

## 🧰 Reglas globales

- No usar DB, disco ni red en Unit/Integration.
- No mocks en Domain (solo lógica pura).
- Separar **mocks** (dependencias simuladas) de **fixtures** (datos fijos).
- Evitar asserts múltiples sobre el mismo comportamiento.
- Evitar lógica condicional dentro de tests.
- Mantener nombres consistentes: `<feature>.<nivel>.spec.ts`.
- Añadir carpeta `e2e/` vacía solo si se planea futura cobertura end-to-end.

---

## ✅ Criterios de aceptación finales

- Estructura creada exactamente como se define arriba.
- Cada test aplica AAA + GWT + F.I.R.S.T.
- Domain tests cubren entidades y validaciones puras.
- Application tests usan mocks de repos/storage.
- Integration tests usan Supertest + repos en memoria.
- No se modifica código productivo en `src/`.
- Separación estricta entre fixtures y mocks.
- Nombres de archivos coherentes con su capa y propósito.

## 🚀 Prompt maestro Playwright API E2E

Actuá como **QA Engineer** encargado de construir y mantener la suite E2E de APIs usando Playwright sin tocar código productivo. Replicá y extendé lo siguiente:

### 🧭 Fases de implementación

1. **Relevamiento de endpoints**
   - Inspeccioná `backend/src/routes` y `index.ts` para confirmar qué rutas HTTP existen realmente (actualmente: `POST /candidates`, `POST /upload`).
   - Documentá cualquier dependencia previa (necesidad de DB, storage, etc.).

2. **Diseño de estructura Playwright**
   - Planificá la jerarquía mínima dentro de `backend/playwright/`, manteniendo separación entre specs (`api/`), fixtures (`fixtures/`), y helpers (`helpers/`).
   - Optimizá la estructura para crecer por recurso (`candidate/`, `file-upload/`) y por caso (`create.spec.ts`, `upload.spec.ts`).

3. **Plan de fixtures y helpers**
   - Diseñá builders reutilizables (payloads válidos e inválidos) y fábricas de datos únicos (`uniqueEmail`, `uniqueFileName`).
   - Definí un cliente HTTP ligero (`apiClient`) sobre `APIRequestContext` para unificar headers/llamadas.

4. **Instalación de Playwright**
   - Ejecutá `npm install --save-dev @playwright/test` y `npx playwright install`.
   - Agregá scripts en `package.json`: `test:playwright`, `test:playwright:ui`.

5. **Configuración (`playwright.config.ts`)**
   - Seteá `testDir`, timeout, reporters, y proyecto `api`.
   - Inyectá `baseURL` mediante `API_BASE_URL` con fallback a `http://localhost:3010`.
   - Documentá (o descomentá) el bloque `webServer` para levantar el backend automáticamente.

6. **Diseño de escenarios**
   - Enumerá Given/When/Then para cada endpoint existente (ver matriz debajo).
   - Mantené trazabilidad con el contrato: status + shape + mensajes de error.

7. **Estrategia de datos y limpieza**
   - Garantizá datos únicos para soportar paralelismo (emails con timestamp/UUID).
   - Decidí si necesitás cleanup explícito (borrar candidatos/archivos) o si la generación única alcanza.
   - Prepará `.env`, `docker-compose`, y migraciones (`prisma migrate`) para tener la DB lista.

8. **Ejecución y verificación**
   - Levantá la base (`docker-compose up -d`) y la app (`yarn/npm dev` o `webServer`).
   - Corré `yarn/npm test:playwright`; revisá reportes y ajustá aserciones según la respuesta real.
   - Documentá comandos y prerequisitos en `playwright/README.md` (opcional).

### 📁 Estructura de carpetas (`backend/playwright/`)
- `api/`
  - `candidate/create.spec.ts`
  - `file-upload/upload.spec.ts`
- `fixtures/`
  - `data.factory.ts`
  - `payloads/`
    - `candidate.payloads.ts`
    - `file.payloads.ts`
- `helpers/`
  - `apiClient.ts`

### ✅ Casos obligatorios
- **POST /candidates**
  - 201 con payload completo
  - 201 con datos mínimos (sin phone/address/educations/workExperiences/cv)
  - 400 por dato requerido vacío
  - 400 por email inválido
  - 400 por phone inválido
  - 400 por fecha inválida en education
  - 400 por endDate inválida en workExperience
  - 400 por CV incompleto
  - 400 por email duplicado
- **POST /upload**
  - 200 PDF válido
  - 200 DOCX válido
  - 400 mimetype inválido
  - 400 sin archivo
  - (opcional) documentar almacenamiento/errores con `test.skip`

### 📐 Convenciones y estilo
- Tests con `test.describe` y nombres Given/When/Then
- Patrón AAA en cada `test`
- Fixtures reutilizables para mantener DRY
- Datos únicos (`uniqueEmail`) para paralelismo
- Sin mocks del backend real; usar API viva
- Scripts en package.json: `test:playwright`, `test:playwright:ui`

### ▶️ Ejecución
- Servidor: `yarn/npm dev` (o habilitar `webServer` en config)
- Tests: `yarn/npm test:playwright`
- Reporte: `playwright-report/index.html`

### ➕ Extensión futura
- Seguir patrón por recurso (`candidate/`, `file-upload/`)
- Nuevos endpoints → nuevos `*.spec.ts`
- Compartir helpers/fixtures, nunca lógica productiva
- Documentar limitaciones con `test.skip` o comentarios explicativos
