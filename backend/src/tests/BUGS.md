## BUG-VAL-001 – Validator omits required fields

- **Summary:** `validateCandidateData` no exige `phone`, `address`, `educations` ni `cv`, pese a ser campos requeridos por negocio.
- **Context:** La historia “Agregar nuevo candidato (LTI)” exige información de contacto y antecedentes completos. El validador actual solo valida nombres y email; los otros campos se ignoran si faltan.
- **Evidencia:** Tests `application/validator.validateCandidateData`:
  - `documents missing phone as bugx BUG-VAL-001`
  - `documents missing address as bug BUG-VAL-001`
  - `documents missing education array as bug BUG-VAL-001`
  - `documents missing cv as bug BUG-VAL-001`
- **Riesgo:** Se pueden persistir candidatos incompletos, afectando el flujo de reclutamiento.
- **Sugerencia:** Actualizar `validateCandidateData` para hacer obligatorios esos campos o documentar que son opcionales.

## BUG-VAL-002 – Validator rechaza teléfonos internacionales

- **Summary:** El patrón de teléfono solo admite números españoles (9 dígitos comenzando por 6/7/9), por lo que números con prefijo internacional son inválidos.
- **Context:** El frontend y el caso de negocio permiten reclutadores globales y cargan números como `+54 11 1234 5678`.
- **Evidencia:** Test `application/validator.validateCandidateData › documents international phone rejection as bug BUG-VAL-002` lanza `Invalid phone`.
- **Riesgo:** Usuarios fuera de España no pueden registrar candidatos; bloqueo funcional.
- **Sugerencia:** Ampliar el regex de `PHONE_REGEX` o normalizar el número antes de validar (permitir `+`, espacios y distintos largos).

