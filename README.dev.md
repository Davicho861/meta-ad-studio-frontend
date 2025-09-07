# Desarrollo local — Meta Ad Studio

Este documento explica cómo levantar el entorno de desarrollo localmente usando Docker Compose y los atajos disponibles en el `Makefile` del repo.

Requisitos

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

Automatización opcional

Contacto
Nota: para activar el workflow de verificación E2E en producción (si procede), se añadió `.github/workflows/e2e-smoke.yml` que ejecuta un test Cypress contra la URL en el secreto `PRODUCTION_URL` y sube la captura `verificacion-ui-produccion.png` como artifact.
# Desarrollo local — Meta Ad Studio

Este archivo explica cómo iniciar el entorno local de desarrollo rápidamente.

Requisitos:

Pasos rápidos:

1) Copiar el ejemplo de variables de entorno y editar si es necesario:

   cp .env.example .env
   # Edita .env y rellena POSTGRES_PASSWORD si quieres una contraseña distinta

2) Levantar los servicios con Docker Compose:

   docker-compose up --build -d

3) Verificar que los contenedores están corriendo:

   docker ps

   Debes ver al menos: postgres, redis, api-server y meta-verse-visualizer-main

4) Abrir la UI en el navegador:

   http://localhost:8082

5) Conectarse a la base de datos (opcional):

   Host: localhost
   Puerto: 5433 (mapeado al host desde docker-compose)
   Usuario: el que haya en .env (POSTGRES_USER)
   Contraseña: la que hayas puesto en .env (POSTGRES_PASSWORD)
   Base de datos: POSTGRES_DB

Notas de seguridad:

Si quieres que cree scripts de helper (por ejemplo `scripts/start-dev.sh`) dímelo y lo añado.
