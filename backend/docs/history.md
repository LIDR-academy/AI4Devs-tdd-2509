# Historias de Usuario - Sistema de Gestión de Candidatos

Este documento contiene las historias de usuario derivadas del análisis del código fuente del sistema ATS. Cada historia incluye criterios de aceptación, módulos relacionados y casos de prueba sugeridos para implementar TDD.

---

## Historia de Usuario 1: Registro de Candidato con Datos Básicos

### Descripción
**Como** reclutador del sistema ATS  
**Quiero** registrar un nuevo candidato con sus datos personales básicos  
**Para** poder gestionar su perfil en el proceso de selección

### Criterios de Aceptación

#### CA-1.1: Registro exitoso con datos mínimos obligatorios
- **Dado** que soy un reclutador autenticado en el sistema
- **Cuando** envío los datos obligatorios del candidato (firstName, lastName, email)
- **Entonces** el sistema crea el candidato en la base de datos
- **Y** devuelve un código HTTP 201
- **Y** devuelve los datos del candidato creado con su ID asignado

#### CA-1.2: Registro con datos completos opcionales
- **Dado** que proporciono datos obligatorios y opcionales (phone, address)
- **Cuando** envío la solicitud de registro
- **Entonces** el sistema almacena todos los datos proporcionados correctamente
- **Y** devuelve el candidato con todos los campos guardados

#### CA-1.3: Validación de nombre (firstName)
- **Dado** que intento registrar un candidato
- **Cuando** el firstName tiene menos de 2 caracteres
- **O** el firstName tiene más de 100 caracteres
- **O** el firstName contiene números o caracteres especiales (excepto ñ, acentos y espacios)
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid name"

#### CA-1.4: Validación de apellido (lastName)
- **Dado** que intento registrar un candidato
- **Cuando** el lastName tiene menos de 2 caracteres
- **O** el lastName tiene más de 100 caracteres
- **O** el lastName contiene números o caracteres especiales (excepto ñ, acentos y espacios)
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid name"

#### CA-1.5: Validación de email único
- **Dado** que existe un candidato con email "juan@example.com"
- **Cuando** intento registrar otro candidato con el mismo email
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "The email already exists in the database"

#### CA-1.6: Validación de formato de email
- **Dado** que proporciono un email inválido (sin @, sin dominio, etc.)
- **Cuando** envío la solicitud de registro
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid email"

#### CA-1.7: Validación de teléfono español
- **Dado** que proporciono un teléfono
- **Cuando** el formato no cumple con el patrón español (6|7|9)XXXXXXXX
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid phone"

#### CA-1.8: Validación de dirección
- **Dado** que proporciono una dirección
- **Cuando** la dirección excede 100 caracteres
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid address"

### Módulos Relacionados
- `src/routes/candidateRoutes.ts` (Endpoint POST /candidates)
- `src/presentation/controllers/candidateController.ts` (addCandidateController)
- `src/application/services/candidateService.ts` (addCandidate)
- `src/application/validator.ts` (validateCandidateData, validateName, validateEmail, validatePhone, validateAddress)
- `src/domain/models/Candidate.ts` (Clase Candidate, método save)
- `prisma/schema.prisma` (Modelo Candidate)

### Casos de Prueba Sugeridos

#### Tests Unitarios - validator.ts

1. **validateName()**
   - ✅ Acepta nombres válidos: "Juan", "María José", "José María", "Ñoño"
   - ✅ Acepta nombres con acentos: "José", "María", "Álvaro"
   - ❌ Rechaza nombres con menos de 2 caracteres: "J"
   - ❌ Rechaza nombres con más de 100 caracteres
   - ❌ Rechaza nombres con números: "Juan123"
   - ❌ Rechaza nombres con caracteres especiales: "Juan@", "Juan#"
   - ❌ Rechaza nombres vacíos o null/undefined

2. **validateEmail()**
   - ✅ Acepta emails válidos: "test@example.com", "user.name@domain.co.uk"
   - ❌ Rechaza emails sin @: "testexample.com"
   - ❌ Rechaza emails sin dominio: "test@"
   - ❌ Rechaza emails sin TLD: "test@example"
   - ❌ Rechaza emails vacíos o null/undefined
   - ❌ Rechaza emails con espacios: "test @example.com"

