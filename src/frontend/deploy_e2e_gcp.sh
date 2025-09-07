#!/bin/bash
# Master script to deploy the E2E environment on GCP

set -e

# Set your GCP Project ID and Region
export GCP_PROJECT_ID="your-gcp-project-id"
export GCP_REGION="us-central1"

# 1. Provision Infrastructure with Terraform
echo "Provisioning infrastructure with Terraform..."
cd terraform
terraform init
terraform apply -auto-approve
cd ..

# 2. Configure Cloud Build Trigger
echo "Configuring Cloud Build trigger..."
gcloud beta builds triggers create github \
  --name="e2e-deployment-trigger" \
  --repo-name="your-github-repo" \
  --repo-owner="your-github-owner" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild-beta.yaml" \
  --substitutions="_GCP_REGION=$GCP_REGION"

# 3. Run Health Check
echo "Running health check..."
./verify_health.sh

# 4. Run Load Test
echo "Running load test..."
node load-test.js

echo "E2E environment deployment completed successfully!"
