Pruebas E2E - Meta-Ad-Studio

Propósito

Este directorio contiene una prueba E2E ligera que simula el flujo asíncrono de jobs + SSE usando un servidor mock.

Archivos clave

- mock-server.js - servidor HTTP que expone /api/test/animate-image y /api/jobs/:id/stream (SSE).
- run-e2e.cjs - script que lanza un job y escucha los eventos SSE hasta la finalización.
- package.json - scripts y dependencias para ejecutar la prueba localmente.

Cómo ejecutar

1. Instalar dependencias (desde este directorio):

   npm install

2. En una terminal, arrancar el servidor mock:

   npm run mock

   Esto ejecutará el servidor en http://localhost:3101 por defecto.

3. En otra terminal, ejecutar la prueba E2E:

   npm test

Opciones y argumentos

- Variables de entorno:

  - `BASE_URL` — apuntar a otro backend (por ejemplo `http://localhost:3000`).
  - `AUTH_TOKEN` o `TEST_AUTH_TOKEN` — token Bearer para endpoints protegidos.
  - `E2E_TIMEOUT` — timeout en ms para la prueba (por defecto 60000).

- CLI args (forma alternativa):

  - `--base-url=<url>` — equivalente a `BASE_URL`.
  - `--auth-token=<token>` — equivalente a `AUTH_TOKEN`.

Ejemplos:

```
BASE_URL=http://localhost:3000 AUTH_TOKEN=secrettoken npm test
# o usando args
node run-e2e.cjs --base-url=http://localhost:3000 --auth-token=secrettoken
```

CI

Se incluye un workflow de GitHub Actions en `.github/workflows/e2e.yml` que:

- instala dependencias en `tests/e2e`;
- arranca el `mock` en background;
- ejecuta `npm test`.

E2E Scenarios CI job

Se añadió un job `e2e-scenarios` en `.github/workflows/e2e.yml` que ejecuta la suite de escenarios (`npm run test:scenarios`).

Artifacts generados (subidos por el workflow):

- `tests/e2e/scenarios-report.json` — informe consolidado con resultados por escenario.
- `tests/e2e/test.json` — último `test.json` generado por la ejecución (contiene events y timestamps).
- `tests/e2e/mock.log` — logs del mock en CI.
- `tests/e2e/runner.log` — salida del runner `run-all-scenarios.cjs`.


Staging (manual)

Puedes ejecutar las pruebas contra un entorno de staging manualmente desde Actions:

1. Añade los siguientes `Secrets` en el repositorio (Settings → Secrets → Actions):

   - `STAGING_URL` — la URL base del backend de staging (ej. `https://staging.example.com`)
   - `STAGING_AUTH` — token Bearer para autenticar la petición (si aplica)

2. Ve a la pestaña Actions → selecciona "E2E (mock)" → "Run workflow" y elige la rama.

El workflow correrá el job `e2e-staging` usando los secrets para invocar `run-e2e.cjs` contra staging.

Notas

- El mock-server está pensado para runs locales y CI; no requiere Redis/Postgres.
- El script `run-e2e.cjs` detecta `NODE_ENV=test` y usa el endpoint de prueba `/api/test/animate-image` cuando está disponible.
