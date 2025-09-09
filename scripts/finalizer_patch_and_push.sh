#!/usr/bin/env bash
set -euo pipefail

# Finalizer patch and push helper.
# Usage: ./scripts/finalizer_patch_and_push.sh "path/to/patch.patch" "Commit message"
# Requires: git, gh, and network access. This script will create a backup branch if needed.

PATCH_PATH="${1:-}" 
COMMIT_MSG="${2:-Automated: apply final polishing patch}"
BRANCH="chore/ui-accessibility-audit"
REPO_REMOTE="origin"

if [ -z "$PATCH_PATH" ]; then
  echo "Usage: $0 path/to/patch.patch "Commit message"" >&2
  exit 2
fi

if [ ! -f "$PATCH_PATH" ]; then
  echo "Patch file not found: $PATCH_PATH" >&2
  exit 3
fi

ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

echo "Ensuring branch $BRANCH exists locally..."
if git show-ref --verify --quiet refs/heads/$BRANCH; then
  git checkout $BRANCH
else
  git fetch $REPO_REMOTE $BRANCH || true
  if git show-ref --verify --quiet refs/remotes/$REPO_REMOTE/$BRANCH; then
    git checkout -b $BRANCH $REPO_REMOTE/$BRANCH
  else
    echo "Branch $BRANCH not found remotely; creating new local branch $BRANCH from HEAD"
    git checkout -b $BRANCH
  fi
fi

echo "Applying patch: $PATCH_PATH"
git apply --whitespace=nowarn --ignore-space-change --reject "$PATCH_PATH" || (echo "git apply failed; attempting git am" && git am "$PATCH_PATH")

echo "Staging changes"
git add -A

echo "Committing: $COMMIT_MSG"
git commit -m "$COMMIT_MSG" || (echo "No changes to commit" && exit 0)

echo "Pushing to $REPO_REMOTE/$BRANCH"
git push $REPO_REMOTE HEAD:$BRANCH --set-upstream || {
  echo "Push failed; attempting force-with-lease"
  git push --force-with-lease $REPO_REMOTE HEAD:$BRANCH
}

echo "Push complete. Triggering CI and monitoring latest run..."

# Wait for a run to appear
sleep 3
REPO="Davicho861/meta-ad-studio-frontend"

echo "Fetching latest run for workflow quality-gate.yml..."
RUNS=$(gh run list --repo "$REPO" --workflow quality-gate.yml --json databaseId,status,conclusion,headBranch -L 5) || true
echo "$RUNS" | jq -r '.[] | "runId: "+(.databaseId|tostring)+" status: "+.status+" conclusion: "+(.conclusion//"null")+" branch: "+.headBranch'

echo "Monitor loop: waiting for run conclusion (polling every 8s, timeout 20m)..."
TIMEOUT=$((20*60))
INTERVAL=8
ELAPSED=0

while [ $ELAPSED -lt $TIMEOUT ]; do
  LATEST_RUN=$(gh run list --repo "$REPO" --workflow quality-gate.yml --json databaseId,status,conclusion,headBranch -L 1)
  RUN_ID=$(echo "$LATEST_RUN" | jq -r '.[0].databaseId')
  STATUS=$(echo "$LATEST_RUN" | jq -r '.[0].status')
  CONCL=$(echo "$LATEST_RUN" | jq -r '.[0].conclusion')
  BR=$(echo "$LATEST_RUN" | jq -r '.[0].headBranch')

  if [ "$BR" != "$BRANCH" ]; then
    echo "Latest run is for branch $BR (waiting for $BRANCH)..."
    sleep $INTERVAL
    ELAPSED=$((ELAPSED+INTERVAL))
    continue
  fi

  echo "Run $RUN_ID status=$STATUS conclusion=${CONCL:-pending}"
  if [ "$STATUS" = "completed" ]; then
    echo "Run completed with conclusion: $CONCL"
    gh run view "$RUN_ID" --repo "$REPO" --log || true
    gh run download "$RUN_ID" --repo "$REPO" --dir "artifacts/run_${RUN_ID}" || true
    if [ "$CONCL" = "success" ]; then
      echo "CI passed for run $RUN_ID"
      exit 0
    else
      echo "CI failed for run $RUN_ID"
      exit 1
    fi
  fi

  sleep $INTERVAL
  ELAPSED=$((ELAPSED+INTERVAL))
done

echo "Timeout waiting for CI run conclusion" >&2
exit 2
