#!/usr/bin/env bash
set -euo pipefail

HOST=${PG_HOST:-postgres}
PORT=${PG_PORT:-5432}
USER=${POSTGRES_USER:-devuser}
DB=${POSTGRES_DB:-meta_ad_studio}

echo "Waiting for Postgres at $HOST:$PORT..."
until docker compose exec -T postgres pg_isready -U "$USER" -d "$DB" >/dev/null 2>&1; do
  sleep 1
done
echo "Postgres is ready"
