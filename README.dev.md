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

   Esto construirá las imágenes (no cache), levantará los contenedores y esperará a que el servidor de Vite esté disponible en el puerto `5173`. Al final mostrará los logs del servicio `frontend`.

Husky Git Hooks

Hemos añadido hooks de Husky para garantizar calidad local:

- `/.husky/pre-commit`: ejecuta `npm run lint -- --fix` y stagea los cambios auto corregidos.
- `/.husky/pre-push`: ejecuta `npm test` y aborta el push si las pruebas fallan.

Protección de rama y CI (nota)

- El workflow de CI está en `src/frontend/.github/workflows/ci.yml`. Recomiendo marcar este workflow como "status check required" para la rama `main` en GitHub (Settings → Branches → Branch protection rules) — esto requiere permisos de administrador en el repo y no puede automatizarse desde el código.

Notas

Si quieres que cree un script helper `scripts/wait-for-port.sh` para la espera de puertos, dímelo y lo añado.

Contacto
