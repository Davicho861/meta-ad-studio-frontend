#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Copy .env.example to .env if not present
if [ ! -f .env ]; then
  echo "Creating .env from .env.example"
  cp .env.example .env
  echo "Please review .env and update secrets if necessary."
else
  echo ".env already exists — skipping copy"
fi

# Start docker compose
docker compose up --build -d

echo "Containers started. Use 'docker ps' to verify and 'docker logs -f <name>' for logs."
