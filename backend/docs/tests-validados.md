# Tests Unitarios Validados

Este documento contiene la documentación completa de todos los tests unitarios implementados para el módulo de inserción de candidatos, organizados por historias de usuario.

## Resumen General

- **Total de archivos de test:** 6
- **Total de tests:** 112 tests
- **Cobertura:** Todas las historias de usuario del módulo de inserción
- **Framework:** Jest con TypeScript
- **Estrategia:** Mocks de PrismaClient para aislamiento completo de la base de datos
- **Estado:** ✅ Todos los tests pasando correctamente

---

## Resultados de Ejecución Reciente

**Fecha de última ejecución:** Noviembre 2024

### Resumen de Ejecución

```
✅ Historia 1: 25/25 tests pasando (~6.8s)
✅ Historia 2: 21/21 tests pasando (~7.1s)
✅ Historia 3: 17/17 tests pasando (~6.9s)
✅ Historia 4: 19/19 tests pasando (~6.7s)
✅ Historia 5: 16/16 tests pasando (~6.6s)
✅ Historia 6: 14/14 tests pasando (~11.2s)

TOTAL: 112/112 tests pasando (100% éxito)
Tiempo total: ~45.3 segundos
```

### Comandos de Ejecución Utilizados

Todos los tests fueron ejecutados individualmente usando:
```bash
npm test -- historia-usuario-X.test.ts
```

Donde X es el número de historia (1-6).

### Observaciones

- ✅ Todos los tests pasaron sin errores
- ✅ Los mocks de PrismaClient funcionan correctamente
- ✅ Los tests de timers (fake timers) en Historia 5 funcionan correctamente
- ⚠️ Se detectaron algunos `console.log` en la salida (línea 28 de `Resume.ts` y línea 84 de `Candidate.ts`), pero no afectan la funcionalidad de los tests

---

## Historia 1: Registrar un candidato con datos personales básicos

**Archivo:** `backend/src/__tests__/unit/historia-usuario-1.test.ts`

### Descripción
Tests para validar la creación de candidatos con nombre, apellido y email. Cubre validaciones de formato, longitud y unicidad del email.

### Tests Implementados

#### Validación de nombre (7 tests)
1. ✅ Debe aceptar nombre válido con letras y espacios
2. ✅ Debe aceptar nombre con caracteres especiales en español (ñ, á, é, í, ó, ú)
3. ✅ Debe rechazar nombre vacío
4. ✅ Debe rechazar nombre con menos de 2 caracteres
5. ✅ Debe rechazar nombre con más de 100 caracteres
6. ✅ Debe rechazar nombre con números
7. ✅ Debe rechazar nombre con caracteres especiales no permitidos

#### Validación de apellido (7 tests)
1. ✅ Debe aceptar apellido válido con letras y espacios
2. ✅ Debe aceptar apellido con caracteres especiales en español
3. ✅ Debe rechazar apellido vacío
4. ✅ Debe rechazar apellido con menos de 2 caracteres
5. ✅ Debe rechazar apellido con más de 100 caracteres
6. ✅ Debe rechazar apellido con números
7. ✅ Debe rechazar apellido con caracteres especiales no permitidos

#### Validación de email (5 tests)
1. ✅ Debe aceptar email con formato válido
2. ✅ Debe rechazar email vacío
3. ✅ Debe rechazar email sin @
4. ✅ Debe rechazar email sin dominio
5. ✅ Debe rechazar email sin extensión de dominio

#### Servicio addCandidate (4 tests)
1. ✅ Debe crear candidato exitosamente con datos válidos
2. ✅ Debe lanzar error cuando el email ya existe (código P2002)
3. ✅ Debe lanzar error cuando falla la validación
4. ✅ Debe retornar el candidato creado con ID asignado

#### Modelo Candidate.save() (2 tests)
1. ✅ Debe simular creación exitosa
2. ✅ Debe simular error de email duplicado

**Total de tests en Historia 1:** 25 tests

---

## Historia 2: Registrar un candidato con datos opcionales (teléfono y dirección)

**Archivo:** `backend/src/__tests__/unit/historia-usuario-2.test.ts`

### Descripción
Tests para validar la creación de candidatos con teléfono y dirección opcionales. Valida formato de teléfono español y longitud de dirección.

### Tests Implementados

