#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check docker
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker no está instalado. Instala Docker y vuelve a intentarlo."
  exit 1
fi

# Check docker daemon
if ! docker info >/dev/null 2>&1; then
  echo "Error: El servicio Docker no está en ejecución o no tienes permisos para acceder a él."
  echo "Intenta: sudo systemctl start docker"
  exit 1
fi

# Check docker-compose (v2) or docker compose
if command -v docker-compose >/dev/null 2>&1; then
  DC_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
  DC_CMD="docker compose"
else
  echo "Error: docker-compose no está disponible (ni 'docker-compose' ni 'docker compose')."
  exit 1
fi

# Ensure .env exists
if [ ! -f "${ROOT_DIR}/.env" ]; then
  if [ -f "${ROOT_DIR}/.env.example" ]; then
    cp "${ROOT_DIR}/.env.example" "${ROOT_DIR}/.env"
    echo "Se ha copiado .env.example -> .env. Revisa ${ROOT_DIR}/.env y ajusta las variables antes de continuar si es necesario."
  else
    echo "Aviso: No se encontró .env ni .env.example en ${ROOT_DIR}. Continúo, pero asegúrate de configurar las variables de entorno."
  fi
fi

echo "Construyendo y levantando contenedores (en background)..."
# Build and start
${DC_CMD} up --build -d --remove-orphans

echo
echo "Estado de los contenedores:"
${DC_CMD} ps

echo
echo "Despliegue completado."
echo "Accede a la aplicación en: http://localhost (o el puerto configurado en tu docker-compose.yml)"
