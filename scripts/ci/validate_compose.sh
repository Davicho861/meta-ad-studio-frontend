#!/usr/bin/env bash
set -euo pipefail

# Validador rápido para docker-compose.dev.yml
# - Verifica que no haya montajes de /app/node_modules
# - Verifica que exista referencia a FRONTEND_PORT o 5173 en la sección frontend

COMPOSE_FILE="docker-compose.dev.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "No se encontró $COMPOSE_FILE en la raíz. Abortando."
  exit 2
fi

echo "Leyendo $COMPOSE_FILE..."

# Buscar volumes que monten node_modules
if grep -n "node_modules" "$COMPOSE_FILE" >/dev/null; then
  echo "ERROR: Se encontraron referencias a 'node_modules' en $COMPOSE_FILE. Revisa montajes que puedan sobreescribir las dependencias de la imagen."
  grep -n "node_modules" "$COMPOSE_FILE" || true
  exit 3
else
  echo "OK: No se encontraron montajes de node_modules."
fi

# Verificar que FRONTEND_PORT o 5173 esté presente en la sección ports
if grep -n "FRONTEND_PORT" "$COMPOSE_FILE" >/dev/null || grep -n ":5173" "$COMPOSE_FILE" >/dev/null; then
  echo "OK: FRONTEND_PORT (o 5173) detectado en $COMPOSE_FILE."
else
  echo "WARN: No se detectó FRONTEND_PORT ni :5173 en $COMPOSE_FILE. Asegúrate de parametrizar el puerto del frontend."
fi

echo "Validación completada."