#### Validación de teléfono (10 tests)
1. ✅ Debe aceptar teléfono válido comenzando con 6 (9 dígitos)
2. ✅ Debe aceptar teléfono válido comenzando con 7 (9 dígitos)
3. ✅ Debe aceptar teléfono válido comenzando con 9 (9 dígitos)
4. ✅ Debe aceptar teléfono undefined (campo opcional)
5. ✅ Debe aceptar teléfono null (campo opcional)
6. ✅ Debe rechazar teléfono que no comience con 6, 7 o 9
7. ✅ Debe rechazar teléfono con menos de 9 dígitos
8. ✅ Debe rechazar teléfono con más de 9 dígitos
9. ✅ Debe rechazar teléfono con letras
10. ✅ Debe rechazar teléfono con caracteres especiales

#### Validación de dirección (5 tests)
1. ✅ Debe aceptar dirección válida con menos de 100 caracteres
2. ✅ Debe aceptar dirección con exactamente 100 caracteres
3. ✅ Debe aceptar dirección undefined (campo opcional)
4. ✅ Debe aceptar dirección null (campo opcional)
5. ✅ Debe rechazar dirección con más de 100 caracteres

#### Servicio addCandidate con datos opcionales (6 tests)
1. ✅ Debe crear candidato exitosamente sin teléfono ni dirección
2. ✅ Debe crear candidato exitosamente con teléfono válido
3. ✅ Debe crear candidato exitosamente con dirección válida
4. ✅ Debe crear candidato exitosamente con teléfono y dirección válidos
5. ✅ Debe lanzar error cuando el teléfono es inválido
6. ✅ Debe lanzar error cuando la dirección excede el límite

**Total de tests en Historia 2:** 21 tests

---

## Historia 3: Registrar un candidato con información de educación

**Archivo:** `backend/src/__tests__/unit/historia-usuario-3.test.ts`

### Descripción
Tests para validar la creación de candidatos con información de educación. Valida institución, título, fechas y relaciones con el candidato.

### Tests Implementados

#### Validación de educación (9 tests)
1. ✅ Debe aceptar educación válida con institución, título y fecha de inicio
2. ✅ Debe aceptar educación válida con fecha de fin opcional
3. ✅ Debe rechazar educación sin institución
4. ✅ Debe rechazar educación con institución mayor a 100 caracteres
5. ✅ Debe rechazar educación sin título
6. ✅ Debe rechazar educación con título mayor a 100 caracteres
7. ✅ Debe rechazar educación sin fecha de inicio
8. ✅ Debe rechazar educación con fecha de inicio en formato inválido
9. ✅ Debe rechazar educación con fecha de fin en formato inválido (si se proporciona)

#### Servicio addCandidate con educaciones (5 tests)
1. ✅ Debe crear candidato exitosamente sin educaciones
2. ✅ Debe crear candidato exitosamente con una educación válida
3. ✅ Debe crear candidato exitosamente con múltiples educaciones válidas
4. ✅ Debe crear las educaciones asociadas al candidato con el candidateId correcto
5. ✅ Debe lanzar error cuando alguna educación es inválida

#### Modelo Education (3 tests)
1. ✅ Debe crear instancia correctamente con datos válidos
2. ✅ Debe convertir fechas string a Date correctamente
3. ✅ Debe guardar educación exitosamente en la base de datos

**Total de tests en Historia 3:** 17 tests

---

## Historia 4: Registrar un candidato con experiencia laboral

**Archivo:** `backend/src/__tests__/unit/historia-usuario-4.test.ts`

### Descripción
Tests para validar la creación de candidatos con información de experiencia laboral. Valida empresa, puesto, descripción, fechas y relaciones con el candidato.

### Tests Implementados

#### Validación de experiencia laboral (11 tests)
1. ✅ Debe aceptar experiencia válida con empresa, puesto y fecha de inicio
2. ✅ Debe aceptar experiencia válida con descripción opcional
3. ✅ Debe aceptar experiencia válida con fecha de fin opcional
4. ✅ Debe rechazar experiencia sin empresa
5. ✅ Debe rechazar experiencia con empresa mayor a 100 caracteres
6. ✅ Debe rechazar experiencia sin puesto
7. ✅ Debe rechazar experiencia con puesto mayor a 100 caracteres
8. ✅ Debe rechazar experiencia con descripción mayor a 200 caracteres
9. ✅ Debe rechazar experiencia sin fecha de inicio
10. ✅ Debe rechazar experiencia con fecha de inicio en formato inválido
11. ✅ Debe rechazar experiencia con fecha de fin en formato inválido (si se proporciona)

