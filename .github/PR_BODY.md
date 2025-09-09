## Qué hace este PR
- Añade un `quality-gate` en GitHub Actions que: ejecuta un escaneo de accesibilidad con `axe-core`, ejecuta la suite E2E (mock runner + Cypress headless con `cypress-axe`) y verifica el build de producción (`npm run build`).

## Por qué
- Evitar que regresiones de accesibilidad, fallos E2E o errores de build lleguen a `main`.

## Cómo probar localmente
1. Levanta frontend: `docker-compose -f docker-compose.dev.yml up -d` y espera `FRONTEND_PORT` (por defecto `5173`).
2. Ejecuta `npx @axe-core/cli http://localhost:5173 --save ./axe-report.json --json` y genera `axe-report.html` con `node scripts/axe-report-html.js ./axe-report.json ./axe-report.html`.
3. En `tests/e2e`: `npm ci`, `npm run mock:background`, `npm run test:scenarios`, `npx cypress run`.

## Artefacts generados por CI a revisar
- `axe-accessibility-report` (JSON)
- `axe-accessibility-html` (HTML) — ver en browser
- `cypress-artifacts` (videos/screenshots)
- `e2e-scenarios-artifacts` (`scenarios-report.json`, `runner.log`)

## Checklist (automático)
- [ ] Pasa linters y tests locales
- [ ] Revisar artifacts de CI para accesibilidad y E2E

## Notas adicionales
- Si tu frontend no corre en 5173, actualiza `FRONTEND_PORT` en el workflow o exporta la variable antes de levantar el entorno.
