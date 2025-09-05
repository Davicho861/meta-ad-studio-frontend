#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$ROOT_DIR/.env.development"

echo "Orquestador: comprobaciones iniciales para Meta-Ad-Studio dev environment"

# Utilities
fail_if_missing() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "$2"
        exit 1
    fi
}

fail_if_missing docker "Docker no está instalado. Instálalo y vuelve a intentarlo."
fail_if_missing docker-compose "docker-compose no está instalado. Instálalo y vuelve a intentarlo."

if [ ! -f "$ENV_FILE" ]; then
    echo ".env.development no encontrado en $ROOT_DIR. Crea uno basado en .env.example si lo necesitas."
    # no fatal; allow user to proceed if compose files contain necessary defaults
fi

# Normalize compose project name
REPO_DIR_NAME="$(basename "$ROOT_DIR")"
SAFE_NAME="$(echo "$REPO_DIR_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/^_\+//;s/_\+$//')"
if [ -z "$SAFE_NAME" ]; then
    SAFE_NAME="meta_ad_studio"
fi
export COMPOSE_PROJECT_NAME="$SAFE_NAME"

COMPOSE_FILE="$ROOT_DIR/docker-compose.dev.yml"

running_containers() {
    # returns list of running container IDs for the compose project
    docker-compose -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" ps -q 2>/dev/null || true
}

start_flow() {
    echo "Iniciando flujo de arranque: actualización Git y levantar servicios..."
    (cd "$ROOT_DIR" && git pull --ff-only || true)
    (cd "$ROOT_DIR" && git submodule update --init --recursive || true)
    echo "Levantando servicios (docker-compose up -d --build)..."
    docker-compose -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" up -d --build
    echo "Servicios levantados. Para ver logs: docker-compose -p $COMPOSE_PROJECT_NAME -f $COMPOSE_FILE logs -f"
}

interactive_menu() {
    echo
    echo "El entorno '$COMPOSE_PROJECT_NAME' ya está en ejecución. ¿Qué deseas hacer?"
    echo "(1) Ver el estado y los logs en tiempo real"
    echo "(2) Reiniciar los servicios"
    echo "(3) Detener los servicios por completo"
    echo "(Cualquier otra tecla) Salir"
    read -r -p "Selecciona una opción: " choice
    case "$choice" in
        1)
            echo "Mostrando logs en tiempo real (Ctrl+C para salir)..."
            docker-compose -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" ps
            docker-compose -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" logs -f
            ;;
        2)
            echo "Reiniciando servicios..."
            docker-compose -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" restart
            echo "Reinicio completo. Usa logs o ps para verificar estado."
            ;;
        3)
            echo "Deteniendo servicios..."
            docker-compose -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" down
            echo "Servicios detenidos."
            ;;
        *)
            echo "Saliendo sin cambios."
            ;;
    esac
}

echo "Comprobando contenedores del proyecto '$COMPOSE_PROJECT_NAME'..."
running=$(running_containers)
if [ -z "${running// /}" ]; then
    echo "No hay contenedores en ejecución para $COMPOSE_PROJECT_NAME. Procediendo con arranque."
    start_flow
else
    echo "Se detectaron contenedores en ejecución para $COMPOSE_PROJECT_NAME:" && docker ps --filter "name=${COMPOSE_PROJECT_NAME}" --format 'table {{.Names}}	{{.Status}}'
    interactive_menu
fi

exit 0