3. **validatePhone()**
   - ✅ Acepta teléfonos válidos: "612345678", "712345678", "912345678"
   - ✅ Acepta phone como undefined/null (campo opcional)
   - ❌ Rechaza teléfonos que no empiezan con 6, 7 o 9: "512345678"
   - ❌ Rechaza teléfonos con menos de 9 dígitos: "61234567"
   - ❌ Rechaza teléfonos con más de 9 dígitos: "6123456789"
   - ❌ Rechaza teléfonos con letras: "61234567a"

4. **validateAddress()**
   - ✅ Acepta direcciones válidas de hasta 100 caracteres
   - ✅ Acepta address como undefined/null (campo opcional)
   - ❌ Rechaza direcciones con más de 100 caracteres

#### Tests de Integración - candidateService.ts

5. **addCandidate() - Casos positivos**
   - ✅ Crea candidato con datos mínimos obligatorios (firstName, lastName, email)
   - ✅ Crea candidato con todos los campos (incluyendo phone y address)
   - ✅ Asigna ID autoincremental al candidato creado
   - ✅ Devuelve objeto con estructura correcta

6. **addCandidate() - Casos negativos**
   - ❌ Lanza error al intentar crear candidato con email duplicado
   - ❌ Lanza error si faltan campos obligatorios
   - ❌ Lanza error si los datos no pasan validación
   - ❌ Maneja correctamente error de base de datos (Prisma error P2002)

#### Tests E2E - Endpoint POST /candidates

7. **Endpoint POST /candidates**
   - ✅ Retorna 201 al crear candidato exitosamente
   - ✅ Retorna candidato creado con ID en el body
   - ❌ Retorna 400 con mensaje de error cuando datos son inválidos
   - ❌ Retorna 400 cuando email ya existe
   - ❌ Retorna 500 en caso de error interno del servidor

---

## Historia de Usuario 2: Registro de Historial Educativo del Candidato

### Descripción
**Como** reclutador del sistema ATS  
**Quiero** registrar el historial educativo de un candidato junto con sus datos personales  
**Para** tener información completa de su formación académica

### Criterios de Aceptación

#### CA-2.1: Registro de candidato con una educación
- **Dado** que estoy registrando un nuevo candidato
- **Cuando** incluyo un objeto educations con una entrada válida (institution, title, startDate)
- **Entonces** el sistema crea el candidato y su registro de educación asociado
- **Y** la educación queda vinculada al candidato mediante candidateId

#### CA-2.2: Registro de candidato con múltiples educaciones
- **Dado** que estoy registrando un nuevo candidato
- **Cuando** incluyo un array educations con múltiples entradas válidas
- **Entonces** el sistema crea todos los registros de educación vinculados al candidato

#### CA-2.3: Registro de educación con fecha de finalización
- **Dado** que incluyo una educación completada
- **Cuando** proporciono startDate y endDate
- **Entonces** el sistema almacena ambas fechas correctamente

#### CA-2.4: Registro de educación sin fecha de finalización (en curso)
- **Dado** que la educación está en curso
- **Cuando** proporciono solo startDate y omito endDate
- **Entonces** el sistema almacena la educación con endDate como null

#### CA-2.5: Validación de institución
- **Dado** que incluyo una educación
- **Cuando** el campo institution está vacío o excede 100 caracteres
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid institution"

#### CA-2.6: Validación de título
- **Dado** que incluyo una educación
- **Cuando** el campo title está vacío o excede 100 caracteres
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid title"

#### CA-2.7: Validación de fecha de inicio
- **Dado** que incluyo una educación
- **Cuando** startDate no cumple el formato YYYY-MM-DD
- **O** startDate está vacío
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid date"

#### CA-2.8: Validación de fecha de finalización
- **Dado** que incluyo endDate en una educación
- **Cuando** endDate no cumple el formato YYYY-MM-DD
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid end date"

### Módulos Relacionados
- `src/application/services/candidateService.ts` (lógica de creación de educations)
- `src/application/validator.ts` (validateEducation)
- `src/domain/models/Education.ts` (Clase Education, método save)
- `prisma/schema.prisma` (Modelo Education con relación a Candidate)

### Casos de Prueba Sugeridos

#### Tests Unitarios - validator.ts

