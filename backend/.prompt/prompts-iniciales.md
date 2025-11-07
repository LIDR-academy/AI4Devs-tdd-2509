# Prompts Iniciales 

---

## Prompt 1: Analisis del proyecto

**Objetivo:** Analizar el proyecto y revisar su estructura y componentes.

**Entrada:** `backend`

**Archivo prompt:** `project-context.md`

**Salida:** Archivo con el analisis del proyecto `backend/docs/description.md`

---

## Prompt 2: Generación de Historias de Usuario

**Objetivo:** Generar historias de usuario a partir del análisis del proyecto.  

**Entrada:** `backend/docs/description.md`

**Archivo prompt:** `project-context.md`

**Salida:** Archivo con las historias de usuario generadas `backend/docs/history.md`

---

## Prompt 3: Generación de Tests Unitarios en Jest
**Objetivo:** Generar tests unitarios en Jest a partir de los casos de prueba planificados.

**Entrada:** `backend/docs/history.md`  

**Archivo prompt:** `.generate-test.md`

**Salida:** Archivos de test unitario por historia, validados y verificados: `backend/src/tests/historia-usuario-<numero>.test.ts`

---


# Prompt 4: Seguimiento del Progreso

**Objetivo:** Hacer seguimiento del progreso de la generación de historias de usuario y tests unitarios.

**Entrada:** - Estado de los archivos generados **.test.ts.

**Archivo prompt:** `.generate-test.md`

**Salida:** Archivo de seguimiento del progreso:  `backend/.prompt/complete.md`
