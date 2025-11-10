# Historias de Usuario - Módulo de Inserción de Candidatos

## Historia 1: Registrar un candidato con datos personales básicos

**Descripción:**  
Como **reclutador**, quiero **registrar un nuevo candidato con sus datos personales básicos** (nombre, apellido y email), para **tener un registro inicial del candidato en el sistema**.

**Criterios de Aceptación:**

### Casos Positivos:
- ✅ El sistema debe permitir crear un candidato con nombre, apellido y email válidos
- ✅ El nombre y apellido deben aceptar letras, espacios y caracteres especiales en español (ñ, acentos)
- ✅ El nombre y apellido deben tener entre 2 y 100 caracteres
- ✅ El email debe tener un formato válido (ej: usuario@dominio.com)
- ✅ El email debe ser único en el sistema
- ✅ El sistema debe retornar el candidato creado con su ID asignado
- ✅ El sistema debe retornar código HTTP 201 cuando el candidato se crea exitosamente

### Casos Negativos (Edge Cases):
- ❌ No se debe permitir crear un candidato sin nombre
- ❌ No se debe permitir crear un candidato sin apellido
- ❌ No se debe permitir crear un candidato sin email
- ❌ No se debe permitir crear un candidato con nombre menor a 2 caracteres
- ❌ No se debe permitir crear un candidato con nombre mayor a 100 caracteres
- ❌ No se debe permitir crear un candidato con apellido menor a 2 caracteres
- ❌ No se debe permitir crear un candidato con apellido mayor a 100 caracteres
- ❌ No se debe permitir crear un candidato con nombre que contenga números o caracteres especiales no permitidos
- ❌ No se debe permitir crear un candidato con apellido que contenga números o caracteres especiales no permitidos
- ❌ No se debe permitir crear un candidato con email en formato inválido
- ❌ No se debe permitir crear un candidato con un email que ya existe en la base de datos
- ❌ El sistema debe retornar código HTTP 400 con mensaje de error descriptivo cuando falla la validación
- ❌ El sistema debe retornar mensaje específico "The email already exists in the database" cuando el email está duplicado

**Módulos Relacionados:**
- `src/application/services/candidateService.ts` - Servicio que orquesta la creación
- `src/application/validator.ts` - Valida nombre, apellido y email
- `src/domain/models/Candidate.ts` - Modelo que persiste los datos
- `src/presentation/controllers/candidateController.ts` - Controlador que maneja la petición HTTP
- `src/routes/candidateRoutes.ts` - Ruta POST `/candidates`

**Casos de Prueba Unitarios Sugeridos:**

1. **Validación de nombre:**
   - Debe aceptar nombre válido con letras y espacios
   - Debe aceptar nombre con caracteres especiales en español (ñ, á, é, í, ó, ú)
   - Debe rechazar nombre vacío
   - Debe rechazar nombre con menos de 2 caracteres
   - Debe rechazar nombre con más de 100 caracteres
   - Debe rechazar nombre con números
   - Debe rechazar nombre con caracteres especiales no permitidos

2. **Validación de apellido:**
   - Debe aceptar apellido válido con letras y espacios
   - Debe aceptar apellido con caracteres especiales en español
   - Debe rechazar apellido vacío
   - Debe rechazar apellido con menos de 2 caracteres
   - Debe rechazar apellido con más de 100 caracteres
   - Debe rechazar apellido con números
   - Debe rechazar apellido con caracteres especiales no permitidos

3. **Validación de email:**
   - Debe aceptar email con formato válido
   - Debe rechazar email vacío
   - Debe rechazar email sin @
   - Debe rechazar email sin dominio
   - Debe rechazar email sin extensión de dominio

4. **Servicio addCandidate:**
   - Debe crear candidato exitosamente con datos válidos
   - Debe lanzar error cuando el email ya existe (código P2002)
   - Debe lanzar error cuando falla la validación
   - Debe retornar el candidato creado con ID asignado
   - Mock de Prisma: debe simular creación exitosa
   - Mock de Prisma: debe simular error de email duplicado

5. **Controlador addCandidateController:**
   - Debe retornar código 201 y mensaje de éxito cuando el candidato se crea
   - Debe retornar código 400 con mensaje de error cuando falla la validación
   - Debe retornar código 400 con mensaje específico cuando el email está duplicado
   - Debe manejar errores desconocidos correctamente

