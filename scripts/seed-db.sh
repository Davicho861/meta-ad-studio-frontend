#!/usr/bin/env bash
set -euo pipefail

# Load .env if present
if [ -f ".env" ]; then
  # shellcheck disable=SC1091
  export $(grep -v '^#' .env | xargs)
fi

PG_USER=${POSTGRES_USER:-devuser}
PG_PASSWORD=${POSTGRES_PASSWORD:-password}
PG_DB=${POSTGRES_DB:-meta_ad_studio}
PG_HOST=${PG_HOST:-postgres}
PG_PORT=${PG_PORT:-5432}

echo "Seeding database ${PG_DB} as ${PG_USER}@${PG_HOST}:${PG_PORT}"


docker compose exec -T postgres psql -U "$PG_USER" -d "$PG_DB" <<'SQL'
-- Example seed; set required fields per Prisma schema (quote identifiers)
INSERT INTO public."User" ("id","firebaseId","createdAt","updatedAt","email","password","name","role")
SELECT gen_random_uuid(), 'firebase_dev_1', now(), now(), 'dev@example.com', 'devpass', 'Dev User', 'USER'
WHERE NOT EXISTS (SELECT 1 FROM public."User" WHERE "email" = 'dev@example.com');

INSERT INTO public."Project" ("id","createdAt","updatedAt","name","description","createdById")
SELECT gen_random_uuid(), now(), now(), 'Demo Project', 'Auto-seeded demo project', u."id"
FROM (SELECT "id" FROM public."User" WHERE "email" = 'dev@example.com' LIMIT 1) u
WHERE NOT EXISTS (SELECT 1 FROM public."Project" WHERE "name" = 'Demo Project');
SQL

echo "Seed completed."