#### Servicio addCandidate con experiencias (5 tests)
1. ✅ Debe crear candidato exitosamente sin experiencias
2. ✅ Debe crear candidato exitosamente con una experiencia válida
3. ✅ Debe crear candidato exitosamente con múltiples experiencias válidas
4. ✅ Debe crear las experiencias asociadas al candidato con el candidateId correcto
5. ✅ Debe lanzar error cuando alguna experiencia es inválida

#### Modelo WorkExperience (3 tests)
1. ✅ Debe crear instancia correctamente con datos válidos
2. ✅ Debe convertir fechas string a Date correctamente
3. ✅ Debe guardar experiencia exitosamente en la base de datos

**Total de tests en Historia 4:** 19 tests

---

## Historia 5: Registrar un candidato con currículum (CV)

**Archivo:** `backend/src/__tests__/unit/historia-usuario-5.test.ts`

### Descripción
Tests para validar la creación de candidatos con información de currículum. Valida filePath, fileType y asignación automática de uploadDate.

### Tests Implementados

#### Validación de CV (7 tests)
1. ✅ Debe aceptar CV válido con filePath y fileType como strings
2. ✅ Debe rechazar CV sin filePath
3. ✅ Debe rechazar CV sin fileType
4. ✅ Debe rechazar CV donde filePath no sea string
5. ✅ Debe rechazar CV donde fileType no sea string
6. ✅ Debe rechazar CV si no es un objeto
7. ✅ Debe rechazar CV si el objeto está vacío

#### Servicio addCandidate con CV (5 tests)
1. ✅ Debe crear candidato exitosamente sin CV
2. ✅ Debe crear candidato exitosamente con CV válido
3. ✅ Debe crear el CV asociado al candidato con el candidateId correcto
4. ✅ Debe asignar automáticamente uploadDate al CV
5. ✅ Debe lanzar error cuando el CV es inválido

#### Modelo Resume (4 tests)
1. ✅ Debe crear instancia correctamente con filePath y fileType
2. ✅ Debe asignar automáticamente uploadDate al crear
3. ✅ Debe guardar resume exitosamente en la base de datos
4. ✅ Debe lanzar error si se intenta actualizar un resume existente (solo permite crear)

**Total de tests en Historia 5:** 16 tests

---

## Historia 6: Manejo de errores de base de datos al registrar candidato

**Archivo:** `backend/src/__tests__/unit/historia-usuario-6.test.ts`

### Descripción
Tests para validar el manejo adecuado de errores de base de datos, incluyendo errores de conexión, email duplicado y otros errores de Prisma.

### Tests Implementados

#### Manejo de errores en Candidate.save() (3 tests)
1. ✅ Debe lanzar error específico cuando no hay conexión a BD (PrismaClientInitializationError)
2. ✅ Debe lanzar error específico cuando el registro no existe en actualización (P2025)
3. ✅ Debe propagar otros errores de Prisma correctamente

#### Manejo de errores en addCandidate (3 tests)
1. ✅ Debe lanzar error específico cuando el email está duplicado (P2002)
2. ✅ Debe propagar errores de validación
3. ✅ Debe propagar errores de base de datos

#### Manejo de errores en controlador (5 tests)
1. ✅ Debe retornar código 400 con mensaje cuando hay error de validación
2. ✅ Debe retornar código 400 con mensaje cuando el email está duplicado
3. ✅ Debe retornar código 400 con mensaje genérico cuando hay error desconocido
4. ✅ Debe manejar errores que no son instancias de Error
5. ✅ Debe retornar código 201 cuando el candidato se crea exitosamente

#### Manejo de errores en ruta (3 tests)
1. ✅ Debe retornar código 400 cuando hay error de negocio
2. ✅ Debe retornar código 500 cuando hay error inesperado del servidor
3. ✅ Debe retornar mensaje de error apropiado en la respuesta

**Total de tests en Historia 6:** 14 tests

---

## Resumen Total

