#!/usr/bin/env bash
# Small helper to check compose services health and endpoints
set -euo pipefail

COMPOSE_FILE=${1:-docker-compose.dev.yml}

echo "Checking services from ${COMPOSE_FILE}"
docker compose -f ${COMPOSE_FILE} ps

echo "Waiting 5s for services to settle..."
sleep 5

echo "Checking HTTP endpoints (frontend)..."
if [[ "${COMPOSE_FILE}" == *dev* ]]; then
  HOST=http://localhost:5173
else
  HOST=http://localhost:8080
fi

if command -v curl >/dev/null 2>&1; then
  echo "GET ${HOST} ->"
  curl -I --silent --fail ${HOST} || echo "Frontend not responding yet"
else
  echo "curl not installed; skipping HTTP check"
fi

echo "Done"
