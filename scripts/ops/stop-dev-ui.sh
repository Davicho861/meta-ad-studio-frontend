#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.dev.yml"

echo "Stopping Meta-Ad-Studio frontend development environment..."
docker-compose -f "$COMPOSE_FILE" down

echo "Environment stopped."

exit 0
