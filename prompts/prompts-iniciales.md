# All the Prompts!

Para el ejercicio se ha utilizado inicialmente GLM-4.6 para obtener un prompt con las mejores prácticas aprindidas en la lección en curso
## Prompt 1
``` markdown
Actúa como un desarrollador senior experto en TypeScript y en el framework de pruebas ts-jest. Tu tarea es generar un archivo de pruebas unitarias completo y robusto en TypeScript usando ts-jest para el archivo de código que te proporcionaré a continuación.

Sigue estrictamente las siguientes directrices y mejores prácticas:

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
- **Especialmente para la base de datos:** Si la clase interactúa con una base de datos (a través de un repositorio, un ORM como Prisma/TypeORM, o un cliente directo), mockea completamente esa capa. Las pruebas no deben depender de una base de datos real.

**Formato de Salida:**
- Genera únicamente el código del archivo de pruebas (`.spec.ts` o `.test.ts`). No incluyas explicaciones adicionales a menos que se soliciten.
- Asegúrate de que el código TypeScript sea válido y compile correctamente.

--- CÓDIGO DE USUARIO AQUI ---
```

Pero antes de iniciar el ejercicio se prefiere llevar a cabo una exploración usando claude code en modo planificador y con profundidad para obtener de todo el código las pruebas a realizar y haga el plan para la aplicación del prompt anterior.

## Prompt 2
``` markdown
eres un ingeniero de software expeciaalista en pruebas unitarias para aplicaciones desarroladas en typescript que usa ts-jest.  Analiza la base de código existente identificando el código que aún no cuenta con pruebas unitarias y genera un plan para el desarrollo de las mismas. Al final de la ejecución del plan se pretende tener una cobertura de no menos del 90% del código. NO generes código, identifica el código sin pruebas y acótalo a pruebas unitarias. El plan generado será pasado a un desarrollador seniio experto para su futura implementación.
```

## Prompt 3
You said \"historically\" and I think that might be a key word. In the last couple of years we've been in an economic downturn (do you agree?) and most job postings have been bombarded with applications in a very short time. Do you have any experience or data about the last couple of years?

## Prompt 4
I like the updated list a lot but I can't help noticing that it only has 14 items compared to the original 15. What's missing?

## Prompt 4
Wonderful! So now we have a prioritised list of features if we want to build something similar to what is offered today. Using your experience and knowledge of recruitment trends and technological advances (e.g. AI), what are some _new_ features that we could add, and what are some features that could stand to be updated?

## Prompt 5
Sure, give me a broad system architecture!

## Prompt 5
Can you output the diagram as mermaid JS?

## Prompt 5
Add a Lean Canvas diagram to understand the business model

## Prompt 6
Sorry, I meant, please _generate_ a Lean Canvas diagram. Separately.

## Prompt 7
Can you make it look more like a traditional LC diagram? See here for an example: https://www.leanfoundry.com/articles/what-is-lean-canvas
If Mermaid is limiting, propose some other tool.

## Prompt 8
OK, let's use plantuml. Can you regenerate the diagram, adhering strictly to the layout of the example I gave you before?

## Prompt 8
Still not what I want. How about you generate HTML (with CSS in the file) for this template: https://litslink.com/wp-content/uploads/2020/06/google-lean-canvas-model-1.png

## Prompt 9
OK, I'm going to try some other tool. Of the OpenAI LLMs, available to me, which one is most probable to generate an HTML version of that table?

## Prompt 10
I don't know what 4 Turbo is. I have 4o, 4, 4.5 (that's you), 3-mini-high (which says it's \"great at coding and logic\")

## Prompt 10
What do you mean you're currently using GPT-4? It says right here it's using GPT-4.5.

## Prompt 11
OK, then generate a self-contained HTML file that looks as close as possible to this image.

_At this point, I gave up on GPT-4.5 and switched to Claude for this task. It produced the HTML file I wanted._

## Prompt 12
_Back in ChatGPT:_
I've created a lean canvas as html (referenced). Can you read it and list the 12 headings here?

## Prompt 13
I like your suggestions, but we need terser language so that it fits in the template. Can you boil down the content you have and rehash it for me here?

## Prompt 13
I need you to combine the things we already agreed on with your new suggestions, and then distill that so that it's fits in the template.

## Prompt 14:

Diving deeper into the system design, what are the 10 most important use cases (in order) the way you'd describe them to a fellow software analyst?

## Prompt 15:

Please make use case diagrams in plantuml for the following 3 cases:
1. Candidate Resume Submission & Parsing
2. AI-driven Candidate Screening & Ranking
3. Conversational Chatbot Screening

## Prompt 16:

Now, switching hats to your role as an experienced software architect, render an entity-relationship diagram in mermaid.

## Prompt 17:

Keep your architect hat on. We need to decide on an architecture for this system. Propose 3 alternatives to some reasonable level of detail and argue for the best one.

## Prompt 18:

Please generate a suggested system diagram using plantuml, assuming we are going to host the system on AWS.

## Prompt 19:

Can you use the AWS icons from the plantuml stdlib?

## Prompt 20:

That didn't quite work — it returns a 404 for the `Compute/ECS.puml`. Can you use the bundled icons using the syntax `!include <awslib/...>` instead of referencing the web?

## Prompt 21:

That didn't work either. Looking at docs, it seems like version 18 is built in, and can be referenced like this:
```
!include <aws/common>
!include <aws/Compute/AmazonECS/AmazonECS>
```
The rest of the references also need to be updated. Can you do that? You might find useful info at https://github.com/milo-minderbinder/AWS-PlantUML

_Here I gave up on ChatGPT for a while and switched to Copilot in VS Code. It did a much better job of getting the AWS imports right, but ultimately it, too, failed, possibly because the diagram itself wasn't correct._


## Prompt 22:

_Back in ChatGPT:_
I've lost a lot of time trying to get that to work. What are some other options for rendering this diagram?

## Prompt 23:

Let's go with python. What do I need?

## Prompt 24:

1st, please note that I had to work to fix the file to get it running. When making changes, please refer to the working file.  
2nd, I'm very uncomfortable with all these components talking directly to the database. They should probably talk to the core service, unless you can come up with something better.  
3rd, please lay out the diagram from left to right instead of top to bottom.

## Prompt 25:

Write a half-page introduction to ATS/LTI followed by a list of how it stands out in the competition and what value it adds. After that, a list of the main functionality, basically the 15 features we discussed before. Put it at the beginning of the README.

## Prompt 26:

Please expand on each of the features.

---

* Please make a Use Case diagram for the use case "Candidate Resume Submission & Parsing".  Render it as PlantUML and add a few lines of textual explanation.
* Please make a Use Case diagram for the use case "AI-driven Candidate Screening & Ranking".  Render it as PlantUML and add a few lines of textual explanation.
* Please make a Use Case diagram for the use case "Conversational Chatbot Screening".  Render it as PlantUML and add a few lines of textual explanation.

---

* Generate a top-level C4 diagram (the "first C") for the system. Use PlantUML with the built-in C4 library.
* Generate a C4 "container" diagram for the system. Use PlantUML with the built-in C4 library.
* Generate a C4 "component" diagram for the "AI Microservices" component. Use PlantUML with the built-in C4 library.
Completar el ejercicio: rellenar el prompt y el archivo de test
Crear una nueva rama para tu entregable con el nombre tests-iniciales
Hacer commit
⁠Git push
En la interfaz de tu repositorio te saldrá un aviso arriba para hacer ⁠Pull request


