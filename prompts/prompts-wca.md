# Prompt Historias de usuario

# ROL

Eres un experto en testing de TypeScript y análisis de proyectos de software.

# TAREA:
Analiza la totalidad del proyecto y genera historias de usuario para:
1. Recepción de datos de formulario y  Guardado de datos en base de datos

# REQUISITOS:
- La historia de usuario debe incluir:
  * Título: claro y descriptivo
  * Descripción: contexto y necesidad del usuario
  * Criterios de aceptación: verificables y basados en la funcionalidad real del proyecto

# CONTEXTO:
- Analiza la arquitectura del proyecto
- Identifica tecnologías y frameworks utilizados
- Revisa modelos de datos y esquemas existentes
- Considera validaciones y reglas de negocio implementadas
- Ten en cuenta la estructura de frontend y backend

# FORMATO DE SALIDA:
Presenta cada historia de usuario en formato estándar:

**Historia de Usuario #1: [Título]**
- **Como** [rol/usuario]
- **Quiero** [acción/funcionalidad]
- **Para** [beneficio/objetivo]

**Descripción:**
[Descripción detallada del contexto y necesidad]

**Criterios de Aceptación:**
- [ ] Criterio 1: [descripción verificable]
- [ ] Criterio 2: [descripción verificable]
- [ ] Criterio 3: [descripción verificable]

**Notas Técnicas:**
@README.md , @README.md 

# Rol y Contexto

Eres un experto en testing de TypeScript con dominio en JavaScript, TypeScript y Jest. Tu tarea es generar tests unitarios completos y de calidad profesional que cubran las historias de usuario proporcionadas.

# Objetivo

Generar un archivo de test usando Jest que:
- Cubra completamente ambas historias de usuario proporcionadas
- Siga las mejores prácticas de testing en TypeScript
- Sea mantenible, legible y fácil de entender
- Proporcione cobertura adecuada de casos de éxito y error

# Requisitos Técnicos

## 1. Estructura y Organización
- Usa el patrón **Arrange-Act-Assert (AAA)** en cada test
- Agrupa tests relacionados usando `describe` blocks
- Organiza los tests de manera lógica (por funcionalidad, por caso de uso)

## 2. Convenciones de Nombres
- Nombres de funciones de test descriptivos que indiquen claramente qué se está verificando
- Formato recomendado: `should [acción esperada] when [condición]` o `debe [acción esperada] cuando [condición]`
- Ejemplo: `should throw error when email is invalid` o `debe lanzar error cuando el email es inválido`

## 3. Parametrización
- Para pruebas que siguen un patrón similar pero usan diferentes entradas, usa `test.each` o `describe.each` de Jest
- Evita la duplicación de código manteniendo la legibilidad
- Ejemplo: múltiples casos de validación de email con diferentes formatos

## 4. Mensajes de Afirmación
- Usa mensajes descriptivos en todas las aserciones (`expect().toBe()`, `expect().toThrow()`, etc.)
- Los mensajes deben explicar claramente qué se esperaba y qué se obtuvo
- Ejemplo: `expect(result).toBe(expected, 'El email debe ser válido cuando tiene formato correcto')`

## 5. Casos de Prueba
Incluye tests para:
- **Casos de éxito**: Flujos normales donde todo funciona correctamente
- **Casos límite**: Valores en los bordes de los rangos válidos (mínimos, máximos)
- **Casos de error**: Validaciones que deben fallar, datos inválidos, errores de sistema
- **Casos edge**: Valores vacíos, null, undefined, strings muy largos, caracteres especiales

## 6. Mocking de Dependencias
- **Base de datos**: Si se requiere interacción con base de datos, mockea completamente Prisma Client o cualquier ORM utilizado
- **Servicios externos**: Mockea llamadas HTTP, servicios de archivos, etc.
- **Funciones**: Mockea funciones de utilidad cuando sea necesario para aislar la unidad bajo prueba
- Usa `jest.mock()` o `jest.spyOn()` según corresponda
- Asegúrate de limpiar los mocks entre tests usando `beforeEach` o `afterEach`

## 7. Setup y Teardown
- Usa `beforeEach` y `afterEach` para configurar y limpiar el estado entre tests
- Usa `beforeAll` y `afterAll` solo cuando sea necesario para operaciones costosas

## 8. Cobertura
- Asegúrate de que los tests cubran:
  - Todas las validaciones mencionadas en las historias de usuario
  - Todos los campos requeridos y opcionales
  - Todos los casos de error documentados
  - Las interacciones con la base de datos (mockeadas)

# Formato de Salida

Genera el código del test en un solo archivo ¨llamado tests-wca.test.ts¨ TypeScript (.test.ts) en la carpeta test que:
- Esté completamente funcional y listo para ejecutarse
- Incluya todos los imports necesarios
- Use tipos TypeScript apropiados
- Siga las convenciones del proyecto

# Contexto del Proyecto

@USER_STORIES.md , @AI4Devs-tdd-2509 

---

**Instrucciones finales**: Genera el test completo, asegurándote de que cada requisito esté implementado. El código debe ser production-ready y seguir las mejores prácticas de la industria.