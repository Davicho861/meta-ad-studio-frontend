#!/usr/bin/env bash
set -euo pipefail

git add frontend/package.json frontend.backup/package.json frontend/Dockerfile docker-compose.dev.yml docker-compose.prod.yml packages/api-server/server/package.json ops/README.md scripts/validate-environments.sh
git commit -m "feat(ops): implement operational excellence with segregated dev/prod environments and robust builds"
git push

echo "Committed and pushed operational changes."
