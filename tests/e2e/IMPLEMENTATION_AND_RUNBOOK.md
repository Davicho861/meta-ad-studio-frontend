IMPLEMENTATION & RUNBOOK — E2E suite (tests/e2e)

Resumen corto

Este directorio contiene una pequeña suite E2E diseñada para validar el flujo asíncrono de jobs + SSE usado por Meta-Ad-Studio.

Se agregó:

- Un servidor mock (`mock-server.js`) que emula el endpoint de creación de jobs (`POST /api/test/animate-image`) y transmite eventos SSE en `/api/jobs/:id/stream`.
- Un script E2E ligero (`run-e2e.cjs`) que crea un job y escucha eventos SSE hasta la finalización.
- Variantes de escenario en el mock (`progress`, `fail`, `slow`) controladas por `?scenario=` o por `--scenario` en el runner.
- Un runner de escenarios (`run-all-scenarios.cjs`) que ejecuta los escenarios `progress`, `fail` y `slow` de forma secuencial.
- Escritura de artefactos estructurados: `test.json` (por ejecución) y `scenarios-report.json` (consolidado).
- Scripts npm útiles: `mock`, `mock:stop`, `mock:background`, `test`, `test:scenarios`, `validate:testjson`.
- Validación de artefactos con AJV (`validate-testjson.cjs`).
- Workflows GitHub Actions: `.github/workflows/e2e.yml` con jobs `e2e-mock`, `e2e-scenarios` (y `e2e-staging` manual).
- Helpers: `stop-mock.sh` para detener y limpiar procesos del mock.

Motivación y alcance

Objetivo: proporcionar una forma reproducible y automática de validar el flujo asíncrono (creación de job -> notificaciones SSE -> finalización/errores) sin dependencia de infra externa (Redis/Postgres). El mock permite que CI ejecute pruebas deterministas y que los desarrolladores verifiquen integraciones locales.

Contenido del directorio

- `mock-server.js` — servidor Node.js que simula jobs + SSE. Soporta `?scenario=progress|fail|slow`.
- `run-e2e.cjs` — script E2E minimal; acepta args: `--base-url`, `--auth-token`, `--scenario`; produce `test.json`.
- `run-all-scenarios.cjs` — runner que ejecuta `run-e2e.cjs` para cada escenario (usa `NODE_ENV=test`). Produce `scenarios-report.json`.
- `validate-testjson.cjs` — validación JSON con AJV.
- `package.json` — scripts y dependencias para el subproyecto E2E.
- `mock.log`, `mock.pid`, `runner.log`, `run-progress.log`, `test.json`, `scenarios-report.json` — artefactos generados por ejecución.
- `stop-mock.sh` — script para parar mock y limpiar artefactos.
- `.github/workflows/e2e.yml` — workflow CI que arranca el mock y ejecuta tests.

Contract / expectativas (inputs/outputs)

- Inputs:
  - BASE_URL (env o `--base-url`) — URL base del backend a probar.
  - AUTH_TOKEN (env o `--auth-token`) — token Bearer para endpoints protegidos.
  - SCENARIO (env `E2E_SCENARIO` o `--scenario`) — uno de `progress|fail|slow`.
- Outputs:
  - `test.json` — por ejecución: scenario, start, end, durationMs, exitCode, events[]
  - `scenarios-report.json` — consolidado de múltiples ejecuciones.
- Error modes:
  - timeout al esperar SSE (exitCode 4)
  - fallo de job (exitCode 5)
  - conexión/errores de EventSource (exitCode 6)
  - error de script (exitCode 10)

Cómo ejecutar localmente (rápido)

1. Instalar dependencias (desde `tests/e2e`):

```bash
cd tests/e2e
npm ci
```

2. Arrancar el mock (background):

```bash
npm run mock:background
# o manualmente
# export PORT=3101 && nohup node mock-server.js > mock.log 2>&1 & echo $! > mock.pid
```

3. Ejecutar una prueba individual:

```bash
NODE_ENV=test node run-e2e.cjs --base-url=http://localhost:3101 --scenario=progress
# output -> writes test.json
```

4. Ejecutar todos los escenarios (runner):

```bash
npm run test:scenarios
# output -> scenarios-report.json + writes test.json per run
```

5. Validar artefactos:

```bash
npm run validate:testjson
# returns non-zero y muestra errores si el JSON no cumple el schema
```

6. Parar el mock:

```bash
bash stop-mock.sh
```

Detalles del mock

- Endpoints:
  - POST `/api/test/animate-image[?scenario=...]` — crea jobId y responde 202 con { jobId, status: 'queued' }.
  - GET `/api/jobs/:id/stream` — SSE con eventos `status` que contienen objetos JSON.
- Scenarios:
  - `progress` (default): queued -> processing step1 -> processing step2 -> completed
  - `fail`: queued -> processing -> failed (error)
  - `slow`: similar a progress con delays más largos