| Historia | Archivo | Tests | Estado | Tiempo Ejecución |
|----------|---------|-------|--------|------------------|
| Historia 1 | `historia-usuario-1.test.ts` | 25 | ✅ Validado | ~6.8s |
| Historia 2 | `historia-usuario-2.test.ts` | 21 | ✅ Validado | ~7.1s |
| Historia 3 | `historia-usuario-3.test.ts` | 17 | ✅ Validado | ~6.9s |
| Historia 4 | `historia-usuario-4.test.ts` | 19 | ✅ Validado | ~6.7s |
| Historia 5 | `historia-usuario-5.test.ts` | 16 | ✅ Validado | ~6.6s |
| Historia 6 | `historia-usuario-6.test.ts` | 14 | ✅ Validado | ~11.2s |
| **TOTAL** | **6 archivos** | **112 tests** | **✅ Todos validados** | **~45.3s** |

---

## Estrategia de Testing

### Mocks y Aislamiento
- **PrismaClient:** Completamente mockeado para aislar tests de la base de datos real
- **Timers:** Uso de `jest.useFakeTimers()` para controlar fechas en tests de Resume
- **Aislamiento:** Cada test es independiente y no depende de otros tests

### Cobertura
Los tests cubren:
- ✅ Validaciones de datos de entrada
- ✅ Lógica de negocio en servicios
- ✅ Persistencia en modelos de dominio
- ✅ Manejo de errores en todas las capas
- ✅ Casos positivos y negativos (edge cases)
- ✅ Relaciones entre entidades (candidato-educación, candidato-experiencia, candidato-CV)

### Ejecución
Para ejecutar todos los tests:
```bash
npm test
```

Para ejecutar un archivo específico:
```bash
npm test historia-usuario-1.test.ts
```

Para ejecutar en modo watch:
```bash
npm run test:watch
```

Para generar reporte de cobertura:
```bash
npm run test:coverage
```

---

## Notas Técnicas

### Estructura de Tests
Cada archivo de test sigue la estructura:
1. **Imports:** Módulos necesarios y mocks
2. **Mock de PrismaClient:** Configuración del mock
3. **Describe blocks:** Organización por funcionalidad
4. **Tests individuales:** Casos específicos con expectativas claras

### Patrones Utilizados
- **Arrange-Act-Assert (AAA):** Estructura clara en cada test
- **Factory functions:** Uso de helpers para crear datos de prueba
- **Mock verification:** Verificación de llamadas a métodos mockeados
- **Error testing:** Tests específicos para diferentes tipos de errores

### Validaciones Cubiertas
- Formato de datos (regex, tipos)
- Longitud de campos (mínimo, máximo)
- Campos obligatorios vs opcionales
- Relaciones entre entidades
- Manejo de errores de base de datos
- Códigos HTTP apropiados

---

## Estado de Validación

**Última validación:** Noviembre 2024  
**Estado:** ✅ Todos los tests implementados y validados  
**Resultados de ejecución:** 
- ✅ **112/112 tests pasando** (100% éxito)
- ✅ **0 fallos** en todas las historias de usuario
- ✅ **Tiempo total de ejecución:** ~45 segundos
- ✅ **Cobertura:** 100% de las historias de usuario del módulo de inserción  
**Framework:** Jest + TypeScript + Prisma Mocks

### Resultados por Historia de Usuario

- **Historia 1:** 25/25 tests pasando ✅ (~6.8s)
- **Historia 2:** 21/21 tests pasando ✅ (~7.1s)
- **Historia 3:** 17/17 tests pasando ✅ (~6.9s)
- **Historia 4:** 19/19 tests pasando ✅ (~6.7s)
- **Historia 5:** 16/16 tests pasando ✅ (~6.6s)
- **Historia 6:** 14/14 tests pasando ✅ (~11.2s)

### Notas de Ejecución

- Todos los tests se ejecutaron individualmente y pasaron correctamente
- Los mocks de PrismaClient funcionan correctamente en todos los casos
- No se detectaron errores de linter ni problemas de configuración
- Los tests de timers (fake timers) funcionan correctamente en Historia 5

---

## Próximos Pasos

Si se agregan nuevas funcionalidades o historias de usuario:
1. Crear nuevo archivo de test siguiendo el patrón establecido
2. Documentar los tests en este archivo
3. Ejecutar suite completa para verificar que no se rompen tests existentes
4. Actualizar este documento con los nuevos tests

