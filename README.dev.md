# Desarrollo local — Meta Ad Studio

Este documento explica cómo levantar el entorno de desarrollo localmente usando Docker Compose y los atajos disponibles en el `Makefile` del repo.

Requisitos

- Docker and Docker Compose
- Node 20 (recommended)

Comandos útiles

```bash
make dev
```


```bash
make build
```


```bash
make down
```


```bash
make logs
```


```bash
make seed
```


```bash
make seed-reset
```

Notas y troubleshooting

- Si quieres que cree scripts de helper (por ejemplo `scripts/start-dev.sh`) dímelo y lo añado.

Automatización opcional

Contacto

Nota: para activar el workflow de verificación E2E en producción (si procede), se añadió `.github/workflows/e2e-smoke.yml` que ejecuta un test Cypress contra la URL en el secreto `PRODUCTION_URL` y sube la captura `verificacion-ui-produccion.png` como artifact.
# Red de Seguridad Automatizada (Quality Gate en CI)

Desde septiembre 2025, el pipeline de CI incluye una red de seguridad que blinda la calidad del frontend:

- **Auditoría de Accesibilidad:** Cada Pull Request ejecuta un escaneo automático con axe-core. El pipeline falla si se detectan violaciones de accesibilidad de impacto "critical" o "serious".
- **Pruebas E2E:** Se ejecuta la suite completa de escenarios E2E contra el mock server. Si alguna prueba falla, el pipeline se detiene y sube el reporte como artefacto.
- **Verificación de Build de Producción:** Se simula un build de producción (`npm run build`) para detectar errores de TypeScript o empaquetado antes de desplegar.

**Cómo funciona:**

El workflow `quality-gate.yml` en `.github/workflows/` automatiza estas comprobaciones. No es posible mergear código que introduzca regresiones graves de accesibilidad, fallos E2E o errores de build.

**Revisión de resultados:**
- Los reportes de accesibilidad y E2E se suben como artefactos en cada ejecución de CI.

**¿Cómo contribuir?**
- Antes de abrir un Pull Request, asegúrate de que tu rama pase todas las comprobaciones locales (`npm run lint`, `npm test`, `npm run build`).

Para más detalles, revisa el workflow y los artefactos generados en GitHub Actions.

CI Status (Quality Gate)
------------------------

![Quality Gate](https://github.com/Davicho861/meta-ad-studio-frontend/actions/workflows/quality-gate.yml/badge.svg)

Generar y revisar reporte de accesibilidad localmente
---------------------------------------------------

Si quieres ejecutar el escaneo de `axe` localmente y generar el HTML de reporte:

1. Asegúrate de que el frontend está corriendo en `FRONTEND_PORT` (por defecto `5173`).

```bash
npm ci
docker-compose -f docker-compose.dev.yml up -d
npx wait-on http://localhost:5173 --timeout 20000
```

2. Ejecuta `axe` y genera HTML:

```bash
npx @axe-core/cli http://localhost:5173 --save ./axe-report.json --json
node scripts/axe-report-html.js ./axe-report.json ./axe-report.html
# abrir ./axe-report.html en el navegador
```

3. Revisa `axe-report.html` y corrige violaciones `critical` o `serious` antes de subir PR.

# Desarrollo local — Meta Ad Studio

Este archivo explica cómo iniciar el entorno de desarrollo localmente.

Requisitos

- Docker and Docker Compose
- Node 20 (recommended)

Pasos rápidos:

1) Copiar el ejemplo de variables de entorno y editar si es necesario:

   cp .env.example .env

2) Levantar los servicios con Make:

   make dev

   Esto construirá las imágenes (no cache), levantará los contenedores y esperará a que el servidor de Vite esté disponible en el puerto configurado por la variable de entorno `FRONTEND_PORT` (por defecto `5173`). Al final mostrará los logs del servicio `frontend`.

   Nota sobre la variable `FRONTEND_PORT`:

   - Puedes forzar el puerto al ejecutar el comando, por ejemplo:

     FRONTEND_PORT=5173 make dev

   - El `Makefile` y `docker-compose.dev.yml` están parametrizados para respetar esta variable. Evita usar puertos en conflicto con otros servicios.

Recomendaciones sobre `node_modules` y volúmenes Docker:

   - En desarrollo la imagen del `frontend` usa Node y el contenedor instalará dependencias dentro de la imagen de desarrollo.
   - No montes `/app/node_modules` desde el host en `docker-compose.dev.yml`. Montajes de `node_modules` pueden enmascarar (override) las dependencias instaladas en la imagen y provocar errores de resolución (por ejemplo, Vite no encuentra React/ReactDOM).
   - Si necesitas compartir dependencias con el host, usa un flujo de trabajo alternativo (p. ej. instalaciones en el host y un script de sincronización) y documenta explícitamente los pasos.

Troubleshooting rápido (Vite / React):

   - Si ves errores tipo "Invalid Hook Call" o "Cannot read file /node_modules/react...", revisa que no exista un volumen que monte `/app/node_modules` en `docker-compose.dev.yml`.
   - Comprueba el puerto con `ss -ltnp | grep 5173` (o el valor de `FRONTEND_PORT`).
   - El `make dev` espera activamente a que el puerto esté abierto y luego tail-a los logs; para detener manualmente presiona Ctrl-C.


Husky Git Hooks

Hemos añadido hooks de Husky para garantizar calidad local:

- `/.husky/pre-commit`: ejecuta `npm run lint -- --fix` y stagea los cambios auto corregidos.
- `/.husky/pre-push`: ejecuta `npm test` y aborta el push si las pruebas fallan.

Protección de rama y CI (nota)

- El workflow de CI está en `src/frontend/.github/workflows/ci.yml`. Recomiendo marcar este workflow como "status check required" para la rama `main` en GitHub (Settings → Branches → Branch protection rules) — esto requiere permisos de administrador en el repo y no puede automatizarse desde el código.

Notas

Si quieres que cree un script helper `scripts/wait-for-port.sh` para la espera de puertos, dímelo y lo añado.

Contacto
