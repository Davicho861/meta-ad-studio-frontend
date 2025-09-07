# Guía de Arranque para Desarrollo Local

Este documento describe cómo arrancar Meta Ad Studio en modo desarrollo en una máquina Debian usando el script de conveniencia `start-local.sh`.

Prerrequisitos
- Docker
- Docker Compose
- Node.js y npm (o pnpm)

Pasos rápidos
1. Hacer ejecutable el script:

   chmod +x start-local.sh

2. Ejecutarlo desde la raíz del proyecto:

   ./start-local.sh

Qué hace el script
- Comprueba que `docker` y `docker-compose` estén instalados.
- Si faltan archivos `.env`, copia `./src/frontend/.env.example` o `./src/backend/server/.env.example` (si existen) a `.env` para que puedas añadir tus claves.
- Levanta los servicios definidos en `docker-compose.yml` (si existe) con `docker-compose up -d`.
- Ejecuta `npm install` o `pnpm install` en las carpetas `frontend` y `src/backend/server` si tienen `package.json`.
- Intentará ejecutar `npx prisma migrate dev` en el backend si detecta Prisma.
- Inicia el backend y el frontend en modo desarrollo (si encuentran scripts `dev` o `start`).
- Si detecta Tauri o Electron en `package.json` intentará correr el comando de desarrollo correspondiente.

Variables importantes
- Si usas la funcionalidad de IA, añade tu clave en la variable VITE_GEMINI_API_KEY dentro de `frontend/.env` o en el `.env` del lugar indicado por el script.

Suposiciones y notas
- El script busca el backend en `src/backend/server` y en `backend` como fallback, y el frontend en `frontend`.
- Si tu estructura difiere, ajusta `start-local.sh` o exporta variables de entorno antes de ejecutarlo.
- No altera archivos existentes `.env` si ya están presentes.

Resultado esperado
- Al finalizar, los contenedores (si existen) estarán corriendo en segundo plano, las dependencias deberían estar instaladas y la app de escritorio (Tauri/Electron) o el frontend se lanzarán en modo desarrollo.

Problemas comunes
- Si el script no detecta `npm`/`pnpm`, instala Node.js.
- Si Docker no sube la base de datos, revisa `docker-compose.yml` y los logs con `docker-compose logs -f`.

Si quieres, puedo adaptar el script para usar `pnpm` por defecto o para exponer puertos concretos. También puedo añadir un modo "clean" que destruya contenedores previos antes de levantar todo.
