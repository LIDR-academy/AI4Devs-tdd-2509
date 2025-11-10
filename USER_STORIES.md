# Historias de Usuario - Sistema de Seguimiento de Talento (LTI)

## Historia de Usuario #1: Recepción de Datos de Formulario de Candidato

- **Como** reclutador/usuario del sistema
- **Quiero** poder ingresar y validar los datos de un candidato a través de un formulario web
- **Para** registrar información completa y estructurada de los candidatos de manera eficiente

**Descripción:**

El sistema debe proporcionar una interfaz de formulario web que permita al usuario ingresar información completa de un candidato, incluyendo datos personales (nombre, apellido, email, teléfono, dirección), información educativa (múltiples registros con institución, título y fechas), experiencia laboral (múltiples registros con empresa, puesto, descripción y fechas), y la capacidad de subir un archivo de CV. El formulario debe validar los datos en el lado del cliente antes de enviarlos al backend, proporcionando retroalimentación inmediata al usuario sobre errores de validación.

**Criterios de Aceptación:**

- [ ] El formulario debe incluir campos para: nombre, apellido, email, teléfono (opcional), dirección (opcional)
- [ ] El formulario debe permitir agregar múltiples registros de educación con campos: institución, título, fecha de inicio, fecha de fin (opcional)
- [ ] El formulario debe permitir agregar múltiples registros de experiencia laboral con campos: empresa, puesto, descripción (opcional), fecha de inicio, fecha de fin (opcional)
- [ ] El formulario debe incluir un componente de carga de archivos para CV (PDF o DOCX)
- [ ] El formulario debe validar que el nombre y apellido contengan solo letras, espacios y caracteres especiales del español (ñ, acentos), con longitud entre 2 y 100 caracteres
- [ ] El formulario debe validar que el email tenga un formato válido según el patrón regex: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
- [ ] El formulario debe validar que el teléfono (si se proporciona) tenga formato español válido: 9 dígitos comenzando con 6, 7 o 9 según el patrón: `/^(6|7|9)\d{8}$/`
- [ ] El formulario debe validar que la dirección (si se proporciona) no exceda 100 caracteres
- [ ] El formulario debe validar que las fechas estén en formato YYYY-MM-DD
- [ ] El formulario debe validar que los campos de educación (institución y título) no excedan 100 caracteres cada uno
- [ ] El formulario debe validar que los campos de experiencia laboral (empresa y puesto) no excedan 100 caracteres cada uno, y la descripción no exceda 200 caracteres
- [ ] El formulario debe permitir eliminar registros de educación y experiencia laboral antes de enviar
- [ ] El formulario debe mostrar mensajes de error claros cuando los datos no cumplan las validaciones
- [ ] El formulario debe formatear las fechas a formato YYYY-MM-DD antes de enviarlas al backend
- [ ] El componente de carga de archivos debe validar que el archivo sea PDF o DOCX y no exceda 10MB
- [ ] El componente de carga de archivos debe mostrar el estado de carga (loading) durante la subida del archivo
- [ ] El formulario debe enviar los datos al endpoint POST http://localhost:3010/candidates con Content-Type: application/json
- [ ] El formulario debe mostrar un mensaje de éxito cuando el candidato se registre correctamente (status 201)
- [ ] El formulario debe mostrar un mensaje de error cuando falle el registro (status 400 o 500)

**Notas Técnicas:**

- Frontend: React con Bootstrap, componente AddCandidateForm.js
- Validaciones del lado del cliente deben coincidir con las validaciones del backend
- El componente FileUploader.js maneja la subida de archivos por separado al endpoint /upload
- Las fechas se manejan con react-datepicker y se convierten a formato ISO (YYYY-MM-DD) antes del envío
- El estado del formulario se gestiona con useState de React
- La comunicación con el backend se realiza mediante fetch API

---

## Historia de Usuario #2: Guardado de Datos en Base de Datos

- **Como** sistema backend
- **Quiero** recibir, validar y persistir los datos del candidato en la base de datos PostgreSQL
- **Para** almacenar de forma segura y estructurada la información de los candidatos con todas sus relaciones