1. **validateEducation()**
   - ✅ Acepta educación válida completa (institution, title, startDate, endDate)
   - ✅ Acepta educación sin endDate (en curso)
   - ✅ Acepta institution y title con longitud máxima de 100 caracteres
   - ❌ Rechaza education sin institution
   - ❌ Rechaza institution con más de 100 caracteres
   - ❌ Rechaza education sin title
   - ❌ Rechaza title con más de 100 caracteres
   - ❌ Rechaza education sin startDate
   - ❌ Rechaza startDate con formato inválido: "2020/01/01", "01-01-2020"
   - ❌ Rechaza endDate con formato inválido

#### Tests de Integración - candidateService.ts

2. **addCandidate() con educations**
   - ✅ Crea candidato con un registro de educación asociado
   - ✅ Crea candidato con múltiples registros de educación (2-3 educations)
   - ✅ Asigna correctamente el candidateId a cada educación
   - ✅ Permite educations como array vacío o undefined
   - ✅ Convierte correctamente strings de fechas a objetos Date
   - ❌ Lanza error si alguna educación no pasa validación

#### Tests del Modelo Education.ts

3. **Education.save()**
   - ✅ Crea nuevo registro de educación en BD cuando no tiene id
   - ✅ Actualiza registro existente cuando tiene id
   - ✅ Almacena correctamente institution, title, startDate, endDate
   - ✅ Permite endDate como null/undefined

---

## Historia de Usuario 3: Registro de Experiencia Laboral del Candidato

### Descripción
**Como** reclutador del sistema ATS  
**Quiero** registrar la experiencia laboral de un candidato junto con sus datos personales  
**Para** evaluar su trayectoria profesional

### Criterios de Aceptación

#### CA-3.1: Registro de candidato con una experiencia laboral
- **Dado** que estoy registrando un nuevo candidato
- **Cuando** incluyo un objeto workExperiences con una entrada válida (company, position, startDate)
- **Entonces** el sistema crea el candidato y su registro de experiencia asociado
- **Y** la experiencia queda vinculada al candidato mediante candidateId

#### CA-3.2: Registro de candidato con múltiples experiencias laborales
- **Dado** que estoy registrando un nuevo candidato
- **Cuando** incluyo un array workExperiences con múltiples entradas válidas
- **Entonces** el sistema crea todos los registros de experiencia vinculados al candidato

#### CA-3.3: Registro de experiencia con descripción
- **Dado** que incluyo una experiencia laboral
- **Cuando** proporciono el campo description
- **Entonces** el sistema almacena la descripción correctamente

#### CA-3.4: Registro de experiencia sin descripción
- **Dado** que incluyo una experiencia laboral
- **Cuando** omito el campo description
- **Entonces** el sistema almacena la experiencia con description como null

#### CA-3.5: Registro de experiencia con fecha de finalización
- **Dado** que incluyo una experiencia completada
- **Cuando** proporciono startDate y endDate
- **Entonces** el sistema almacena ambas fechas correctamente

#### CA-3.6: Registro de experiencia actual (sin fecha de finalización)
- **Dado** que el candidato está trabajando actualmente
- **Cuando** proporciono solo startDate y omito endDate
- **Entonces** el sistema almacena la experiencia con endDate como null

#### CA-3.7: Validación de empresa
- **Dado** que incluyo una experiencia laboral
- **Cuando** el campo company está vacío o excede 100 caracteres
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid company"

#### CA-3.8: Validación de posición
- **Dado** que incluyo una experiencia laboral
- **Cuando** el campo position está vacío o excede 100 caracteres
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid position"

#### CA-3.9: Validación de descripción
- **Dado** que incluyo description en una experiencia
- **Cuando** description excede 200 caracteres
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid description"

#### CA-3.10: Validación de fechas de experiencia
- **Dado** que incluyo una experiencia laboral
- **Cuando** startDate no cumple el formato YYYY-MM-DD o está vacío
- **O** endDate (si se proporciona) no cumple el formato YYYY-MM-DD
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje de error correspondiente

### Módulos Relacionados
- `src/application/services/candidateService.ts` (lógica de creación de workExperiences)
- `src/application/validator.ts` (validateExperience)
- `src/domain/models/WorkExperience.ts` (Clase WorkExperience, método save)
- `prisma/schema.prisma` (Modelo WorkExperience con relación a Candidate)

