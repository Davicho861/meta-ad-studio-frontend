#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check for docker/compose
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker no está instalado."
  exit 1
fi

if command -v docker-compose >/dev/null 2>&1; then
  DC_CMD="docker-compose"
else
  DC_CMD="docker compose"
fi

echo "Deteniendo y eliminando contenedores, redes y volúmenes asociados..."
# -v elimina volúmenes asociados. Útil para limpiar datos en dev; en prod usar con cuidado.
${DC_CMD} down -v --remove-orphans

echo "Contenedores detenidos. Los volúmenes se han eliminado (-v). Si quieres conservar datos, ejecuta sin -v."
