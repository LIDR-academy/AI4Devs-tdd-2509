# Descripción Técnica del Proyecto

## Resumen General

Este proyecto es un **sistema backend de gestión de candidatos** para un ATS (Applicant Tracking System) desarrollado con **Node.js**, **Express**, **TypeScript** y **Prisma ORM**, utilizando **PostgreSQL** como base de datos.

El sistema permite registrar candidatos en el sistema de reclutamiento, incluyendo sus datos personales, historial educativo, experiencia laboral y currículums en formato digital.

---

## Arquitectura del Sistema

El proyecto sigue una **arquitectura en capas** (Layered Architecture) con separación clara de responsabilidades:

### 1. **Capa de Presentación (Presentation Layer)**
- **Ubicación**: `src/presentation/controllers/`
- **Responsabilidad**: Recibir peticiones HTTP, coordinar respuestas y manejar errores de alto nivel
- **Componentes**:
  - `candidateController.ts`: Controlador para operaciones de candidatos

### 2. **Capa de Aplicación (Application Layer)**
- **Ubicación**: `src/application/`
- **Responsabilidad**: Lógica de negocio, orquestación de servicios y validaciones
- **Componentes**:
  - `services/candidateService.ts`: Servicio principal para gestión de candidatos
  - `services/fileUploadService.ts`: Servicio para carga de archivos CV
  - `validator.ts`: Validaciones de datos de entrada

### 3. **Capa de Dominio (Domain Layer)**
- **Ubicación**: `src/domain/models/`
- **Responsabilidad**: Modelos de datos y lógica de persistencia
- **Componentes**:
  - `Candidate.ts`: Modelo de candidato
  - `Education.ts`: Modelo de educación
  - `WorkExperience.ts`: Modelo de experiencia laboral
  - `Resume.ts`: Modelo de currículum

### 4. **Capa de Rutas (Routes)**
- **Ubicación**: `src/routes/`
- **Responsabilidad**: Definición de endpoints y enrutamiento
- **Componentes**:
  - `candidateRoutes.ts`: Rutas para operaciones de candidatos

### 5. **Capa de Persistencia (Data Layer)**
- **Tecnología**: Prisma ORM + PostgreSQL
- **Ubicación**: `prisma/schema.prisma`
- **Modelos de datos**:
  - `Candidate`: Datos personales del candidato
  - `Education`: Historial educativo
  - `WorkExperience`: Experiencia laboral
  - `Resume`: Archivos de CV

---

## Stack Tecnológico

### Backend Core
- **Runtime**: Node.js
- **Framework Web**: Express.js v4.19.2
- **Lenguaje**: TypeScript v4.9.5
- **ORM**: Prisma v5.13.0
- **Base de Datos**: PostgreSQL

### Librerías Principales
- **multer**: Manejo de subida de archivos (v1.4.5)
- **cors**: Gestión de CORS (v2.8.5)
- **dotenv**: Variables de entorno (v16.4.5)
- **swagger-jsdoc & swagger-ui-express**: Documentación API

### Herramientas de Desarrollo
- **jest**: Framework de testing (v29.7.0)
- **ts-jest**: Soporte TypeScript para Jest
- **eslint & prettier**: Linting y formateo de código
- **ts-node-dev**: Desarrollo con hot-reload

---

## Modelo de Datos (Base de Datos)

### Entidad: Candidate
- **Campos principales**:
  - `id` (PK, autoincremental)
  - `firstName` (VARCHAR 100, requerido)
  - `lastName` (VARCHAR 100, requerido)
  - `email` (VARCHAR 255, único, requerido)
  - `phone` (VARCHAR 15, opcional)
  - `address` (VARCHAR 100, opcional)

### Entidad: Education
- **Campos principales**:
  - `id` (PK, autoincremental)
  - `institution` (VARCHAR 100, requerido)
  - `title` (VARCHAR 250, requerido)
  - `startDate` (DateTime, requerido)
  - `endDate` (DateTime, opcional)
  - `candidateId` (FK a Candidate)

### Entidad: WorkExperience
- **Campos principales**:
  - `id` (PK, autoincremental)
  - `company` (VARCHAR 100, requerido)
  - `position` (VARCHAR 100, requerido)
  - `description` (VARCHAR 200, opcional)
  - `startDate` (DateTime, requerido)
  - `endDate` (DateTime, opcional)
  - `candidateId` (FK a Candidate)

### Entidad: Resume
- **Campos principales**:
  - `id` (PK, autoincremental)
  - `filePath` (VARCHAR 500, requerido)
  - `fileType` (VARCHAR 50, requerido)
  - `uploadDate` (DateTime, requerido)
  - `candidateId` (FK a Candidate)

### Relaciones
- **Candidate** → **Education**: 1 a N (Un candidato puede tener múltiples educaciones)
- **Candidate** → **WorkExperience**: 1 a N (Un candidato puede tener múltiples experiencias)
- **Candidate** → **Resume**: 1 a N (Un candidato puede tener múltiples CVs)

---

## Endpoints Disponibles

### 1. **POST /candidates**
- **Descripción**: Crear un nuevo candidato en el sistema
- **Body**: Datos del candidato (JSON)
- **Respuestas**:
  - `201`: Candidato creado exitosamente
  - `400`: Error de validación o email duplicado
  - `500`: Error interno del servidor