### Casos de Prueba Sugeridos

#### Tests Unitarios - validator.ts

1. **validateExperience()**
   - ✅ Acepta experiencia válida completa (company, position, description, startDate, endDate)
   - ✅ Acepta experiencia sin description (campo opcional)
   - ✅ Acepta experiencia sin endDate (trabajo actual)
   - ✅ Acepta company y position con longitud máxima de 100 caracteres
   - ✅ Acepta description con longitud máxima de 200 caracteres
   - ❌ Rechaza experience sin company
   - ❌ Rechaza company con más de 100 caracteres
   - ❌ Rechaza experience sin position
   - ❌ Rechaza position con más de 100 caracteres
   - ❌ Rechaza description con más de 200 caracteres
   - ❌ Rechaza experience sin startDate
   - ❌ Rechaza startDate con formato inválido
   - ❌ Rechaza endDate con formato inválido

#### Tests de Integración - candidateService.ts

2. **addCandidate() con workExperiences**
   - ✅ Crea candidato con un registro de experiencia asociado
   - ✅ Crea candidato con múltiples registros de experiencia (2-3 experiences)
   - ✅ Asigna correctamente el candidateId a cada experiencia
   - ✅ Permite workExperiences como array vacío o undefined
   - ✅ Almacena correctamente description cuando se proporciona
   - ✅ Permite description como null/undefined
   - ✅ Convierte correctamente strings de fechas a objetos Date
   - ❌ Lanza error si alguna experiencia no pasa validación

#### Tests del Modelo WorkExperience.ts

3. **WorkExperience.save()**
   - ✅ Crea nuevo registro de experiencia en BD cuando no tiene id
   - ✅ Actualiza registro existente cuando tiene id
   - ✅ Almacena correctamente company, position, description, startDate, endDate
   - ✅ Permite description como null/undefined
   - ✅ Permite endDate como null/undefined

---

## Historia de Usuario 4: Carga de Currículum del Candidato

### Descripción
**Como** reclutador del sistema ATS  
**Quiero** cargar el currículum del candidato en formato digital (PDF o DOCX)  
**Para** tener acceso al documento completo durante el proceso de selección

### Criterios de Aceptación

#### CA-4.1: Carga de archivo PDF
- **Dado** que tengo un archivo CV en formato PDF
- **Cuando** subo el archivo mediante el endpoint /upload
- **Entonces** el sistema almacena el archivo en el servidor
- **Y** devuelve código HTTP 200
- **Y** devuelve un objeto con filePath y fileType (application/pdf)

#### CA-4.2: Carga de archivo DOCX
- **Dado** que tengo un archivo CV en formato DOCX
- **Cuando** subo el archivo mediante el endpoint /upload
- **Entonces** el sistema almacena el archivo en el servidor
- **Y** devuelve código HTTP 200
- **Y** devuelve un objeto con filePath y fileType (application/vnd.openxmlformats-officedocument.wordprocessingml.document)

#### CA-4.3: Generación de nombre único de archivo
- **Dado** que subo un archivo CV
- **Cuando** el archivo se procesa
- **Entonces** el sistema genera un nombre único usando timestamp
- **Y** preserva la extensión original del archivo

#### CA-4.4: Rechazo de tipos de archivo no permitidos
- **Dado** que intento subir un archivo que no es PDF ni DOCX (ej: .jpg, .txt, .exe)
- **Cuando** envío la solicitud de upload
- **Entonces** el sistema rechaza el archivo con código HTTP 400
- **Y** devuelve el mensaje "Invalid file type, only PDF and DOCX are allowed!"

#### CA-4.5: Límite de tamaño de archivo
- **Dado** que intento subir un archivo mayor a 10MB
- **Cuando** envío la solicitud de upload
- **Entonces** el sistema rechaza el archivo con código HTTP 500
- **Y** devuelve un error de Multer indicando exceso de tamaño

#### CA-4.6: Asociación de CV con candidato
- **Dado** que he subido un archivo CV exitosamente
- **Cuando** creo un candidato incluyendo el objeto cv con filePath y fileType
- **Entonces** el sistema crea un registro Resume asociado al candidato
- **Y** almacena filePath, fileType y uploadDate