---

## Historia 2: Registrar un candidato con datos opcionales (teléfono y dirección)

**Descripción:**  
Como **reclutador**, quiero **agregar información opcional de contacto** (teléfono y dirección) al registrar un candidato, para **tener más formas de contactar al candidato**.

**Criterios de Aceptación:**

### Casos Positivos:
- ✅ El sistema debe permitir crear un candidato sin teléfono
- ✅ El sistema debe permitir crear un candidato sin dirección
- ✅ El sistema debe permitir crear un candidato con teléfono válido
- ✅ El teléfono debe tener formato español válido (9 dígitos, comenzando con 6, 7 o 9)
- ✅ El sistema debe permitir crear un candidato con dirección válida
- ✅ La dirección debe tener máximo 100 caracteres

### Casos Negativos (Edge Cases):
- ❌ No se debe permitir crear un candidato con teléfono en formato inválido
- ❌ No se debe permitir crear un candidato con teléfono que no comience con 6, 7 o 9
- ❌ No se debe permitir crear un candidato con teléfono que no tenga exactamente 9 dígitos
- ❌ No se debe permitir crear un candidato con dirección mayor a 100 caracteres

**Módulos Relacionados:**
- `src/application/validator.ts` - Valida teléfono y dirección (funciones `validatePhone` y `validateAddress`)
- `src/domain/models/Candidate.ts` - Modelo que almacena teléfono y dirección como campos opcionales

**Casos de Prueba Unitarios Sugeridos:**

1. **Validación de teléfono:**
   - Debe aceptar teléfono válido comenzando con 6 (9 dígitos)
   - Debe aceptar teléfono válido comenzando con 7 (9 dígitos)
   - Debe aceptar teléfono válido comenzando con 9 (9 dígitos)
   - Debe aceptar teléfono undefined/null (campo opcional)
   - Debe rechazar teléfono que no comience con 6, 7 o 9
   - Debe rechazar teléfono con menos de 9 dígitos
   - Debe rechazar teléfono con más de 9 dígitos
   - Debe rechazar teléfono con letras o caracteres especiales

2. **Validación de dirección:**
   - Debe aceptar dirección válida con menos de 100 caracteres
   - Debe aceptar dirección con exactamente 100 caracteres
   - Debe aceptar dirección undefined/null (campo opcional)
   - Debe rechazar dirección con más de 100 caracteres

3. **Servicio addCandidate:**
   - Debe crear candidato exitosamente sin teléfono ni dirección
   - Debe crear candidato exitosamente con teléfono válido
   - Debe crear candidato exitosamente con dirección válida
   - Debe crear candidato exitosamente con teléfono y dirección válidos
   - Debe lanzar error cuando el teléfono es inválido
   - Debe lanzar error cuando la dirección excede el límite

---

## Historia 3: Registrar un candidato con información de educación

**Descripción:**  
Como **reclutador**, quiero **agregar información de formación académica** al registrar un candidato, para **conocer el perfil educativo del candidato**.

**Criterios de Aceptación:**

### Casos Positivos:
- ✅ El sistema debe permitir crear un candidato sin información de educación
- ✅ El sistema debe permitir crear un candidato con una o más formaciones académicas
- ✅ Cada formación debe tener institución (máximo 100 caracteres)
- ✅ Cada formación debe tener título (máximo 250 caracteres según schema, pero validación actual permite hasta 100)
- ✅ Cada formación debe tener fecha de inicio en formato YYYY-MM-DD
- ✅ Cada formación puede tener fecha de fin opcional en formato YYYY-MM-DD
- ✅ El sistema debe crear las relaciones de educación asociadas al candidato

### Casos Negativos (Edge Cases):
- ❌ No se debe permitir crear una formación sin institución
- ❌ No se debe permitir crear una formación con institución mayor a 100 caracteres
- ❌ No se debe permitir crear una formación sin título
- ❌ No se debe permitir crear una formación con título mayor a 100 caracteres
- ❌ No se debe permitir crear una formación sin fecha de inicio
- ❌ No se debe permitir crear una formación con fecha de inicio en formato inválido
- ❌ No se debe permitir crear una formación con fecha de fin en formato inválido (si se proporciona)
- ❌ El sistema debe validar todas las formaciones si se proporcionan múltiples