### 2. **POST /upload**
- **Descripción**: Subir archivo de CV (PDF o DOCX)
- **Body**: Multipart form-data con campo `file`
- **Respuestas**:
  - `200`: Archivo subido exitosamente (devuelve `filePath` y `fileType`)
  - `400`: Tipo de archivo inválido
  - `500`: Error en la subida

### 3. **GET /**
- **Descripción**: Endpoint de verificación de salud
- **Respuesta**: "Hola LTI!"

---

## Funcionalidades Clave Implementadas

### 1. **Registro de Candidatos**
- Creación de candidatos con datos personales completos
- Inserción transaccional de datos relacionados (educación, experiencia, CV)
- Validación exhaustiva de todos los campos

### 2. **Validaciones de Datos**
- **Nombres**: Solo letras (incluye ñ y acentos), longitud 2-100 caracteres
- **Email**: Formato válido de email, único en el sistema
- **Teléfono**: Formato español (6|7|9)XXXXXXXX
- **Fechas**: Formato ISO (YYYY-MM-DD)
- **Direcciones**: Máximo 100 caracteres
- **Educación**: Validación de institución, título y fechas
- **Experiencia**: Validación de empresa, posición, descripción y fechas
- **CV**: Validación de estructura de objeto con filePath y fileType

### 3. **Carga de Archivos**
- Soporte para PDF y DOCX
- Límite de tamaño: 10MB
- Nombres únicos usando timestamp
- Filtrado por tipo MIME

### 4. **Manejo de Errores**
- Detección de emails duplicados (Prisma error P2002)
- Validación de campos antes de insertar
- Errores de conexión a base de datos
- Errores de validación con mensajes descriptivos
- Manejo de errores de Multer en uploads

### 5. **CORS y Seguridad**
- CORS configurado para frontend en `localhost:3000`
- Parseo de JSON en requests
- Middleware de logging de peticiones

---

## Flujo de Ejecución Principal

### Flujo: Creación de Candidato

1. **Request**: Cliente envía POST a `/candidates` con datos JSON
2. **Routing**: `candidateRoutes.ts` recibe la petición
3. **Controller**: `candidateController.ts` invoca `addCandidate`
4. **Validación**: `validator.ts` valida todos los campos
5. **Service**: `candidateService.ts` orquesta la creación:
   - Crea candidato principal
   - Itera y crea registros de educación
   - Itera y crea registros de experiencia
   - Crea registro de CV si existe
6. **Domain**: Los modelos (`Candidate`, `Education`, `WorkExperience`, `Resume`) ejecutan operaciones de persistencia via Prisma
7. **Response**: Devuelve candidato creado con status 201 o error apropiado

### Flujo: Carga de CV

1. **Request**: Cliente envía POST a `/upload` con multipart/form-data
2. **Middleware Multer**: Valida tipo de archivo y tamaño
3. **Storage**: Guarda archivo en carpeta `../uploads/` con nombre único
4. **Response**: Devuelve `filePath` y `fileType` para asociar con candidato

---

## Configuración y Despliegue

### Variables de Entorno (.env)
```
DATABASE_URL="postgresql://user:password@host:port/database"
```

### Scripts Disponibles (package.json)
- `npm run dev`: Desarrollo con hot-reload
- `npm run build`: Compilar TypeScript a JavaScript
- `npm start`: Ejecutar versión compilada
- `npm test`: Ejecutar tests con Jest
- `npm run prisma:generate`: Generar cliente Prisma
- `npm run start:prod`: Build + Start

### Puerto del Servidor
- **Puerto**: 3010
- **URL**: `http://localhost:3010`

---

## Patrones de Diseño Utilizados

1. **Layered Architecture**: Separación en capas (Presentación, Aplicación, Dominio)
2. **Service Layer Pattern**: Lógica de negocio centralizada en servicios
3. **Repository Pattern**: Modelos de dominio con métodos `save()` para persistencia
4. **Dependency Injection**: Prisma Client inyectado en request
5. **Middleware Pattern**: CORS, JSON parser, logging, error handling

---

## Consideraciones de Calidad

### Fortalezas
- ✅ Arquitectura limpia y escalable
- ✅ Validaciones exhaustivas de datos
- ✅ Manejo de errores robusto
- ✅ Tipado fuerte con TypeScript
- ✅ ORM para operaciones seguras de BD
- ✅ Documentación OpenAPI

### Áreas de Mejora Potenciales
- ⚠️ No hay endpoints de consulta (GET) de candidatos
- ⚠️ No hay autenticación/autorización
- ⚠️ Falta paginación en posibles listados
- ⚠️ Tests unitarios iniciales pero no completos
- ⚠️ No hay soft delete implementado
- ⚠️ Falta logging estructurado (Winston, etc.)

---

## Conclusión

El sistema implementa un **backend robusto para registro de candidatos** con validaciones exhaustivas, manejo de relaciones complejas y carga de archivos. La arquitectura en capas facilita el mantenimiento y la escalabilidad futura. El proyecto está preparado para implementar TDD mediante los casos de prueba que se derivarán de las historias de usuario.