Artifacts y logs (en local y CI)

- `mock.log` — salida del mock (startup, request logs).
- `mock.pid` — PID del mock background.
- `runner.log` — salida del runner `run-all-scenarios.cjs`.
- `test.json` — resultado estructurado de la última ejecución individual.
- `scenarios-report.json` — resultado consolidado de la suite de escenarios.

Integración CI (GitHub Actions)

- Workflow: `.github/workflows/e2e.yml` con jobs:
  - `e2e-mock` — smoke test (arranca mock + `npm test`).
  - `e2e-scenarios` — ejecuta `npm run test:scenarios`, valida artefacts con AJV y sube artifacts.
  - `e2e-staging` — job manual (`workflow_dispatch`) que ejecuta `run-e2e.cjs` contra `secrets.STAGING_URL` y `secrets.STAGING_AUTH`.

- Artifacts subidos: `scenarios-report.json`, `test.json`, `mock.log`, `runner.log` (útil para debugging en CI).

Prácticas recomendadas y troubleshooting

- Siempre ejecutar `bash stop-mock.sh` antes de arrancar el mock para evitar `EADDRINUSE`.
- Si ves `ECONNREFUSED` en `run-e2e`, confirma que `mock-server` está escuchando:

```bash
ss -ltnp | grep 3101
ps aux | grep mock-server
cat tests/e2e/mock.log
```

- Si el workflow falla en CI por schema de JSON, descarga los artifacts y revisa `runner.log` y `mock.log` para diagnosticar.

Siguientes pasos recomendados

1. Integrar la validación como causa de fallo en CI (hoy la validación escribe `validate.log`—cambiar a fallar el job si no pasa).
2. Añadir tests unitarios que verifiquen contenido semántico de `test.json` (por ejemplo, que `events` contenga al menos un `completed` para `progress`).
3. Extender el mock para más escenarios reales: retries, flapping, latencias variables, códigos intermedios.
4. Documentar cómo ejecutar esto contra el backend real (staging) y cómo rotar/stash secrets en GitHub Actions.
5. (Opcional) Añadir un pequeño dashboard que consuma `scenarios-report.json` y muestre resultados históricos.

Troubleshooting rápido (relacionado con Vite / puerto 5173)

- Síntoma frecuente: `ERR_CONNECTION_REFUSED` en `http://localhost:5173` al ejecutar `make dev`.
- Causa raíz identificada: el frontend estaba configurado con un puerto estático diferente (ej. `8080`) en `src/frontend/meta-verse-visualizer-main/vite.config.ts`, mientras que `Makefile` y scripts esperan que Vite esté en `5173`. Además, cambios recientes en `tests/e2e` añadieron servicios de mock que pueden ocupar puertos locales si se arrancan en background.
- Solución aplicada: `vite.config.ts` del frontend fue actualizado para respetar la variable de entorno `FRONTEND_PORT` y por defecto usar `5173`. También se añadió un `.npmrc` local en el paquete del frontend para evitar fallos de instalación por peer-deps durante desarrollo.

Pasos de recuperación rápida:

1. Asegúrate de que no haya procesos en el puerto 5173: `ss -ltnp | grep :5173`.
2. Si aparece un PID relacionado con `node mock-server.js`, detén el mock: `bash tests/e2e/stop-mock.sh` o `kill <pid>`.
3. Desde la raíz del repo ejecuta: `make dev` (esto usará `FRONTEND_PORT=5173` por defecto). Si tu entorno necesita otro puerto, exporta `FRONTEND_PORT` antes.

Notas adicionales:

- Se agregó `.npmrc` con `legacy-peer-deps=true` en `src/frontend/meta-verse-visualizer-main` para mitigar errores ERESOLVE durante `npm install` en desarrollos locales. Esto no cambia la resolución de dependencias en CI donde los builds suelen usar instalaciones frescas o contenedores.
- Recomendación SRE: Considerar normalizar puertos usando variables de entorno en `docker-compose.dev.yml` y en `Makefile` para evitar divergencias.

Registro de cambios (delta principal)

- Añadido `mock-server.js`, `run-e2e.cjs`, `run-all-scenarios.cjs`, `validate-testjson.cjs`.
- Añadido scripts npm y devDeps (`wait-on`, `ajv`).
- Workflow `.github/workflows/e2e.yml` creado/extendido con jobs e2e-mock, e2e-scenarios, e2e-staging.
- Helpers `stop-mock.sh` y `mock:background` para manejo robusto del mock.

Contacto y notas finales

- Este runbook está pensado para desarrolladores y CI engineers responsables de validar flujos asíncronos sin depender de infra completa.
- Si quieres que lo convierta en un README más formal con badge de CI y ejemplos de GitHub Actions, lo hago en el siguiente paso.



Fecha: 2025-09-08
Generado automáticamente por la sesión de implementación.
