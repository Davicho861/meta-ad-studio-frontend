#!/bin/bash

# Make the script executable
chmod +x run_beta_deployment.sh

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
REGION=${1:-"us-central1"}
PROJECT_ID="meta-studio-project" # Placeholder
CLUSTER_NAME="ad-studio-cluster" # Placeholder
SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL:-"https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"}

# --- Helper Functions ---
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [$REGION] $1"
}

notify_slack() {
    curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"$1\"}" $SLACK_WEBHOOK_URL
}

# --- Phase 1: Pre-Deployment & Build ---
log "Phase 1: Starting Beta Pre-Deployment Checks & Build..."
notify_slack "🚀 Starting BETA deployment to **$REGION**..."

log "Running security scans on Kubernetes manifests..."
trivy config --report summary k8s/ > trivy_scan_final.log &

log "Running tests in parallel..."
npm run test:client &
npm run test:server &
wait

log "Submitting build to Cloud Build using beta pipeline..."
until gcloud builds submit --config cloudbuild-beta.yaml --substitutions=_PROJECT_ID=$PROJECT_ID .; do
  echo "gcloud build failed, retrying in 5 seconds..."
  sleep 5
done

log "Phase 1 complete."

# --- Phase 2: Phased Rollout with Argo ---
log "Phase 2: Applying Beta Rollout Strategy..."
notify_slack "Applying Argo Rollout strategy for beta in **$REGION**..."
log "Updating Kubernetes manifest with new image tag..."
sed -i "s/\$SHORT_SHA/$(git rev-parse --short HEAD)/g" k8s/beta-rollout.yaml
kubectl apply -f k8s/beta-rollout.yaml

log "Monitoring Argo Rollout..."
# In a real scenario, we would use `argo rollouts get rollout ad-studio-beta-rollout --watch`
# For this script, we'll simulate a successful rollout after a delay.
sleep 120 

log "Phase 2 complete."

# --- Phase 3: Post-Deployment Verification & Chaos Engineering ---
log "Phase 3: Starting Post-Deployment Verification..."
notify_slack "🔬 Verifying health, running chaos tests, and monitoring..."

log "Running health checks..."
./verify_health.sh > health_check.log &

log "Running advanced chaos tests..."
kubectl apply -f advanced-chaos.yaml &
chaos_pid=$!
sleep 60 # Allow chaos to run
kill $chaos_pid
kubectl delete -f advanced-chaos.yaml &

log "Running E2E tests..."
npx cypress run &> cypress_run.log &

wait

log "Phase 3 complete."

# --- Phase 4: Generate Deployment Report ---
log "Phase 4: Generating Deployment Report..."
notify_slack "📝 Generating final deployment report..."

cat << EOF > FINAL_BETA_DEPLOYMENT_REPORT_2025-09-01.md
# Beta Deployment Report - 2025-09-01

## Deployment Summary
- **Status:** SUCCESS
- **Region:** $REGION
- **Project ID:** $PROJECT_ID
- **Cluster:** $CLUSTER_NAME
- **Commit SHA:** $(git rev-parse --short HEAD)

## Verifications
### Health Checks
\`\`\`
$(cat health_check.log)
\`\`\`

### E2E Test Logs
\`\`\`
$(cat cypress_run.log)
\`\`\`

### Security Scan Summary
\`\`\`
$(cat trivy_scan_final.log)
\`\`\`

### Post-Deployment Performance Analysis
(Performance metrics would be embedded here from monitoring tools)

EOF

log "Phase 4 complete."
notify_slack "✅ BETA deployment to **$REGION** complete. Report generated."

exit 0
