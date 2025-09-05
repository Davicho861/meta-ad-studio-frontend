#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.dev.yml"
ENV_FILE="$ROOT_DIR/.env.development"

echo "Starting Meta-Ad-Studio FULL-STACK development environment..."
echo "Compose file: $COMPOSE_FILE"
if [ -f "$ENV_FILE" ]; then
  echo "Using env file: $ENV_FILE"
  export $(grep -v '^#' "$ENV_FILE" | xargs) || true
fi

docker-compose -f "$COMPOSE_FILE" up --build -d

echo
echo "Frontend (Vite) should be available at: http://localhost:5173"
echo "Backend should be reachable inside the Docker network at: $VITE_API_BASE_URL"
echo "(From host, backend is mapped to http://localhost:8000)"
echo
echo "To follow frontend logs: docker-compose -f $COMPOSE_FILE logs -f frontend"
echo "To follow backend logs: docker-compose -f $COMPOSE_FILE logs -f backend"

exit 0