#### CA-4.7: Validación de objeto CV en candidato
- **Dado** que estoy registrando un candidato con CV
- **Cuando** el objeto cv no contiene filePath o fileType
- **O** filePath o fileType no son strings
- **Entonces** el sistema rechaza la solicitud con código HTTP 400
- **Y** devuelve el mensaje "Invalid CV data"

#### CA-4.8: Candidato sin CV
- **Dado** que estoy registrando un candidato
- **Cuando** no incluyo el campo cv o lo envío como objeto vacío
- **Entonces** el sistema crea el candidato sin registros de Resume asociados

### Módulos Relacionados
- `src/application/services/fileUploadService.ts` (uploadFile, configuración multer)
- `src/application/validator.ts` (validateCV)
- `src/application/services/candidateService.ts` (lógica de asociación CV)
- `src/domain/models/Resume.ts` (Clase Resume, método save)
- `src/index.ts` (endpoint POST /upload)
- `prisma/schema.prisma` (Modelo Resume con relación a Candidate)

### Casos de Prueba Sugeridos

#### Tests Unitarios - fileUploadService.ts

1. **Configuración de Multer - fileFilter()**
   - ✅ Acepta archivos con mimetype 'application/pdf'
   - ✅ Acepta archivos con mimetype 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
   - ❌ Rechaza archivos con mimetype 'image/jpeg'
   - ❌ Rechaza archivos con mimetype 'text/plain'
   - ❌ Rechaza archivos con mimetype 'application/octet-stream'

2. **Configuración de Storage**
   - ✅ Genera nombre único con timestamp
   - ✅ Preserva extensión original del archivo
   - ✅ Guarda en directorio '../uploads/'

#### Tests Unitarios - validator.ts

3. **validateCV()**
   - ✅ Acepta objeto CV válido con filePath y fileType como strings
   - ✅ Permite cv como undefined o objeto vacío (campo opcional)
   - ❌ Rechaza cv sin campo filePath
   - ❌ Rechaza cv sin campo fileType
   - ❌ Rechaza cv con filePath que no es string
   - ❌ Rechaza cv con fileType que no es string
   - ❌ Rechaza cv que no es un objeto

#### Tests de Integración - uploadFile endpoint

4. **Endpoint POST /upload**
   - ✅ Retorna 200 al subir PDF válido
   - ✅ Retorna 200 al subir DOCX válido
   - ✅ Retorna objeto con filePath y fileType
   - ✅ Almacena archivo en sistema de archivos
   - ❌ Retorna 400 al intentar subir archivo de tipo no permitido
   - ❌ Retorna 500 al intentar subir archivo mayor a 10MB
   - ❌ Maneja correctamente errores de Multer

#### Tests de Integración - candidateService.ts con CV

5. **addCandidate() con CV**
   - ✅ Crea candidato con registro Resume asociado
   - ✅ Asigna correctamente el candidateId al Resume
   - ✅ Almacena filePath y fileType proporcionados
   - ✅ Genera automáticamente uploadDate con fecha actual
   - ✅ Permite candidato sin CV (cv undefined u objeto vacío)
   - ❌ Lanza error si objeto CV no pasa validación

#### Tests del Modelo Resume.ts

6. **Resume.save()**
   - ✅ Crea nuevo registro Resume en BD
   - ✅ Almacena correctamente candidateId, filePath, fileType, uploadDate
   - ❌ Lanza error al intentar actualizar Resume existente (no permitido)

---

## Historia de Usuario 5: Validación de Datos Completos del Candidato

### Descripción
**Como** sistema ATS  
**Quiero** validar exhaustivamente todos los datos de entrada antes de persistirlos  
**Para** garantizar la integridad y calidad de la información en la base de datos

### Criterios de Aceptación

#### CA-5.1: Validación en cascada de candidato completo
- **Dado** que recibo una solicitud de creación de candidato
- **Cuando** invoco validateCandidateData
- **Entonces** el sistema valida en orden:
  - Datos personales (firstName, lastName, email, phone, address)
  - Cada elemento del array educations (si existe)
  - Cada elemento del array workExperiences (si existe)
  - El objeto cv (si existe y no está vacío)

#### CA-5.2: Fallo rápido en validaciones
- **Dado** que algún campo no pasa validación
- **Cuando** se ejecuta validateCandidateData
- **Entonces** el sistema lanza un error inmediatamente
- **Y** no continúa validando los campos restantes
- **Y** devuelve un mensaje de error específico del campo que falló

