#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$ROOT_DIR/.env.development"

echo "Guardian: pre-flight checks for Meta-Ad-Studio dev environment"

# Check docker
if ! command -v docker >/dev/null 2>&1; then
    echo "Docker no está instalado. Instálalo y vuelve a intentarlo."
    exit 1
fi

# Check docker-compose
if ! command -v docker-compose >/dev/null 2>&1; then
    echo "docker-compose no está instalado. Instálalo y vuelve a intentarlo."
    exit 1
fi

# Check .env
if [ ! -f "$ENV_FILE" ]; then
    echo ".env.development no encontrado en $ROOT_DIR. Crea uno basado en .env.example si existe."
    exit 1
fi

check_port() {
    local port=$1
    if ss -ltn "sport = :$port" | grep -q LISTEN; then
        echo "Puerto $port en uso. Para identificar el proceso ejecuta: sudo lsof -i :$port || ss -ltnp | grep ':$port'"
        return 1
    fi
    return 0
}

PORTS=(5173 4000 5432 6379)
conflicts=()
for p in "${PORTS[@]}"; do
    if ! check_port "$p"; then
        conflicts+=("$p")
    fi
done

if [ ${#conflicts[@]} -ne 0 ]; then
    echo "Se detectaron puertos en conflicto: ${conflicts[*]}."
    echo "Opciones: 1) Detener procesos que usan esos puertos, 2) Remapear puertos en docker-compose.dev.yml."
    echo "Comandos útiles para diagnosticar:"
    for p in "${conflicts[@]}"; do
        echo "  sudo lsof -i :$p"
        echo "  ss -ltnp | grep ':$p'"
    done
    echo "El Guardian no continuará hasta que se resuelvan los conflictos." 
    exit 2
fi

# Normalize compose project name
REPO_DIR_NAME="$(basename "$ROOT_DIR")"
SAFE_NAME="$(echo "$REPO_DIR_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/^_\+//;s/_\+$//')"
if [ -z "$SAFE_NAME" ]; then
    SAFE_NAME="meta_ad_studio"
fi
export COMPOSE_PROJECT_NAME="$SAFE_NAME"

# Run the start script
echo "Pre-flight checks OK. Lanzando entorno con ./scripts/start-dev-fullstack.sh"
exec "$ROOT_DIR/scripts/start-dev-fullstack.sh"
