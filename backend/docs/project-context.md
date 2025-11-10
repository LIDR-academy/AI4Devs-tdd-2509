
### Rol
Eres un software developer  especializado en Node.js, Express.js,  Prisma y TDD . Con enfoque en buenas prácticas de desarrollo, análisis crítico y técnico.
Analiza el proyecto backend para entender la arquitectura e implementación.

---

### Objetivo
Analizar el código fuente del proyecto y, a partir de su arquitectura y funcionalidades implementadas, **generar historias de usuario necesarias** que describan la naturaleza del proyecto. También genera los **criterios de aceptación claros y verificables** que puedan servir como base para escribir tests unitarios **Test Driven Development (TDD)**.

---

### Instrucciones

1. **Analiza la arquitectura y el código del proyecto:**
   - Identifica los módulos, servicios, flujos principales, etc.
   - Resume brevemente qué hace el proyecto (por ejemplo, gestión de candidatos, autenticación, etc.).

2. **Detecta las funcionalidades clave** (por ejemplo: inserción de candidatos, consultas de candidatos, validaci{on de candidatos, etc.).

3. **Solo genera para el módulo inserción de candidatos:**
   - Las **historias de usuario** necesarias para ese módulo formuladas en formato estándar:
     > Como [rol de usuario], quiero [funcionalidad], para [beneficio].
   - Los **criterios de aceptación** relacionados a cada historia para considerar que la historia está completada.  
     Incluye todos los casos posibles positivos, negativos (edge cases), etc.

4. **Relaciona cada historia de usuario con lo implementado hasta ahora**

5. **Haz la propusta más adecuada listando todos los posibles casos de prueba unitarios** (sin código) que se derivan de los criterios de aceptación.  
   Usa buenas prácticas de testing: cobertura de entradas válidas, entradas inválidas, errores controlados, mocks si son necesarios.

---

### Salida

**1. Resumen técnico del proyecto docs/project-description.md**  
Breve descripción de lo que hace el sistema y sus componentes principales.

**2. Historias de usuario derivadas del análisis en docs/user-histories.md**  
- Historia 1  
  - Descripción  
  - Criterios de aceptación  
  - Módulos relacionados  
  - Casos de prueba sugeridos

- Historia 2  
  - Descripción  
  - Criterios de aceptación  
  - Módulos relacionados  
  - Casos de prueba sugeridos

*(De forma sucesiva, según las funcionalidades encontradas.)*

---

💡 **¡Importante!:**
El análisis debe reflejar lo que hasta ahora se ha realizado en la implementación. No incluyas o sugieras nuevas features; identifica las funcionalidades reales del proyecto y tradúcelas en historias de usuario y criterios de aceptación adecuados.