**Módulos Relacionados:**
- `src/application/services/candidateService.ts` - Itera sobre educaciones y las crea después del candidato
- `src/application/validator.ts` - Valida cada educación (función `validateEducation`)
- `src/domain/models/Education.ts` - Modelo que persiste la educación
- `src/domain/models/Candidate.ts` - Modelo que maneja la relación con educaciones

**Casos de Prueba Unitarios Sugeridos:**

1. **Validación de educación:**
   - Debe aceptar educación válida con institución, título y fecha de inicio
   - Debe aceptar educación válida con fecha de fin opcional
   - Debe rechazar educación sin institución
   - Debe rechazar educación con institución mayor a 100 caracteres
   - Debe rechazar educación sin título
   - Debe rechazar educación con título mayor a 100 caracteres
   - Debe rechazar educación sin fecha de inicio
   - Debe rechazar educación con fecha de inicio en formato inválido
   - Debe rechazar educación con fecha de fin en formato inválido (si se proporciona)

2. **Servicio addCandidate con educaciones:**
   - Debe crear candidato exitosamente sin educaciones
   - Debe crear candidato exitosamente con una educación válida
   - Debe crear candidato exitosamente con múltiples educaciones válidas
   - Debe crear las educaciones asociadas al candidato con el candidateId correcto
   - Debe lanzar error cuando alguna educación es inválida
   - Mock de Prisma: debe simular creación de candidato y luego creación de educaciones
   - Mock de Education.save(): debe verificar que se llama con el candidateId correcto

3. **Modelo Education:**
   - Debe crear instancia correctamente con datos válidos
   - Debe convertir fechas string a Date correctamente
   - Debe guardar educación exitosamente en la base de datos
   - Mock de Prisma.education.create: debe simular creación exitosa

---

## Historia 4: Registrar un candidato con experiencia laboral

**Descripción:**  
Como **reclutador**, quiero **agregar información de experiencia laboral** al registrar un candidato, para **conocer el historial profesional del candidato**.

**Criterios de Aceptación:**

### Casos Positivos:
- ✅ El sistema debe permitir crear un candidato sin información de experiencia laboral
- ✅ El sistema debe permitir crear un candidato con una o más experiencias laborales
- ✅ Cada experiencia debe tener empresa (máximo 100 caracteres)
- ✅ Cada experiencia debe tener puesto (máximo 100 caracteres)
- ✅ Cada experiencia puede tener descripción opcional (máximo 200 caracteres)
- ✅ Cada experiencia debe tener fecha de inicio en formato YYYY-MM-DD
- ✅ Cada experiencia puede tener fecha de fin opcional en formato YYYY-MM-DD
- ✅ El sistema debe crear las relaciones de experiencia laboral asociadas al candidato

### Casos Negativos (Edge Cases):
- ❌ No se debe permitir crear una experiencia sin empresa
- ❌ No se debe permitir crear una experiencia con empresa mayor a 100 caracteres
- ❌ No se debe permitir crear una experiencia sin puesto
- ❌ No se debe permitir crear una experiencia con puesto mayor a 100 caracteres
- ❌ No se debe permitir crear una experiencia con descripción mayor a 200 caracteres
- ❌ No se debe permitir crear una experiencia sin fecha de inicio
- ❌ No se debe permitir crear una experiencia con fecha de inicio en formato inválido
- ❌ No se debe permitir crear una experiencia con fecha de fin en formato inválido (si se proporciona)
- ❌ El sistema debe validar todas las experiencias si se proporcionan múltiples

**Módulos Relacionados:**
- `src/application/services/candidateService.ts` - Itera sobre experiencias y las crea después del candidato
- `src/application/validator.ts` - Valida cada experiencia (función `validateExperience`)
- `src/domain/models/WorkExperience.ts` - Modelo que persiste la experiencia laboral
- `src/domain/models/Candidate.ts` - Modelo que maneja la relación con experiencias

**Casos de Prueba Unitarios Sugeridos:**

