#!/bin/bash

# Despliega la aplicación local usando docker-compose
set -euo pipefail

PROJECT_DIR="$HOME/Davicho861/Meta-Ad-Studio-"

cd "$PROJECT_DIR" || { echo "Error: no se pudo acceder a $PROJECT_DIR"; exit 1; }

echo "Comprobando dependencias..."

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker no está instalado. Instálalo con: sudo apt install docker.io" >&2
  exit 2
fi

if ! command -v docker-compose >/dev/null 2>&1; then
  echo "Error: docker-compose no está instalado. Instálalo con: sudo apt install docker-compose" >&2
  exit 2
fi

if ! systemctl is-active --quiet docker; then
  echo "Error: el servicio Docker no está en ejecución. Inicia Docker: sudo systemctl start docker" >&2
  exit 3
fi

echo "Ejecutando: docker-compose up -d --build --remove-orphans"
echo "  -d: modo detached (ejecuta en fondo)"
echo "  --build: fuerza reconstrucción de imágenes"
echo "  --remove-orphans: elimina contenedores huérfanos definidos fuera del compose file"

docker-compose up -d --build --remove-orphans

echo
echo "Servicios levantados. Estado actual:"
docker-compose ps

echo
echo "Para ver logs en tiempo real: docker-compose logs -f"
echo "Para detener los servicios: docker-compose down"

exit 0
