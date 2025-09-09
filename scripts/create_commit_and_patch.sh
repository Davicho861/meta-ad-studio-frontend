#!/usr/bin/env bash
set -euo pipefail

# Create commit and patch for UI polish changes
# Usage: ./scripts/create_commit_and_patch.sh "Commit message"

MSG="${1:-chore(ui): final pixel polish (spacing, typography, animations, blur-up)}"

ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required" >&2
  exit 2
fi

echo "Staging all changes..."
git add -A

if git diff --cached --quiet; then
  echo "No staged changes to commit. Exiting."
  exit 0
fi

echo "Committing with message: $MSG"
git commit -m "$MSG"

PATCH_FILE="finalizer_ui_polish.patch"
echo "Generating patch to $PATCH_FILE"
git format-patch -1 HEAD --stdout > "$PATCH_FILE"

echo "Patch created: $PATCH_FILE"
echo "To push the branch, run: git push origin HEAD:chore/ui-accessibility-audit --set-upstream"
echo "Or use the helper: ./scripts/finalizer_patch_and_push.sh $PATCH_FILE \"$MSG\""