**Descripción:**

El sistema backend debe recibir los datos del candidato a través del endpoint POST /candidates, validar todos los campos según las reglas de negocio establecidas, y guardar la información en la base de datos PostgreSQL utilizando Prisma ORM. El proceso debe manejar la creación del candidato principal y sus relaciones (educaciones, experiencias laborales y CV) de forma transaccional, asegurando la integridad de los datos. El sistema debe manejar errores apropiadamente, incluyendo validaciones de formato, restricciones de unicidad (email) y errores de conexión a la base de datos.

**Criterios de Aceptación:**

- [ ] El endpoint POST /candidates debe recibir datos JSON en el body de la petición
- [ ] El sistema debe validar que firstName y lastName existan, tengan entre 2 y 100 caracteres y cumplan el patrón: `/^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/`
- [ ] El sistema debe validar que email exista, tenga formato válido según: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` y sea único en la base de datos
- [ ] El sistema debe validar que phone (opcional) cumpla el patrón: `/^(6|7|9)\d{8}$/` si se proporciona
- [ ] El sistema debe validar que address (opcional) no exceda 100 caracteres si se proporciona
- [ ] El sistema debe validar cada educación en el array educations: institución (requerido, max 100 chars), título (requerido, max 100 chars), startDate (requerido, formato YYYY-MM-DD), endDate (opcional, formato YYYY-MM-DD)
- [ ] El sistema debe validar cada experiencia laboral en el array workExperiences: empresa (requerido, max 100 chars), puesto (requerido, max 100 chars), descripción (opcional, max 200 chars), startDate (requerido, formato YYYY-MM-DD), endDate (opcional, formato YYYY-MM-DD)
- [ ] El sistema debe validar que cv (opcional) sea un objeto con filePath (string) y fileType (string) si se proporciona
- [ ] El sistema debe crear el registro del candidato en la tabla Candidate con los campos: firstName, lastName, email, phone, address
- [ ] El sistema debe crear los registros relacionados en la tabla Education asociados al candidato creado
- [ ] El sistema debe crear los registros relacionados en la tabla WorkExperience asociados al candidato creado
- [ ] El sistema debe crear el registro relacionado en la tabla Resume asociado al candidato creado si se proporciona cv
- [ ] El sistema debe retornar status 201 con mensaje "Candidate added successfully" y los datos del candidato creado cuando la operación sea exitosa
- [ ] El sistema debe retornar status 400 con mensaje de error descriptivo cuando falle la validación de datos
- [ ] El sistema debe retornar status 400 con mensaje "The email already exists in the database" cuando se intente crear un candidato con un email duplicado (error P2002 de Prisma)
- [ ] El sistema debe manejar errores de conexión a la base de datos y retornar un mensaje apropiado
- [ ] El sistema debe manejar errores de Prisma (P2025 para registro no encontrado) y retornar mensajes descriptivos
- [ ] El sistema debe preservar la integridad referencial: todas las relaciones (educations, workExperiences, resumes) deben tener candidateId válido
- [ ] El sistema debe crear el candidato primero y luego las relaciones en orden secuencial (educations, workExperiences, resume)

**Notas Técnicas:**

- Backend: Express.js con TypeScript
- ORM: Prisma Client para PostgreSQL
- Arquitectura: Capas separadas (presentation/controllers, application/services, domain/models)
- Validaciones: validator.ts en application layer
- Modelos de dominio: Candidate, Education, WorkExperience, Resume
- El servicio candidateService.ts orquesta la validación y el guardado
- El modelo Candidate.save() maneja la creación/actualización del candidato principal
- Los modelos Education, WorkExperience y Resume tienen métodos save() independientes
- La validación se ejecuta antes de cualquier operación de base de datos
- El email tiene constraint UNIQUE en el schema de Prisma
- Las fechas se almacenan como DateTime en PostgreSQL
- Los campos opcionales en el schema: phone, address, endDate (en Education y WorkExperience), description (en WorkExperience)

