#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DRY_RUN=true
PUSH_REMOTE=false

usage() {
  cat <<EOF
Usage: $0 [--apply] [--push]

--apply    Apply changes (by default script runs in dry-run mode and will not push)
--push     Push commit to origin main after committing
EOF
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply) DRY_RUN=false; shift ;;
    --push) PUSH_REMOTE=true; shift ;;
    -h|--help) usage ;;
    *) echo "Unknown arg: $1"; usage ;;
  esac
done

echo "Deploy Golden Master - $(date)"
echo "Dry run: $DRY_RUN  Push remote: $PUSH_REMOTE"

cd "$ROOT_DIR"

# Step 1: create patch from current working tree
echo "Creating unification.patch from current working tree..."
git diff > unification.patch || true
echo "Patch saved to unification.patch (size: $(stat -c%s unification.patch) bytes)"

if [ "$DRY_RUN" = true ]; then
  echo "DRY RUN: skipping git add/commit/push. To apply changes use --apply"
else
  echo "Staging all changes..."
  git add -A
  git commit -m "deploy(release): Apply unification patch and create golden master" || echo "No changes to commit"
  if [ "$PUSH_REMOTE" = true ]; then
    echo "Pushing to origin main..."
    git push origin main
  else
    echo "--push not provided: skipping push"
  fi
fi

# Step 2: clean docker state
echo "Stopping and removing docker-compose project (volumes included)..."
docker-compose -p meta_ad_studio -f docker-compose.dev.yml down --volumes || true

# Step 3: start guardian
echo "Starting guardian-script.sh..."
chmod +x ./guardian-script.sh
./guardian-script.sh || true

# Step 4: verification
echo "Esperando 15 segundos para que el servidor de Vite se estabilice..."
sleep 15
if curl -sS http://localhost:5173/src/pages/DashboardPage.tsx | grep -E "ResultsGrid|PromptBar" >/dev/null; then
  echo "VERIFICACIÓN DE COMPONENTES: ÉXITO"
  exit 0
else
  echo "VERIFICACIÓN DE COMPONENTES: FALLO"
  exit 2
fi
