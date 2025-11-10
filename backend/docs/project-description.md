# Descripción Técnica del Proyecto

## Resumen

Este proyecto es un **sistema de gestión de candidatos** desarrollado con Node.js, Express.js y Prisma. El sistema permite registrar y gestionar información de candidatos para procesos de selección, incluyendo sus datos personales, formación académica, experiencia laboral y currículums (CVs).

## Arquitectura

El proyecto sigue una **arquitectura en capas** (Layered Architecture) que separa las responsabilidades en diferentes niveles:

### 1. Capa de Presentación (`src/presentation/`)
- **Controllers**: Manejan las peticiones HTTP y las respuestas
  - `candidateController.ts`: Controlador para operaciones de candidatos
- **Routes**: Define los endpoints de la API REST
  - `candidateRoutes.ts`: Rutas para `/candidates`

### 2. Capa de Aplicación (`src/application/`)
- **Services**: Contienen la lógica de negocio
  - `candidateService.ts`: Servicio principal para agregar candidatos
  - `fileUploadService.ts`: Servicio para subir archivos de CV (PDF y DOCX)
- **Validator**: Validaciones de datos de entrada
  - `validator.ts`: Valida datos de candidatos, educación, experiencia laboral y CVs

### 3. Capa de Dominio (`src/domain/models/`)
- **Models**: Entidades del dominio con lógica de persistencia
  - `Candidate.ts`: Modelo principal de candidato con método `save()` y `findOne()`
  - `Education.ts`: Modelo de formación académica
  - `WorkExperience.ts`: Modelo de experiencia laboral
  - `Resume.ts`: Modelo de currículum

### 4. Infraestructura
- **Prisma ORM**: Gestión de base de datos PostgreSQL
- **Express.js**: Framework web para Node.js
- **Multer**: Middleware para manejo de archivos

## Base de Datos

El esquema de base de datos (Prisma) incluye las siguientes entidades:

- **Candidate**: Información personal del candidato (nombre, apellido, email único, teléfono, dirección)
- **Education**: Formación académica relacionada con un candidato (institución, título, fechas)
- **WorkExperience**: Experiencia laboral relacionada con un candidato (empresa, puesto, descripción, fechas)
- **Resume**: Archivos de currículum asociados a un candidato (ruta del archivo, tipo, fecha de subida)

## Funcionalidades Principales

### 1. Inserción de Candidatos
- **Endpoint**: `POST /candidates`
- **Funcionalidad**: Permite registrar un nuevo candidato con:
  - Datos personales obligatorios: nombre, apellido, email
  - Datos opcionales: teléfono, dirección
  - Educación (múltiples registros)
  - Experiencia laboral (múltiples registros)
  - Currículum (archivo)

### 2. Validaciones Implementadas
- **Nombres**: Solo letras, espacios y caracteres especiales en español (ñ, acentos), longitud entre 2 y 100 caracteres
- **Email**: Formato válido de email, único en la base de datos
- **Teléfono**: Formato español (9 dígitos, comenzando con 6, 7 o 9)
- **Dirección**: Máximo 100 caracteres
- **Educación**: Institución y título requeridos, fechas en formato YYYY-MM-DD
- **Experiencia Laboral**: Empresa y puesto requeridos, descripción opcional (máx. 200 caracteres)
- **CV**: Debe ser objeto con `filePath` y `fileType` válidos

### 3. Subida de Archivos
- **Endpoint**: `POST /upload`
- **Funcionalidades**:
  - Acepta archivos PDF y DOCX
  - Tamaño máximo: 10MB
  - Almacena archivos en `../uploads/` con nombre único basado en timestamp

## Tecnologías y Dependencias

### Runtime y Framework
- **Node.js**: Entorno de ejecución
- **Express.js**: Framework web
- **TypeScript**: Lenguaje de programación

### Base de Datos
- **PostgreSQL**: Base de datos relacional
- **Prisma**: ORM y herramienta de migraciones

### Testing
- **Jest**: Framework de testing
- **ts-jest**: Transpilador TypeScript para Jest

### Utilidades
- **Multer**: Manejo de archivos multipart/form-data
- **CORS**: Configurado para permitir peticiones desde `http://localhost:3000`
- **dotenv**: Gestión de variables de entorno

## Configuración del Proyecto

- **Puerto**: 3010
- **CORS**: Habilitado para origen `http://localhost:3000`
- **Base de datos**: PostgreSQL (configurada mediante variable de entorno `DATABASE_URL`)
- **Directorio de uploads**: `../uploads/`

## Estructura de Directorios

```
backend/
├── src/
│   ├── __tests__/          # Tests unitarios y helpers
│   ├── application/        # Lógica de aplicación (servicios, validadores)
│   ├── domain/            # Modelos de dominio
│   ├── presentation/       # Controladores
│   ├── routes/            # Definición de rutas
│   └── index.ts           # Punto de entrada de la aplicación
├── prisma/
│   └── schema.prisma      # Esquema de base de datos
├── docs/                  # Documentación del proyecto
└── package.json          # Dependencias y scripts
```

## Flujo Principal: Inserción de Candidatos

1. **Request HTTP**: Cliente envía `POST /candidates` con datos del candidato
2. **Validación**: El servicio valida todos los datos según las reglas de negocio
3. **Creación del Candidato**: Se crea una instancia del modelo `Candidate` y se guarda en la base de datos
4. **Relaciones**: Si se proporcionan, se crean los registros relacionados:
   - Educaciones (tabla `Education`)
   - Experiencias laborales (tabla `WorkExperience`)
   - Currículum (tabla `Resume`)
5. **Respuesta**: Se retorna el candidato creado con código HTTP 201

## Manejo de Errores

- **Errores de validación**: Retornan código 400 con mensaje descriptivo
- **Email duplicado**: Error específico cuando el email ya existe (código Prisma P2002)
- **Errores de base de datos**: Manejo de errores de conexión y registros no encontrados
- **Errores de archivo**: Validación de tipo y tamaño de archivo en uploads

## Estado Actual del Proyecto

El proyecto está en fase de desarrollo con:
- ✅ Arquitectura en capas implementada
- ✅ Modelo de datos completo (Prisma schema)
- ✅ Servicio de inserción de candidatos funcional
- ✅ Validaciones de datos implementadas
- ✅ Servicio de subida de archivos
- ✅ Configuración de testing con Jest y mocks de Prisma
- ⚠️ Solo implementado el módulo de **inserción de candidatos** (POST)