1. **Validación de experiencia laboral:**
   - Debe aceptar experiencia válida con empresa, puesto y fecha de inicio
   - Debe aceptar experiencia válida con descripción opcional
   - Debe aceptar experiencia válida con fecha de fin opcional
   - Debe rechazar experiencia sin empresa
   - Debe rechazar experiencia con empresa mayor a 100 caracteres
   - Debe rechazar experiencia sin puesto
   - Debe rechazar experiencia con puesto mayor a 100 caracteres
   - Debe rechazar experiencia con descripción mayor a 200 caracteres
   - Debe rechazar experiencia sin fecha de inicio
   - Debe rechazar experiencia con fecha de inicio en formato inválido
   - Debe rechazar experiencia con fecha de fin en formato inválido (si se proporciona)

2. **Servicio addCandidate con experiencias:**
   - Debe crear candidato exitosamente sin experiencias
   - Debe crear candidato exitosamente con una experiencia válida
   - Debe crear candidato exitosamente con múltiples experiencias válidas
   - Debe crear las experiencias asociadas al candidato con el candidateId correcto
   - Debe lanzar error cuando alguna experiencia es inválida
   - Mock de Prisma: debe simular creación de candidato y luego creación de experiencias
   - Mock de WorkExperience.save(): debe verificar que se llama con el candidateId correcto

3. **Modelo WorkExperience:**
   - Debe crear instancia correctamente con datos válidos
   - Debe convertir fechas string a Date correctamente
   - Debe guardar experiencia exitosamente en la base de datos
   - Mock de Prisma.workExperience.create: debe simular creación exitosa

---

## Historia 5: Registrar un candidato con currículum (CV)

**Descripción:**  
Como **reclutador**, quiero **asociar un archivo de currículum** al registrar un candidato, para **tener acceso al CV del candidato en el sistema**.

**Criterios de Aceptación:**

### Casos Positivos:
- ✅ El sistema debe permitir crear un candidato sin currículum
- ✅ El sistema debe permitir crear un candidato con información de currículum
- ✅ El currículum debe tener filePath (ruta del archivo)
- ✅ El currículum debe tener fileType (tipo de archivo)
- ✅ El sistema debe crear la relación de currículum asociada al candidato
- ✅ El sistema debe asignar automáticamente la fecha de subida (uploadDate)

### Casos Negativos (Edge Cases):
- ❌ No se debe permitir crear un currículum sin filePath
- ❌ No se debe permitir crear un currículum sin fileType
- ❌ No se debe permitir crear un currículum donde filePath no sea string
- ❌ No se debe permitir crear un currículum donde fileType no sea string
- ❌ No se debe permitir crear un currículum si el objeto cv está vacío (aunque se proporcione)
- ❌ El sistema debe validar que cv sea un objeto válido

**Módulos Relacionados:**
- `src/application/services/candidateService.ts` - Crea el resume después del candidato si se proporciona cv
- `src/application/validator.ts` - Valida los datos del CV (función `validateCV`)
- `src/domain/models/Resume.ts` - Modelo que persiste el currículum
- `src/domain/models/Candidate.ts` - Modelo que maneja la relación con resumes

**Casos de Prueba Unitarios Sugeridos:**

1. **Validación de CV:**
   - Debe aceptar CV válido con filePath y fileType como strings
   - Debe rechazar CV sin filePath
   - Debe rechazar CV sin fileType
   - Debe rechazar CV donde filePath no sea string
   - Debe rechazar CV donde fileType no sea string
   - Debe rechazar CV si no es un objeto
   - Debe rechazar CV si el objeto está vacío

2. **Servicio addCandidate con CV:**
   - Debe crear candidato exitosamente sin CV
   - Debe crear candidato exitosamente con CV válido
   - Debe crear el CV asociado al candidato con el candidateId correcto
   - Debe asignar automáticamente uploadDate al CV
   - Debe lanzar error cuando el CV es inválido
   - Mock de Prisma: debe simular creación de candidato y luego creación de resume
   - Mock de Resume.save(): debe verificar que se llama con el candidateId correcto

3. **Modelo Resume:**
   - Debe crear instancia correctamente con filePath y fileType
   - Debe asignar automáticamente uploadDate al crear
   - Debe guardar resume exitosamente en la base de datos
   - Debe lanzar error si se intenta actualizar un resume existente (solo permite crear)
   - Mock de Prisma.resume.create: debe simular creación exitosa

