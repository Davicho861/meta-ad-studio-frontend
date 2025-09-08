#!/usr/bin/env bash
set -euo pipefail

# apply_patch_and_push.sh
# Uso: Ejecutar dentro de un clone del repo destino (o pasar --repo-dir).
# Permite aplicar un bundle o un patch exportado por el agente y empujar una rama lista para PR.

show_help(){
  cat <<EOF
Usage:
  ./apply_patch_and_push.sh --bundle /path/to/file.bundle --branch chore/ui-accessibility-audit --remote origin
  ./apply_patch_and_push.sh --patch /path/to/file.patch --branch chore/ui-accessibility-audit --remote origin

Options:
  --bundle PATH     Path al archivo .bundle creado por el agente
  --patch PATH      Path al archivo .patch creado por el agente
  --branch NAME     Nombre de la rama a crear (default: chore/ui-accessibility-audit)
  --remote NAME     Remote target (default: origin)
  --base NAME       Branch base para la PR (default: main)
  --pr-title TITLE  Título del PR (opcional)
  --pr-body FILE    Archivo con body del PR (opcional; puede usar ../PR_UI_ACCESSIBILITY.md)
  --repo-dir PATH   Directorio del clone donde aplicar (default: current directory)

Notes:
  - Ejecuta en un clone que tenga el remote configurado y permisos para push.
  - Si 'gh' (GitHub CLI) está instalado y autenticado, el script intentará crear el PR automáticamente.
  - El script respeta la estrategia de bundle (fetch) o patch (git am).
EOF
}

# Defaults
BRANCH="chore/ui-accessibility-audit"
REMOTE="origin"
BASE="main"
REPO_DIR="."
PR_TITLE="chore(ui): accessibility & interaction audit fixes — PromptBar / ResultCard / GenerationGrid"
PR_BODY_FILE=""
BUNDLE=""
PATCH=""

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --bundle) BUNDLE="$2"; shift 2;;
    --patch) PATCH="$2"; shift 2;;
    --branch) BRANCH="$2"; shift 2;;
    --remote) REMOTE="$2"; shift 2;;
    --base) BASE="$2"; shift 2;;
    --pr-title) PR_TITLE="$2"; shift 2;;
    --pr-body) PR_BODY_FILE="$2"; shift 2;;
    --repo-dir) REPO_DIR="$2"; shift 2;;
    --help) show_help; exit 0;;
    *) echo "Unknown arg: $1"; show_help; exit 1;;
  esac
done

cd "$REPO_DIR"

if [[ -z "$BUNDLE" && -z "$PATCH" ]]; then
  echo "Error: must provide --bundle or --patch"
  show_help
  exit 1
fi

# Ensure working tree is clean
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree not clean. Commit or stash changes before running."
  git status --porcelain
  exit 1
fi

# Apply bundle or patch
if [[ -n "$BUNDLE" ]]; then
  echo "Applying bundle: $BUNDLE"
  git fetch "$BUNDLE" "+refs/heads/*:refs/remotes/temp/*"
  if git show-ref --verify --quiet "refs/remotes/temp/$BRANCH"; then
    git checkout -b "$BRANCH" "refs/remotes/temp/$BRANCH"
  else
    # try to pick FETCH_HEAD
    git checkout -b "$BRANCH" FETCH_HEAD
  fi
elif [[ -n "$PATCH" ]]; then
  echo "Applying patch: $PATCH"
  # create branch from current base
  git checkout -b "$BRANCH" "$BASE"
  git am "$PATCH" || {
    echo "git am failed; aborting and printing instructions to apply manually."
    git am --abort || true
    exit 1
  }
fi

# Push branch
echo "Pushing branch $BRANCH to $REMOTE"
git push -u "$REMOTE" "$BRANCH"

# Create PR if gh is available
if command -v gh >/dev/null 2>&1; then
  echo "Creating PR with gh..."
  if [[ -n "$PR_BODY_FILE" && -f "$PR_BODY_FILE" ]]; then
    gh pr create --base "$BASE" --head "$BRANCH" --title "$PR_TITLE" --body-file "$PR_BODY_FILE"
  else
    gh pr create --base "$BASE" --head "$BRANCH" --title "$PR_TITLE" --body "See PR_UI_ACCESSIBILITY.md for details"
  fi
  echo "PR created (or opened in interactive mode)."
else
  echo "gh CLI not found. PR not created automatically. To create PR manually run:"
  echo "  gh pr create --base $BASE --head $BRANCH --title \"$PR_TITLE\" --body-file /path/to/PR_UI_ACCESSIBILITY.md"
fi

echo "Done." 
