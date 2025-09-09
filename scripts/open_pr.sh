#!/usr/bin/env bash
set -euo pipefail

# Helper: create PR using GitHub CLI (gh). Requires gh to be installed and authenticated.
# Usage: ./scripts/open_pr.sh [branch]
BRANCH=${1:-chore/ui-accessibility-audit}
TITLE="chore(ci): quality gate + accessibility & midjourney audit"
BODY_FILE=.github/PR_BODY.md

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install from https://cli.github.com/ and authenticate (gh auth login)." >&2
  exit 2
fi

# Ensure branch exists locally
if ! git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  echo "Branch $BRANCH not found locally. Create it or pass an existing branch." >&2
  exit 3
fi

# Push branch if not pushed
if ! git ls-remote --exit-code origin refs/heads/$BRANCH >/dev/null 2>&1; then
  echo "Pushing branch $BRANCH to origin..."
  git push --set-upstream origin $BRANCH
fi

# Create PR
if [ -f "$BODY_FILE" ]; then
  gh pr create --base main --head "$BRANCH" --title "$TITLE" --body-file "$BODY_FILE"
else
  gh pr create --base main --head "$BRANCH" --title "$TITLE" --body "Quality gate + accessibility & Midjourney fidelity audit"
fi
