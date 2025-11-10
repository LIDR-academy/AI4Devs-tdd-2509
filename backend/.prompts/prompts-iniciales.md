
# Prompts Iniciales 

---

## Prompt 1: Analisis del proyecto

**Objetivo:** Analizar el proyecto y revisar su estructura y componentes.

**Entrada:** `backend`

**Archivo prompt:** `docs/project-context.md`

**Salida:** Archivo con el analisis del proyecto `docs/project-description.md`

---

## Prompt 2: Generación de Historias de Usuario

**Objetivo:** Generar historias de usuario a partir del análisis de un archivo de entrada.  

**Entrada:** `backend/docs/project-description.md`

**Archivo prompt:** `backend/docs/project-context.md`

**Salida:** Archivo con las historias de usuario generadas `backend/docs/user-histories.md`

---

## Prompt 3: Generación de Tests Unitarios en Jest
**Rol:** Ingenero de Software experto en TypeScript y TDD
**Objetivo:** Generar tests unitarios en Jest a partir de las historias de usuario planificadas. 

**Entradas:** 
- Revisar la estructura de test`backend/src/_tests_`
- Analizar `backend/docs/project-description.md` para tener contexto
- Analizar`backend/docs/user-histories.md` para implementar los tests unitarios sugeridos de cada historia de usuario propuesta en ese documento.

**Salidas:**
- Archivos de test unitario por historia, validados y verificados: `backend/src/_tests_/historia-usuario-<numero>.test.ts`
- Documenta cada uno de los tests ya validados y ponlos todos en un solo archivo en la siguiente ruta: `backend/docs/tests-validados.md`

---