#!/usr/bin/env bash
set -euo pipefail

# Finalizer probe: local helper to locate PR, get latest Quality Gate run and download artifacts.
# Requires: gh CLI authenticated and jq installed.

REPO="${1:-Davicho861/meta-ad-studio-frontend}"
BRANCH="${2:-chore/ui-accessibility-audit}"

echo "Repository: $REPO"
echo "Branch: $BRANCH"

echo "Locating PR for branch $BRANCH..."
PR_JSON=$(gh pr list --repo "$REPO" --head "$BRANCH" --json number,url,state --limit 5) || true
if [ -z "$PR_JSON" ] || [ "$PR_JSON" = "[]" ]; then
  echo "No PR found for branch $BRANCH in $REPO" >&2
  exit 2
fi

PR_NUMBER=$(echo "$PR_JSON" | jq -r '.[0].number')
PR_URL=$(echo "$PR_JSON" | jq -r '.[0].url')

echo "Found PR #$PR_NUMBER -> $PR_URL"

echo "Listing workflow runs for quality-gate.yml on PR commits..."
RUNS=$(gh run list --repo "$REPO" --workflow quality-gate.yml --json databaseId,status,conclusion,event,headSha,headBranch -L 20) || true
if [ -z "$RUNS" ] || [ "$RUNS" = "[]" ]; then
  echo "No runs found for workflow quality-gate.yml" >&2
  exit 2
fi

echo "Latest runs (top 5):"
echo "$RUNS" | jq -r '.[:5] | .[] | "runId: "+(.databaseId|tostring)+" status: "+.status+" conclusion: "+(.conclusion//"null")+" branch: "+(.headBranch)'

RUN_ID=$(echo "$RUNS" | jq -r '.[0].databaseId')
echo "Using run id: $RUN_ID"

OUTDIR="artifacts/finalizer_run_${RUN_ID}"
mkdir -p "$OUTDIR"

echo "Downloading artifacts for run $RUN_ID into $OUTDIR"
gh run download "$RUN_ID" --repo "$REPO" --dir "$OUTDIR" || true

echo "Downloaded. Listing files:"
ls -la "$OUTDIR"

echo "Done. Review artifacts in $OUTDIR"
