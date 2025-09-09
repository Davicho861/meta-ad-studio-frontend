#!/usr/bin/env bash
set -euo pipefail

# Helper local script to run a subset of the CI quality checks locally
# Usage: ./scripts/run_quality_checks.sh [FRONTEND_PORT]
PORT=${1:-5173}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

echo "Installing dependencies"
npm ci

echo "Starting frontend (docker-compose.dev.yml)"
docker-compose -f docker-compose.dev.yml up -d

echo "Waiting for frontend on port $PORT"
npx wait-on http://localhost:${PORT} --timeout 45000

echo "Running axe"
npx @axe-core/cli http://localhost:${PORT} --save ./axe-report.json --json || true
node scripts/axe-report-html.js ./axe-report.json ./axe-report.html || true

echo "Done - open ./axe-report.html to review"
