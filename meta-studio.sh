#!/usr/bin/env bash
set -euo pipefail

# meta-studio.sh - Master orchestrator for Meta-Ad Studio development environment
# Features:
# - auto-update (git pull)
# - interactive menu: start, stop, restart services, open frontend, open docs
# - basic health checks

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR"

function ensure_git_clean() {
  if [[ -n "$(git -C "$REPO_ROOT" status --porcelain)" ]]; then
    echo "Your git working tree has local changes. Commit or stash them before auto-update."
    return 1
  fi
  return 0
}

function auto_update() {
  echo "Checking for updates..."
  if ensure_git_clean; then
    git -C "$REPO_ROOT" fetch --all --prune
    git -C "$REPO_ROOT" pull --ff-only || echo "Fast-forward pull failed; please update manually."
    echo "Repository updated."
  else
    echo "Skipping auto-update due to local changes."
  fi
}

function start_frontend() {
  echo "Starting frontend in a new terminal..."
  if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -lc "cd '$REPO_ROOT/frontend' && ./node_modules/.bin/vite --host" || true
  elif command -v x-terminal-emulator &> /dev/null; then
    x-terminal-emulator -e bash -c "cd '$REPO_ROOT/frontend' && npm run dev" || true
  else
    echo "No supported terminal emulator found; run 'cd frontend && npm run dev' manually."
  fi
}

function stop_frontend() {
  echo "Stopping frontend (best-effort by killing vite processes)..."
  pkill -f vite || echo "No vite process found or insufficient permissions."
}

function open_repo_in_editor() {
  if command -v code &> /dev/null; then
    code "$REPO_ROOT"
  else
    echo "VSCode not found in PATH; open the project folder in your editor of choice: $REPO_ROOT"
  fi
}

function show_menu() {
  while true; do
    cat <<EOF

Meta-Ad Studio - Development Orchestrator
=========================================
1) Auto-update repository (git pull)
2) Start frontend (dev server)
3) Stop frontend
4) Open repo in VSCode
5) Show git status
6) Health check
7) Exit

Choose an option [1-7]: 
EOF
    read -r choice
    case "$choice" in
      1) auto_update ;;
      2) start_frontend ;;
      3) stop_frontend ;;
      4) open_repo_in_editor ;;
      5) git -C "$REPO_ROOT" status --short ;;
      6) echo "Health checks:"; git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD; ps aux | grep -E 'vite|storybook' | grep -v grep || true ;;
      7) echo "Goodbye!"; exit 0 ;;
      *) echo "Invalid option" ;;
    esac
  done
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  # If run directly, ensure script is executable
  chmod +x "$SCRIPT_DIR/meta-studio.sh" || true
  show_menu
fi
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
    echo "No es un repositorio git o git no disponible; omitiendo actualización." 
  fi
}

start_flow() {
  echo "[meta-studio] Inicio de flujo: actualización y arranque de servicios"
  git_update
  if [ -z "$COMPOSE_FILE" ]; then
    fail "No se encontró docker-compose.* en el proyecto. Añade docker-compose.yml o docker-compose.dev.yml"
  fi
  echo "Usando compose file: $COMPOSE_FILE (project: $COMPOSE_PROJECT_NAME)"
  echo "Levantando servicios: $DOCKER_COMPOSE_CMD -p $COMPOSE_PROJECT_NAME -f $COMPOSE_FILE up -d --build --remove-orphans"
  $DOCKER_COMPOSE_CMD -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" up -d --build --remove-orphans
  echo "Servicios solicitados. Esperando unos segundos para estabilizar..."
  sleep 4
}

interactive_menu() {
  echo
  echo "El entorno '$COMPOSE_PROJECT_NAME' está en ejecución. ¿Qué deseas hacer?"
  echo "(1) Ver el estado y los logs en tiempo real"
  echo "(2) Reiniciar los servicios"
  echo "(3) Detener los servicios por completo"
  echo "(q) Salir"
  if $AUTO_SELECT || $CI_MODE; then
    choice=1
    echo "Auto-selection active: choosing option $choice"
  else
    read -r -p "Selecciona una opción: " choice
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
    *) echo "Opción no reconocida. Saliendo." ;;
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
    fail "Docker no está instalado o no se puede ejecutar. Inicia Docker y vuelve a intentarlo."
  fi

  # Decide flow
  running=$(running_containers)
  if [ -z "${running// /}" ]; then
    echo "No hay contenedores en ejecución para proyecto '$COMPOSE_PROJECT_NAME'. Ejecutando arranque en frío."
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
    echo "Contenedores detectados para '$COMPOSE_PROJECT_NAME':" && docker ps --filter "name=${COMPOSE_PROJECT_NAME}" --format 'table {{.Names}}	{{.Status}}'
    interactive_menu
  fi
}

main
