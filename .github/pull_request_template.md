## Resumen

Describe brevemente los cambios introducidos en esta PR. Ej: mejoras en la UI del generador, selección de resultados y atajos U/V/R.

## Cambios principales
- Selección de card en `GenerationGrid` y `ResultCardV2`.
- Barra rápida en `MainContent` con acciones U/V/Re-roll.
- Atajos de teclado U/V/R implementados.
- Limpieza de hooks Husky y ajustes de ESLint.

## Cómo probar
1. Ejecutar `npm install` (si es necesario).
2. `npm run dev` y abrir la app.
3. Generar una imagen y verificar que al hacer click en una card queda seleccionada.
4. Probar botones U/V/Re-roll y atajos de teclado (U/V/R) cuando haya una selección.

## Checklist
- [ ] Build pasa localmente (`npm run build`).
- [ ] Tests pasan (`npm test`).
- [ ] Cambios comentados y descriptivos en commits.

## Notas
Si hay endpoints concretos para Upscale/Variation/Re-roll puedo integrarlos en esta rama en una iteración posterior.
