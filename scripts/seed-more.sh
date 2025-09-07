#!/usr/bin/env bash
set -euo pipefail

# Load .env if present
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs) || true
fi

PG_USER=${POSTGRES_USER:-devuser}
PG_DB=${POSTGRES_DB:-meta_ad_studio}

echo "Running extended seed against ${PG_DB} as ${PG_USER}"

docker compose exec -T postgres psql -U "$PG_USER" -d "$PG_DB" <<'SQL'
-- Team
INSERT INTO public."Team" ("id","createdAt","updatedAt","name")
SELECT gen_random_uuid(), now(), now(), 'Dev Team'
WHERE NOT EXISTS (SELECT 1 FROM public."Team" WHERE "name"='Dev Team');

-- BrandProfile for user (use subquery to find user id)
INSERT INTO public."BrandProfile" ("id","createdAt","updatedAt","brandName","brandColors","userId")
SELECT gen_random_uuid(), now(), now(), 'MetaDemo', ARRAY['#FF0000','#00FF00'], (SELECT "id" FROM public."User" WHERE "email" = 'dev@example.com' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public."BrandProfile" bp WHERE bp."userId" = (SELECT "id" FROM public."User" WHERE "email" = 'dev@example.com' LIMIT 1));

-- Video
INSERT INTO public."Video" ("id","createdAt","updatedAt","imageUrl","status","userId")
SELECT gen_random_uuid(), now(), now(), 'https://example.com/image.jpg', 'completed', (SELECT "id" FROM public."User" WHERE "email" = 'dev@example.com' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public."Video" v WHERE v."userId" = (SELECT "id" FROM public."User" WHERE "email" = 'dev@example.com' LIMIT 1));

-- Sprint
INSERT INTO public."Sprint" ("id","createdAt","updatedAt","name","startDate","endDate","projectId","createdById")
SELECT gen_random_uuid(), now(), now(), 'Sprint 1', now(), now() + interval '7 days', (SELECT "id" FROM public."Project" WHERE "name"='Demo Project' LIMIT 1), (SELECT "id" FROM public."User" WHERE "email"='dev@example.com' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public."Sprint" s WHERE s."name"='Sprint 1' AND s."projectId" = (SELECT "id" FROM public."Project" WHERE "name"='Demo Project' LIMIT 1));

-- Issue
INSERT INTO public."Issue" ("id","createdAt","updatedAt","title","description","status","priority","createdById","projectId")
SELECT gen_random_uuid(), now(), now(), 'Sample Issue', 'This is a seeded issue', 'open', 'medium', (SELECT "id" FROM public."User" WHERE "email"='dev@example.com' LIMIT 1), (SELECT "id" FROM public."Project" WHERE "name"='Demo Project' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public."Issue" i WHERE i."title"='Sample Issue' AND i."projectId" = (SELECT "id" FROM public."Project" WHERE "name"='Demo Project' LIMIT 1));
SQL

echo "Extended seed completed."