---

## Historia 6: Manejo de errores de base de datos al registrar candidato

**Descripción:**  
Como **sistema**, debo **manejar adecuadamente los errores de base de datos** al registrar un candidato, para **proporcionar mensajes de error claros y evitar fallos inesperados**.

**Criterios de Aceptación:**

### Casos Positivos:
- ✅ El sistema debe manejar correctamente la creación exitosa de candidatos

### Casos Negativos (Edge Cases):
- ❌ El sistema debe detectar cuando no hay conexión con la base de datos
- ❌ El sistema debe retornar mensaje específico "No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución." cuando hay error de conexión
- ❌ El sistema debe detectar cuando el email ya existe (código Prisma P2002)
- ❌ El sistema debe retornar mensaje específico "The email already exists in the database" cuando el email está duplicado
- ❌ El sistema debe propagar otros errores de base de datos correctamente
- ❌ El sistema debe retornar código HTTP 400 cuando hay errores de validación o negocio
- ❌ El sistema debe retornar código HTTP 500 cuando hay errores inesperados del servidor

**Módulos Relacionados:**
- `src/domain/models/Candidate.ts` - Maneja errores de Prisma (P2025, PrismaClientInitializationError)
- `src/application/services/candidateService.ts` - Maneja error P2002 (email duplicado)
- `src/presentation/controllers/candidateController.ts` - Maneja errores y retorna códigos HTTP apropiados
- `src/routes/candidateRoutes.ts` - Maneja errores en la ruta

**Casos de Prueba Unitarios Sugeridos:**

1. **Manejo de errores en Candidate.save():**
   - Debe lanzar error específico cuando no hay conexión a BD (PrismaClientInitializationError)
   - Debe lanzar error específico cuando el registro no existe en actualización (P2025)
   - Debe propagar otros errores de Prisma correctamente
   - Mock de Prisma: debe simular error de conexión
   - Mock de Prisma: debe simular error P2025

2. **Manejo de errores en addCandidate:**
   - Debe lanzar error específico cuando el email está duplicado (P2002)
   - Debe propagar errores de validación
   - Debe propagar errores de base de datos
   - Mock de Prisma: debe simular error P2002 (email duplicado)

3. **Manejo de errores en controlador:**
   - Debe retornar código 400 con mensaje cuando hay error de validación
   - Debe retornar código 400 con mensaje cuando el email está duplicado
   - Debe retornar código 400 con mensaje genérico cuando hay error desconocido
   - Debe manejar errores que no son instancias de Error

4. **Manejo de errores en ruta:**
   - Debe retornar código 400 cuando hay error de negocio
   - Debe retornar código 500 cuando hay error inesperado
   - Debe retornar mensaje de error apropiado en la respuesta

---

## Resumen de Módulos Implementados

### Módulos Principales:
1. **Validator** (`src/application/validator.ts`)
   - Validación de datos personales (nombre, apellido, email, teléfono, dirección)
   - Validación de educación
   - Validación de experiencia laboral
   - Validación de CV

2. **CandidateService** (`src/application/services/candidateService.ts`)
   - Orquesta la creación de candidatos y sus relaciones
   - Maneja errores de email duplicado

3. **Models** (`src/domain/models/`)
   - Candidate: Persistencia de candidatos
   - Education: Persistencia de educación
   - WorkExperience: Persistencia de experiencia laboral
   - Resume: Persistencia de currículums

4. **Controllers** (`src/presentation/controllers/candidateController.ts`)
   - Maneja peticiones HTTP para crear candidatos
   - Retorna respuestas apropiadas con códigos HTTP

5. **Routes** (`src/routes/candidateRoutes.ts`)
   - Define endpoint POST `/candidates`
   - Maneja errores de la ruta

### Notas Importantes:
- El sistema actualmente solo implementa la **inserción** de candidatos (POST)
- No se implementan operaciones de consulta, actualización o eliminación
- Las validaciones son exhaustivas y cubren casos positivos y negativos
- El manejo de errores está implementado pero puede mejorarse con más casos específicos
- Los modelos tienen métodos `save()` que manejan creación y actualización, pero en el servicio solo se usa creación

