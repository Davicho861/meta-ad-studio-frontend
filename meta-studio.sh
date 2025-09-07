#!/usr/bin/env bash
set -euo pipefail

# meta-studio.sh - Orquestador maestro para Meta-Ad-Studio
# Consolidates auto-update, docker-compose orchestration and an interactive menu.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

CI_MODE=false
AUTO_SELECT=false
LOG_TIMEOUT=6

while [[ $# -gt 0 ]]; do
  case "$1" in
    --ci) CI_MODE=true; shift ;;            # automated end-to-end test mode
    --auto) AUTO_SELECT=true; shift ;;      # auto-select menu option when services running
    --logs-timeout) LOG_TIMEOUT="$2"; shift 2 ;;
    -h|--help) echo "Usage: $0 [--ci] [--auto] [--logs-timeout SECONDS]"; exit 0 ;;
    *) echo "Unknown arg: $1"; exit 2 ;;
  esac
done

fail() { echo "ERROR: $*" >&2; exit 1; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fail "$2"
  fi
}

# Prefer docker-compose binary but fall back to `docker compose`
if command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker-compose"
elif command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker compose"
else
  DOCKER_COMPOSE_CMD="docker-compose" # will error later with clearer message
fi

REPO_DIR_NAME="$(basename "$ROOT_DIR")"
SAFE_NAME="$(echo "$REPO_DIR_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/^_\+//;s/_\+$//')"
if [ -z "$SAFE_NAME" ]; then SAFE_NAME="meta_ad_studio"; fi
export COMPOSE_PROJECT_NAME="$SAFE_NAME"

# Choose compose file - prefer dev variant if present
if [ -f "$ROOT_DIR/docker-compose.dev.yml" ]; then
  COMPOSE_FILE="$ROOT_DIR/docker-compose.dev.yml"
elif [ -f "$ROOT_DIR/docker-compose.yml" ]; then
  COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
else
  COMPOSE_FILE=""
fi

running_containers() {
  if [ -z "$COMPOSE_FILE" ]; then
    echo "";
    return
  fi
  $DOCKER_COMPOSE_CMD -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" ps -q 2>/dev/null || true
}

git_update() {
  if command -v git >/dev/null 2>&1 && [ -d .git ]; then
    echo "Actualizando repositorio..."
    git fetch --all --prune || true
    git pull --ff-only || true
    git submodule update --init --recursive || true
  else
    echo "No es un repositorio git o git no disponible; omitiendo actualizaci\u00f3n." 
  fi
}

start_flow() {
  echo "[meta-studio] Inicio de flujo: actualizaci\u00f3n y arranque de servicios"
  git_update
  if [ -z "$COMPOSE_FILE" ]; then
    fail "No se encontr\u00f3 docker-compose.* en el proyecto. A\u00f1ade docker-compose.yml o docker-compose.dev.yml"
  fi
  echo "Usando compose file: $COMPOSE_FILE (project: $COMPOSE_PROJECT_NAME)"
  echo "Levantando servicios: $DOCKER_COMPOSE_CMD -p $COMPOSE_PROJECT_NAME -f $COMPOSE_FILE up -d --build --remove-orphans"
  $DOCKER_COMPOSE_CMD -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" up -d --build --remove-orphans
  echo "Servicios solicitados. Esperando unos segundos para estabilizar..."
  sleep 4
}

interactive_menu() {
  echo
  echo "El entorno '$COMPOSE_PROJECT_NAME' est\u00e1 en ejecuci\u00f3n. \u00bfQu\u00e9 deseas hacer?"
  echo "(1) Ver el estado y los logs en tiempo real"
  echo "(2) Reiniciar los servicios"
  echo "(3) Detener los servicios por completo"
  echo "(q) Salir"
  if $AUTO_SELECT || $CI_MODE; then
    choice=1
    echo "Auto-selection active: choosing option $choice"
  else
    read -r -p "Selecciona una opci\u00f3n: " choice
  fi

  case "$choice" in
    1)
      echo "Mostrando estado y logs (Ctrl+C para salir)..."
      $DOCKER_COMPOSE_CMD -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" ps || true
      if $CI_MODE; then
        # In CI we capture a short window of logs to verify service started
        echo "(CI) Capturando logs por ${LOG_TIMEOUT}s..."
        if command -v timeout >/dev/null 2>&1; then
          timeout "$LOG_TIMEOUT" $DOCKER_COMPOSE_CMD -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" logs -f || true
        else
          # fallback: run logs in background and sleep
          $DOCKER_COMPOSE_CMD -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" logs -f &
          sleep "$LOG_TIMEOUT"
          pkill -P $$ -f "docker-compose.*logs" || true
        fi
      else
        $DOCKER_COMPOSE_CMD -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" logs -f
      fi
      ;;
    2)
      echo "Reiniciando servicios..."
      $DOCKER_COMPOSE_CMD -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" restart
      echo "Reinicio completo."
      ;;
    3)
      echo "Deteniendo servicios..."
      $DOCKER_COMPOSE_CMD -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" down
      echo "Servicios detenidos."
      ;;
    q|Q)
      echo "Saliendo sin cambios." ;;
    *) echo "Opci\u00f3n no reconocida. Saliendo." ;;
  esac
}

verify_ui() {
  echo "Verificando UI en http://localhost:5173..."
  if command -v curl >/dev/null 2>&1; then
    # try several times
    for i in 1 2 3 4 5; do
      if curl -sSf --max-time 5 http://localhost:5173/ >/dev/null 2>&1; then
        echo "UI disponible (http://localhost:5173)"
        return 0
      fi
      echo "Esperando UI... intento $i/5"
      sleep 2
    done
    echo "No se pudo acceder a http://localhost:5173"
    return 2
  else
    echo "curl no instalado: no se puede verificar la UI."
    return 3
  fi
}

main() {
  # Basic checks
  require_cmd bash "Bash es requerido"
  if ! command -v docker >/dev/null 2>&1; then
    fail "Docker no est\u00e1 instalado o no se puede ejecutar. Inicia Docker y vuelve a intentarlo."
  fi

  # Decide flow
  running=$(running_containers)
  if [ -z "${running// /}" ]; then
    echo "No hay contenedores en ejecuci\u00f3n para proyecto '$COMPOSE_PROJECT_NAME'. Ejecutando arranque en fr\u00edo."
    start_flow
    verify_ui || true
    if $CI_MODE; then
      # In CI mode exit with non-zero if verify failed
      if verify_ui; then
        echo "(CI) Cold start verification OK"
      else
        echo "(CI) Cold start verification FAILED"; exit 5
      fi
    fi
  else
    echo "Contenedores detectados para '$COMPOSE_PROJECT_NAME':" && docker ps --filter "name=${COMPOSE_PROJECT_NAME}" --format 'table {{.Names}}\t{{.Status}}'
    interactive_menu
  fi
}

main

# If script was launched without an interactive TTY (e.g., some launchers), pause briefly so the user can read messages
if [ ! -t 0 ]; then
  echo
  echo "Nota: el orquestador terminó su ejecución. Si este script se lanzó desde un lanzador gráfico, la terminal puede cerrarse a menos que el lanzador permanezca abierta."
  sleep 1
fi
