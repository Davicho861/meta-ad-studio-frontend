Local Deployment Runbook

Este runbook contiene los pasos exactos para limpiar tu entorno Docker y levantar Meta-Ad-Studio localmente.

Paso 0 — ubicación
Abre una terminal en la raíz del repositorio `Meta-Ad-Studio-`.

Paso 1 — Limpieza profunda de Docker
```bash
echo "--- Deteniendo y limpiando el stack de docker-compose... ---"
docker-compose down -v

echo "--- Deteniendo todos los contenedores restantes... ---"
docker stop $(docker ps -a -q) || true

echo "--- Eliminando todos los contenedores... ---"
docker rm $(docker ps -a -q) || true

echo "--- Realizando limpieza profunda del sistema Docker (imágenes, volúmenes, caché)... ---"
docker system prune -a -f --volumes

echo "--- ¡Entorno Docker completamente limpio! ---"
```

Paso 2 — Levantar Meta-Ad-Studio
```bash
docker-compose up --build -d
```

Paso 3 — Verificación
- Ejecuta `docker ps` y valida que los contenedores `frontend`, `backend`, `postgres` y `redis` estén en estado "Up".
- Abre el navegador en `http://localhost:8082` (o el puerto indicado en `docker-compose.yml`) para ver la UI.

Notas
- Si tu `.env` contiene credenciales, asegúrate de que estén presentes en la raíz antes de levantar los servicios.
- El primer build puede tardar varios minutos. Usa `docker logs -f <container>` para depurar.
