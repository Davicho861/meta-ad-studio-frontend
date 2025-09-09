#!/usr/bin/env bash
set -euo pipefail

# Apply finalizer prepared files into repo, commit and generate patch.
# Usage: ./scripts/apply_finalizer_patch.sh

ROOT=$(cd "$(dirname "$0")/.." && pwd)
PATCH_DIR="$ROOT/scripts/finalizer_patch_files"

if [ ! -d "$PATCH_DIR" ]; then
  echo "Patch files directory not found: $PATCH_DIR" >&2
  exit 2
fi

echo "Copying files from $PATCH_DIR into repo..."

# Map of source -> destination
declare -A files
files["$PATCH_DIR/tailwind.config.ts"]="$ROOT/tailwind.config.ts"
files["$PATCH_DIR/ResultCard.tsx"]="$ROOT/src/frontend/packages/meta-verse-visualizer-main/src/components/ResultCard.tsx"
files["$PATCH_DIR/GenerationGrid.tsx"]="$ROOT/src/frontend/packages/meta-verse-visualizer-main/src/components/GenerationGrid.tsx"
files["$PATCH_DIR/PromptBar.tsx"]="$ROOT/src/frontend/packages/meta-verse-visualizer-main/src/components/PromptBar.tsx"
files["$PATCH_DIR/blur-up.css"]="$ROOT/src/frontend/packages/meta-verse-visualizer-main/src/styles/blur-up.css"

for src in "${!files[@]}"; do
  dst="${files[$src]}"
  echo "Copying $(basename "$src") -> $dst"
  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
done

echo "Staging changes..."
git add -A

if git diff --cached --quiet; then
  echo "No changes to commit." 
else
  MSG="chore(ui): final pixel polish (spacing, typography, animations, blur-up)"
  git commit -m "$MSG"
  PATCH_FILE="$ROOT/finalizer_ui_polish.patch"
  echo "Generating patch to $PATCH_FILE"
  git format-patch -1 HEAD --stdout > "$PATCH_FILE"
  echo "Patch generated: $PATCH_FILE"
fi

echo "Done. Review changes and use scripts/finalizer_patch_and_push.sh to push and monitor CI." 
