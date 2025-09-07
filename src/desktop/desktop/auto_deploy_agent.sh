#!/usr/bin/env bash
# Agente ligero para despliegue local desde el icono
# Uso: ./auto_deploy_agent.sh [--dry-run]

set -euo pipefail

ROOT_DIR="${HOME}/Davicho861/Meta-Ad-Studio-"
COMPOSE_FILE="$ROOT_DIR/docker-compose.dev.yml"

DRY_RUN=false
if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=true
fi

echo "Meta-Ad-Studio: Agente de despliegue ligero"
echo "Directorio raíz: $ROOT_DIR"
echo

step() { echo -e "\n==> $*"; }

run_or_echo() {
  if $DRY_RUN; then
    echo "[DRY-RUN] $*"
  else
    eval "$*"
  fi
}

step "1) Comprobando dependencias básicas (docker, docker-compose, git)"
command -v docker >/dev/null 2>&1 || { echo "docker no está instalado o no está en PATH"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "git no está instalado o no está en PATH"; exit 1; }

if ! $DRY_RUN; then
  # docker-compose puede ser 'docker compose' o 'docker-compose'
  if command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
  else
    DOCKER_COMPOSE_CMD="docker compose"
  fi
else
  DOCKER_COMPOSE_CMD="docker-compose"
fi

step "2) Actualizando código (git pull)"
if [ -d "$ROOT_DIR" ]; then
  run_or_echo "cd \"$ROOT_DIR\" && git fetch --all && git pull --ff-only"
else
  echo "Directorio $ROOT_DIR no existe. Abortando."; exit 1
fi

step "3) Iniciando servicios Docker (dev)"
if [ -f "$COMPOSE_FILE" ]; then
  run_or_echo "$DOCKER_COMPOSE_CMD -f \"$COMPOSE_FILE\" up -d --remove-orphans"
else
  echo "No se encontró $COMPOSE_FILE. Abortando."; exit 1
fi

step "4) Estado final de servicios"
run_or_echo "$DOCKER_COMPOSE_CMD -f \"$COMPOSE_FILE\" ps"

echo
echo "Listo. Si no hubo errores, abre: http://localhost:5173"
if $DRY_RUN; then
  echo "Nota: Esto fue un dry-run. No se realizaron cambios reales.";
fi

exit 0
