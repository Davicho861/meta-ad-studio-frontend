#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.dev.yml"
ENV_FILE="$ROOT_DIR/.env.development"

# Normalize a safe compose project name based on the repo folder name to avoid
# invalid image tags (example: folders with trailing hyphens or uppercase).
# Produce a lowercase alphanumeric+underscore name without leading/trailing underscores.
REPO_DIR_NAME="$(basename "$ROOT_DIR")"
SAFE_NAME="$(echo "$REPO_DIR_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/^_\+//;s/_\+$//')"
if [ -z "$SAFE_NAME" ]; then
  SAFE_NAME="meta_ad_studio"
fi
export COMPOSE_PROJECT_NAME="$SAFE_NAME"

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
