# Testing Guide

Este documento resume cómo están organizadas las pruebas del backend y cómo ejecutarlas.

## Suite de Tests

| Tipo        | Ubicación principal                                   | Herramientas              |
|-------------|--------------------------------------------------------|---------------------------|
| Unitarios   | `src/tests/unit/`                                      | Jest (+ ts-jest)          |
| Integración | `src/tests/integration/`                               | Jest + Supertest          |
| E2E (API)   | `playwright/api/`                                      | Playwright (`@playwright/test`) |

---

## Tests Unitarios

- **Objetivo**: validar lógica de negocio aislada (domain, validator, services).
- **Mocks**: repositorios, storage, prisma, etc.; los tests no tocan DB ni filesystem.
- **Ubicación**: `src/tests/unit/`
  - `domain/`: entidades puras (Candidate, Education, etc.)
  - `application/`: servicios y validadores (candidateService, fileUploadService, validator)
  - `fixtures/` y `mocks/`: datos predefinidos y dobles de pruebas.

### Ejecutar
```bash
cd backend
npm run test:unit      # o yarn test:unit
```

---

## Tests de Integración

- **Objetivo**: ejercitar Express + controladores + servicios con dependencias simuladas (sin DB real).
- **Herramientas**: Supertest (`request(app)`) + Jest.
- **Ubicación**: `src/tests/integration/`
  - `routes/`: rutas HTTP (`POST /candidates`, `POST /upload`)
  - `controllers/`: controladores (`candidate.controller.int.spec.ts`)
  - `fixtures/`: payloads HTTP reutilizables.

### Ejecutar
```bash
cd backend
npm run test:integration    # o yarn test:integration
```

*Tips*
- El servidor no se levanta en un puerto real; las pruebas usan la instancia `app` en memoria.
- Las dependencias externas (repositorios) son dobles en memoria o mocks.

---

## Tests E2E de API (Playwright)

- **Objetivo**: validar el contrato HTTP contra el backend real (Express + Prisma + Multer).
- **Restricciones**: no se modifica código productivo; se operan las rutas existentes (`POST /candidates`, `POST /upload`).
- **Ubicación**: `playwright/`
  - `api/candidate/create.spec.ts`
  - `api/file-upload/upload.spec.ts`
  - `fixtures/`: builders de payloads y data factory.
  - `helpers/apiClient.ts`: wrappers `postJson`, `postMultipart`.
- **Configuración**: `playwright.config.ts` (baseURL, reporter, proyecto `api`).

### Preparativos
1. Variables en `.env` (o exportarlas antes de correr):
   - `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
   - `DATABASE_URL=postgresql://<user>:<pass>@localhost:<port>/<db>?schema=public`
2. Base de datos:
   ```bash
   cd backend
   DB_USER=postgres DB_PASSWORD=password DB_NAME=mydatabase DB_PORT=5432 docker-compose up -d
   npx prisma migrate deploy   # aplica migraciones existentes
   ```
3. Levantar backend:
   ```bash
   npm run dev      # o yarn dev
   ```
   (Opcional: configurá `webServer` en `playwright.config.ts` para que Playwright lo inicie solo).

### Ejecutar
```bash
cd backend
npm run test:playwright      # o yarn test:playwright
```

- UI runner (debug visual): `npm run test:playwright:ui`
- Reporte HTML: `playwright-report/index.html`

### Cobertura actual
- `POST /candidates`:
  - 201 payload completo/minimal
  - 400 por validaciones: campos vacíos, email/phone inválidos, fechas incorrectas, CV incompleto, email duplicado
- `POST /upload`:
  - 200 PDF/DOCX válidos
  - 400 mimetype no permitido
  - 400 sin archivo
  - (Test documentado `skip` para fallos de almacenamiento)

---

## Buenas prácticas comunes
- Aplicar patrón AAA (Arrange, Act, Assert) y Given/When/Then en las descripciones.
- Usar fixtures y helpers compartidos para mantener DRY.
- Generar datos únicos cuando las pruebas dependen de persistencia (e-mails con timestamp o UUID).
- Mantener separado el código productivo (`src/`) de los recursos de test (`src/tests/`, `playwright/`).
- Verificar siempre los mensajes y status code esperados para documentar el contrato HTTP.

---

## Referencias rápidas
- Jest: `jest.config.cjs`
- Playwright: `playwright.config.ts`
- Logs/Reportes: `playwright-report/`, `test-results/`

Si agregás nuevos endpoints o casos de negocio, extendé las suites correspondientes replicando las mismas convenciones.
