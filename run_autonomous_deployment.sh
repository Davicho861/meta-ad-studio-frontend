#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
REGION=${1:-"us-central1"} # Default to us-central1 if not provided
CANARY_PERCENTAGE=${2:-10} # Default to a 10% canary
SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL:-"https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"}

# --- Helper Functions ---
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [$REGION] $1"
}

notify_slack() {
    curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"$1\"}" $SLACK_WEBHOOK_URL
}

# --- Phase 1: Pre-Deployment Checks ---
log "Phase 1: Starting Pre-Deployment Checks..."
notify_slack "🚀 Starting production deployment to **$REGION**..."

log "Running client and server tests..."
npm run test:client &> /dev/null &
CLIENT_PID=$!
npm run test:server &> /dev/null &
SERVER_PID=$!
wait $CLIENT_PID
wait $SERVER_PID

log "Submitting build to Cloud Build for region $REGION..."
gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=$REGION .

log "Phase 1 complete."

# --- Phase 2: Canary Deployment ---
log "Phase 2: Starting Canary Deployment (${CANARY_PERCENTAGE}%)..."
notify_slack " canary deployment to **$REGION** (${CANARY_PERCENTAGE}%)..."

log "Applying canary manifests..."
# This assumes you have a separate set of canary manifests or a tool like Flagger/Argo Rollouts
kubectl apply -f k8s/canary-deployment.yaml --namespace $REGION

log "Phase 2 complete."

# --- Phase 3: Canary Verification ---
log "Phase 3: Starting Canary Verification..."
sleep 60 # Allow time for the canary to stabilize

log "Running k6 latency tests against the canary..."
k6 run --env REGION=$REGION tests/regional-latency-test.js

log "Checking for errors in the canary logs..."
CANARY_ERRORS=$(kubectl logs -l app=meta-studio-vr-ar,track=canary -n $REGION --tail=100 | grep -i "error")

if [ ! -z "$CANARY_ERRORS" ]; then
    log "Canary verification failed. Errors found in logs."
    notify_slack "❌ Canary deployment to **$REGION** failed. Rolling back."
    # --- Rollback ---
    kubectl rollout undo deployment/meta-studio-vr-ar -n $REGION
    exit 1
fi

log "Canary verification successful."
notify_slack "✅ Canary deployment to **$REGION** is stable. Proceeding with full rollout."
log "Phase 3 complete."

# --- Phase 4: Full Production Rollout ---
log "Phase 4: Starting Full Production Rollout..."

log "Promoting the canary to production..."
# This would be handled by your rollout tool (e.g., `flagger promote`, `argo rollouts promote`)
# For a simpler setup, we'll just apply the production manifests
kubectl apply -f k8s/deployment.yaml --namespace $REGION

log "Phase 4 complete."

# --- Phase 5: Post-Rollout Monitoring ---
log "Phase 5: Starting Post-Rollout Monitoring..."
sleep 180 # Monitor for 3 minutes after the full rollout

log "Checking for any post-rollout errors..."
PRODUCTION_ERRORS=$(kubectl logs -l app=meta-studio-vr-ar -n $REGION --tail=500 | grep -i "error")

if [ ! -z "$PRODUCTION_ERRORS" ]; then
    log "Errors detected post-rollout. Manual intervention may be required."
    notify_slack "⚠️ Errors detected in **$REGION** post-rollout. Please investigate."
fi

log "Phase 5 complete."
notify_slack "🎉 Production deployment to **$REGION** complete."

exit 0
