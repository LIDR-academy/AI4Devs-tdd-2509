# All the Prompts!

Para el ejercicio se ha utilizado inicialmente GLM-4.6 para obtener un prompt con las mejores prácticas aprindidas en la lección en curso
## Prompt 1
``` markdown
Actúa como un desarrollador senior experto en TypeScript y en el framework de pruebas ts-jest. Tu tarea es generar pruebas unitarias completo y robusto en TypeScript usando ts-jest para el plan de pruebas en @prompts/plan_pruebas.md.

Sigue estrictamente las siguientes directrices y mejores prácticas para cada prueba unitaria realizada:

**1. Nomenclatura de Pruebas:**
- Utiliza un bloque `describe` principal para la clase o módulo que se está probando. El nombre debe ser claro, ej. `describe('UserService', () => { ... });`.
- Utiliza bloques `it` o `test` para cada caso de prueba específico. El nombre debe seguir el formato "should [expected outcome] when [condition or scenario]", traducido al español: "debería [resultado esperado] cuando [condición o escenario]".
  - Ejemplo: `it('debería retornar el usuario cuando se encuentra por su ID', () => { ... });`
  - Ejemplo: `it('debería lanzar un error si el usuario no es encontrado', () => { ... });`

**2. Estructura AAA (Arrange, Act, Assert):**
- Organiza cada prueba con la estructura AAA para máxima claridad.
  - **Arrange (Preparar):** Comenta esta sección. Aquí se instancia la clase, se configuran los mocks y se preparan los datos de entrada.
  - **Act (Actuar):** Comenta esta sección. Aquí se ejecuta el método que se está probando.
  - **Assert (Afirmar):** Comenta esta sección. Aquí se verifican los resultados y las interacciones usando `expect`.

**3. Pruebas Parametrizadas:**
- Si identificas patrones de prueba similares que solo difieren en los datos de entrada y salida, utiliza `test.each` para parametrizar las pruebas y evitar la duplicación de código.

**4. Mensajes en las Afirmaciones:**
- Incluye un mensaje descriptivo como segundo argumento en las afirmaciones `expect` para facilitar la depuración cuando una prueba falla.
  - Ejemplo: `expect(result.name).toBe('John Doe', 'El nombre del usuario no es el esperado.');`

**5. Casos Límite (Edge Cases):**
- Identifica y prueba explícitamente los casos límite y las condiciones de error. Esto incluye, pero no se limita a:
  - Entradas `null` o `undefined`.
  - Cadenas de texto vacías (`''`).
  - Valores numéricos como `0` o números negativos.
  - Arreglos vacíos (`[]`).
  - Comportamiento cuando una dependencia externa falla o retorna un valor inesperado.

**6. Mocking de Dependencias:**
- Identifica todas las dependencias externas de la clase (ej. bases de datos, APIs, otros servicios, módulos del filesystem).
- Usa `jest.mock('<ruta-del-modulo>')` al principio del archivo para mockear módulos completos.
- Usa `jest.fn()` para crear funciones mock y controlar su comportamiento (`.mockReturnValue()`, `.mockResolvedValue()`, `.mockRejectedValue()`).
- Asegúrate de verificar las interacciones con los mocks usando `.toHaveBeenCalled()`, `.toHaveBeenCalledWith(args)`, `.toHaveBeenCalledTimes(n)`, etc.
- **Especialmente para la base de datos:** Si la clase interactúa con una base de datos (a través de un repositorio, un ORM como Prisma/TypeORM, o un cliente directo), mockea completamente esa capa. Las pruebas no deben depender de una base de datos real. Puedes usar la documentación en https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o#mock-prisma-client para mockear la base de datos.

**Formato de Salida:**
- Genera únicamente el código del archivo de pruebas (`.test.ts`). No incluyas explicaciones adicionales a menos que se soliciten.
- Asegúrate de que el código TypeScript para cada prueba generada sea válido y compile correctamente.
```

Pero antes de iniciar el ejercicio se prefiere llevar a cabo una exploración usando claude code en modo planificador y con profundidad para obtener de todo el código las pruebas a realizar y haga el plan para la aplicación del prompt anterior.

## Prompt 2
``` markdown
eres un ingeniero de software expeciaalista en pruebas unitarias para aplicaciones desarroladas en typescript que usa ts-jest.  Analiza la base de código existente identificando el código que aún no cuenta con pruebas unitarias y genera un plan para el desarrollo de las mismas. Al final de la ejecución del plan se pretende tener una cobertura de no menos del 90% del código. NO generes código, identifica el código sin pruebas y acótalo a pruebas unitarias. El plan generado será pasado a un desarrollador seniio experto para su futura implementación.
```

## Prompt 3

/clear

## Prompt 4

pegamos el promt refinado de la parte inicial
---
va a ejecutar las pruebas, pero ello llenaría la ventana de contexto.  Prefiero continúe con las pruebas de front
queda pendiente ~/Desktop/lidr/AI4Devs-tdd-2509/backend && npm test -- --coverage --verbose

 Las pruebas están listas para ejecutarse. Para probarlas, necesitarás instalar las dependencias faltantes de Babel en el frontend:

  cd frontend
  npm install --save-dev @babel/preset-env @babel/preset-react babel-jest identity-obj-proxy

  Luego puedes ejecutar:
  npm test                 # Ejecutar pruebas
  npm run test:coverage    # Ejecutar con reporte de cobertura

## Prompt 5
```actualiza el readme del proyecto, con una sección acerca de cómo ejecutar las pruebas para los dos proyectos ``

## CONCLUSIONES

El código de pruebas incluyó pruebas de la implementación... hay que refinar el prompt
Cómo se quería probar el proyecto completo, no se sacó un solo script como se solicitó inicialmente (más cercano a un ejercicio real)
El consumo de todo el ejercicio de una sola 'lanzada' consumió gran parte de la ventana de contexto.
Ésta estrategia en un proyecto grande la hubiese volcado
 Context Usage
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛀ ⛀   claude-sonnet-4-5-20250929 · 167k/200k tokens (83%)
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ 
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   ⛁ System prompt: 2.7k tokens (1.3%)
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   ⛁ System tools: 14.6k tokens (7.3%)
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   ⛁ MCP tools: 1.3k tokens (0.6%)
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   ⛁ Memory files: 1.2k tokens (0.6%)
     ⛁ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Messages: 102.0k tokens (51.0%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛝ ⛝ ⛝   ⛶ Free space: 33k (16.6%)
     ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛝ Autocompact buffer: 45.0k tokens (22.5%)
     ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ 

Al final del ejercicio faltaron algunas dependencias que el mismo agente solucionó.
El código al hacer las pruebas solicitó algunos cambios.  Hay que evaluar los tradeoffs entre cambiar la implementación (para saber si realmente aporta a mantenibilidad o solo a las pruebas)