#### CA-5.3: Omisión de validación al actualizar candidato
- **Dado** que el objeto de datos incluye un campo id
- **Cuando** se ejecuta validateCandidateData
- **Entonces** el sistema omite las validaciones de campos obligatorios
- **Y** asume que se está editando un candidato existente

#### CA-5.4: Validación de arrays vacíos
- **Dado** que envío educations como array vacío []
- **O** workExperiences como array vacío []
- **Cuando** se ejecuta validateCandidateData
- **Entonces** el sistema acepta los arrays vacíos sin error

#### CA-5.5: Validación de campos undefined
- **Dado** que omito campos opcionales (phone, address, educations, workExperiences, cv)
- **Cuando** se ejecuta validateCandidateData
- **Entonces** el sistema acepta los valores undefined sin error

### Módulos Relacionados
- `src/application/validator.ts` (validateCandidateData y todas las funciones validate*)
- `src/application/services/candidateService.ts` (invocación de validateCandidateData)

### Casos de Prueba Sugeridos

#### Tests Unitarios - validator.ts

1. **validateCandidateData() - Flujo completo**
   - ✅ Acepta candidato completo con todos los campos válidos
   - ✅ Acepta candidato solo con campos obligatorios
   - ✅ Acepta candidato con educations y workExperiences vacíos
   - ✅ Acepta candidato sin cv
   - ✅ Omite validaciones cuando data.id está presente
   - ❌ Lanza error al primer campo inválido encontrado
   - ❌ No valida campos posteriores si uno anterior falla

2. **validateCandidateData() - Validación de arrays**
   - ✅ Valida todos los elementos del array educations
   - ✅ Valida todos los elementos del array workExperiences
   - ❌ Lanza error si algún elemento de educations es inválido
   - ❌ Lanza error si algún elemento de workExperiences es inválido

3. **validateCandidateData() - Casos edge**
   - ✅ Acepta data sin phone (opcional)
   - ✅ Acepta data sin address (opcional)
   - ✅ Acepta cv como objeto vacío {}
   - ❌ Rechaza data sin firstName
   - ❌ Rechaza data sin lastName
   - ❌ Rechaza data sin email

---

## Historia de Usuario 6: Manejo de Errores y Excepciones

### Descripción
**Como** sistema ATS  
**Quiero** manejar y reportar errores de forma clara y específica  
**Para** facilitar la depuración y proporcionar feedback útil a los usuarios

### Criterios de Aceptación

#### CA-6.1: Detección de email duplicado (Constraint violation)
- **Dado** que intento crear un candidato con un email ya existente
- **Cuando** se produce el error de Prisma P2002 (unique constraint)
- **Entonces** el sistema captura la excepción
- **Y** lanza un nuevo error con mensaje "The email already exists in the database"
- **Y** el endpoint devuelve código HTTP 400

#### CA-6.2: Error de conexión a base de datos
- **Dado** que la base de datos no está disponible
- **Cuando** intento guardar un candidato
- **Entonces** el sistema captura PrismaClientInitializationError
- **Y** lanza error con mensaje "No se pudo conectar con la base de datos..."

#### CA-6.3: Error de registro no encontrado
- **Dado** que intento actualizar un candidato que no existe
- **Cuando** se produce el error de Prisma P2025 (record not found)
- **Entonces** el sistema lanza error con mensaje "No se pudo encontrar el registro del candidato..."

#### CA-6.4: Error de validación de datos
- **Dado** que los datos de entrada no pasan las validaciones
- **Cuando** se invoca validateCandidateData
- **Entonces** se lanza un error con mensaje específico del campo inválido
- **Y** el controlador captura el error
- **Y** devuelve código HTTP 400 con el mensaje de error

#### CA-6.5: Manejo de errores en el endpoint
- **Dado** que ocurre un error durante el procesamiento
- **Cuando** el error es una instancia de Error
- **Entonces** el endpoint devuelve status 400 y { message: error.message }
- **Cuando** el error es desconocido
- **Entonces** el endpoint devuelve status 500 y { message: "An unexpected error occurred" }

