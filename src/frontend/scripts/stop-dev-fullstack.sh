#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.dev.yml"

echo "Stopping Meta-Ad-Studio FULL-STACK development environment..."
docker-compose -f "$COMPOSE_FILE" down

echo "All services stopped."

exit 0
