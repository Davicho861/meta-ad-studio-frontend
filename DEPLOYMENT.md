# Despliegue de Frontend — Preparación para Producción

Resumen rápido
- Este repo contiene un frontend React empacado en un contenedor Nginx listo para producción.
- El build es multi-etapa: Node para compilar, Nginx para servir los archivos estáticos.
- Variables de entorno de tiempo de ejecución se inyectan mediante `entrypoint.sh`.

Archivos claves
- `frontend/Dockerfile` — Docker multi-stage (build -> nginx:alpine).
- `frontend/nginx.conf` — Configuración Nginx con fallback SPA y headers de seguridad.
- `frontend/entrypoint.sh` — Inyecta `VITE_API_URL` u otras variables en los `.js` compilados al iniciar el contenedor.
- `.github/workflows/deploy.yml` — Workflow que construye y publica la imagen en GHCR al hacer push en `main`.
- `frontend/docker-compose.prod.yml` — Ejemplo de despliegue local con `env_file: .env.prod`.

Cómo funciona el build
1. El workflow de GitHub Actions (push en `main`) ejecuta `docker/build-push-action`.
2. Se construye la imagen usando `frontend/Dockerfile` y se publica en GHCR con etiquetas `latest` y `${{sha}}`.

Configuración en tiempo de ejecución
- No incluyas URLs de API en el bundle en build-time.
- Crea un archivo `.env.prod` con al menos:

  VITE_API_URL=https://api.example.com

- En `docker-compose.prod.yml` el servicio `frontend` usa `env_file: .env.prod` y el entrypoint inyecta las variables en los archivos estáticos.

Cómo inyectar nuevas variables
- Añade patrones `__RUNTIME_<NAME>__` en el código fuente (p.ej. en index.html o en el código JS) en donde quieras que aparezca el valor en runtime.
- Añade el nombre a la función `inject_var` del `entrypoint.sh` para que se reemplace con la variable de entorno correspondiente.

Despliegue y pruebas locales
1. Construir y levantar con docker-compose (en la raíz del repo):

   # copiar ejemplo a .env.prod y ajustar valores
   docker compose -f frontend/docker-compose.prod.yml up --build

2. Abrir http://localhost:8080 y verificar que la UI carga y que las llamadas API apuntan a `VITE_API_URL`.

Notas de seguridad y operacionales
- Asegúrate de configurar secretos del registro en GitHub si usas un registry privado.
- Habilita escaneo de imágenes y fijado de versiones para dependencias críticas.

Próximos pasos sugeridos
- Añadir un job de integración que ejecute tests E2E contra la imagen generada.
- Añadir rotación de logs y métricas (Prometheus + Grafana) en el entorno de orquestación.
