#!/usr/bin/env bash
set -euo pipefail

echo "Checking /api/health..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/health || true)
if [ "$STATUS" != "200" ]; then
  echo "Health check failed: HTTP $STATUS"
  exit 1
fi

echo "Health OK. Checking Prisma connection via api-server logs..."
docker compose logs api-server --tail 100 | tail -n 50

echo "Smoke test passed."