#### CA-6.6: Error en carga de archivo - Multer
- **Dado** que ocurre un error de Multer durante el upload
- **Cuando** es un MulterError
- **Entonces** el sistema devuelve status 500 y { error: err.message }
- **Cuando** es otro tipo de error
- **Entonces** el sistema devuelve status 500 y { error: err.message }

#### CA-6.7: Middleware global de manejo de errores
- **Dado** que ocurre un error no capturado en la aplicación
- **Cuando** se ejecuta el middleware de error global
- **Entonces** el sistema registra el stack trace en consola
- **Y** devuelve status 500 con mensaje "Something broke!"

### Módulos Relacionados
- `src/domain/models/Candidate.ts` (manejo de errores Prisma en save)
- `src/application/services/candidateService.ts` (captura y re-throw de errores)
- `src/routes/candidateRoutes.ts` (manejo de errores en endpoint)
- `src/application/services/fileUploadService.ts` (manejo de errores Multer)
- `src/index.ts` (middleware global de errores)

### Casos de Prueba Sugeridos

#### Tests de Integración - candidateService.ts

1. **Manejo de errores de base de datos**
   - ❌ Captura y transforma error P2002 (email duplicado)
   - ❌ Propaga correctamente el mensaje de error personalizado
   - ❌ Maneja error de conexión a BD
   - ❌ Maneja error de registro no encontrado (P2025)

#### Tests E2E - candidateRoutes.ts

2. **Respuestas de error del endpoint POST /candidates**
   - ❌ Retorna 400 cuando datos son inválidos
   - ❌ Retorna 400 con mensaje descriptivo del error
   - ❌ Retorna 400 cuando email duplicado
   - ❌ Retorna 500 para errores inesperados
   - ✅ Estructura de error: { message: string }

#### Tests del fileUploadService

3. **Manejo de errores en upload**
   - ❌ Retorna 500 con mensaje de MulterError
   - ❌ Retorna 400 cuando archivo no cumple filtro
   - ❌ Retorna error descriptivo en cada caso

#### Tests del Middleware Global

4. **Middleware de error global**
   - ❌ Retorna status 500 para errores no capturados
   - ❌ Registra stack trace en consola
   - ❌ Devuelve Content-Type: text/plain
   - ❌ Mensaje: "Something broke!"

---

## Historia de Usuario 7: Persistencia de Entidades Relacionadas

### Descripción
**Como** sistema ATS  
**Quiero** persistir de forma transaccional el candidato y sus entidades relacionadas  
**Para** mantener la integridad referencial y consistencia de los datos

### Criterios de Aceptación

#### CA-7.1: Creación transaccional de candidato completo
- **Dado** que recibo datos de candidato con educations, workExperiences y cv
- **Cuando** invoco addCandidate
- **Entonces** el sistema:
  1. Crea el registro Candidate
  2. Obtiene el ID del candidato creado
  3. Crea cada registro Education asociándolo con candidateId
  4. Crea cada registro WorkExperience asociándolo con candidateId
  5. Crea el registro Resume asociándolo con candidateId
  6. Devuelve el candidato creado

#### CA-7.2: Asignación correcta de claves foráneas
- **Dado** que se crea un candidato con entidades relacionadas
- **Cuando** se persisten en la base de datos
- **Entonces** cada Education tiene el candidateId correcto
- **Y** cada WorkExperience tiene el candidateId correcto
- **Y** cada Resume tiene el candidateId correcto

#### CA-7.3: Actualización de candidato existente
- **Dado** que un candidato tiene un id
- **Cuando** invoco el método save() del modelo Candidate
- **Entonces** el sistema ejecuta UPDATE en lugar de CREATE
- **Y** utiliza la cláusula WHERE { id: this.id }

#### CA-7.4: Creación de candidato nuevo
- **Dado** que un candidato no tiene id
- **Cuando** invoco el método save() del modelo Candidate
- **Entonces** el sistema ejecuta CREATE
- **Y** devuelve el candidato con el id autoasignado

#### CA-7.5: Actualización de entidades relacionadas
- **Dado** que Education/WorkExperience tienen un id
- **Cuando** invoco su método save()
- **Entonces** el sistema ejecuta UPDATE en el registro existente

