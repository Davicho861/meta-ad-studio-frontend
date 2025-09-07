#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.dev.yml"

echo "Starting Meta-Ad-Studio frontend development environment..."
echo "Using compose file: $COMPOSE_FILE"

docker-compose -f "$COMPOSE_FILE" up --build -d

echo "Frontend dev environment started. Waiting for server to become ready..."
echo "You can view logs with: docker-compose -f $COMPOSE_FILE logs -f frontend"

# Try to show a short tail of logs to confirm startup
sleep 1
docker-compose -f "$COMPOSE_FILE" logs --tail=30 frontend || true

echo "Access the UI at: http://localhost:5173 (or http://localhost:3000 if using 3000)"

exit 0