#### CA-7.6: Restricción de actualización de Resume
- **Dado** que un Resume ya existe (tiene id)
- **Cuando** intento invocar save()
- **Entonces** el sistema lanza error "No se permite la actualización de un currículum existente"

### Módulos Relacionados
- `src/application/services/candidateService.ts` (flujo completo de creación)
- `src/domain/models/Candidate.ts` (método save con lógica create/update)
- `src/domain/models/Education.ts` (método save con lógica create/update)
- `src/domain/models/WorkExperience.ts` (método save con lógica create/update)
- `src/domain/models/Resume.ts` (método save solo create)

### Casos de Prueba Sugeridos

#### Tests de Integración - candidateService.ts

1. **Flujo completo de creación**
   - ✅ Crea candidato y todas sus entidades en orden correcto
   - ✅ Asigna candidateId a cada entidad relacionada
   - ✅ Devuelve candidato con id asignado
   - ✅ Permite crear candidato sin entidades relacionadas

2. **Secuencia de persistencia**
   - ✅ Primero crea Candidate
   - ✅ Luego crea Education iterando sobre el array
   - ✅ Luego crea WorkExperience iterando sobre el array
   - ✅ Finalmente crea Resume si existe

#### Tests del Modelo Candidate.ts

3. **Candidate.save() - Creación**
   - ✅ Ejecuta prisma.candidate.create cuando this.id es undefined
   - ✅ Incluye solo campos definidos en candidateData
   - ✅ Maneja educations, workExperiences y resumes relacionados
   - ✅ Devuelve candidato creado con id

4. **Candidate.save() - Actualización**
   - ✅ Ejecuta prisma.candidate.update cuando this.id existe
   - ✅ Usa WHERE { id: this.id }
   - ✅ Actualiza solo campos proporcionados

#### Tests de Modelos de Entidades Relacionadas

5. **Education.save() y WorkExperience.save()**
   - ✅ Ejecuta create cuando no tiene id
   - ✅ Ejecuta update cuando tiene id
   - ✅ Incluye candidateId en los datos

6. **Resume.save()**
   - ✅ Ejecuta create para nuevo resume
   - ❌ Lanza error si intenta actualizar resume existente
   - ✅ Genera automáticamente uploadDate con fecha actual

---

## Resumen de Funcionalidades Detectadas

### Funcionalidades Implementadas
1. ✅ Registro de candidatos con datos personales básicos
2. ✅ Registro de historial educativo del candidato
3. ✅ Registro de experiencia laboral del candidato
4. ✅ Carga y almacenamiento de archivos CV (PDF/DOCX)
5. ✅ Validaciones exhaustivas de todos los campos
6. ✅ Manejo de errores y excepciones específicas
7. ✅ Persistencia transaccional de entidades relacionadas

### Funcionalidades NO Implementadas (fuera del alcance actual)
- ❌ Consulta de candidatos (GET endpoints)
- ❌ Actualización de candidatos existentes
- ❌ Eliminación de candidatos
- ❌ Autenticación y autorización
- ❌ Paginación y filtros en listados
- ❌ Búsqueda de candidatos
- ❌ Soft delete

---

## Cobertura de Testing Recomendada

### Prioridad Alta
1. Tests unitarios de todas las funciones de validación (validator.ts)
2. Tests de integración del servicio addCandidate
3. Tests E2E del endpoint POST /candidates
4. Tests de manejo de errores (email duplicado, validaciones)

### Prioridad Media
5. Tests de los modelos de dominio (save methods)
6. Tests del servicio de upload de archivos
7. Tests de configuración de Multer

### Prioridad Baja
8. Tests del middleware de error global
9. Tests de conversión de fechas
10. Tests de construcción de objetos

---

## Métricas de Cobertura Objetivo

- **Líneas de código**: 80%+
- **Funciones**: 90%+
- **Ramas**: 75%+
- **Validaciones**: 100% (crítico)
- **Servicios**: 85%+
- **Controladores**: 80%+

---

## Conclusión

Este documento proporciona **7 historias de usuario** completas derivadas del análisis del código fuente, con un total de **más de 50 criterios de aceptación** y **más de 60 casos de prueba** sugeridos para implementar un enfoque TDD robusto.

Las historias cubren todas las funcionalidades implementadas en el sistema y proporcionan una base sólida para escribir tests unitarios, de integración y E2E que garanticen la calidad del código.
