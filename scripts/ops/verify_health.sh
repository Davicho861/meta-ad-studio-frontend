#!/bin/bash
# verify_health.sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Define the URLs to check
BACKEND_URL="http://localhost:3001/api/health"
FRONTEND_URL="http://localhost:8081/"
GRAFANA_URL="http://localhost:3000/"

# Function to check a URL with retries
check_url() {
  URL=$1
  EXPECTED_CODE=$2
  SERVICE_NAME=$3
  RETRIES=5
  DELAY=5

  echo "Verifying health of $SERVICE_NAME at $URL..."
  for i in $(seq 1 $RETRIES); do
    STATUS_CODE=$(curl -o /dev/null -s -w "%{http_code}" $URL)
    if [ "$STATUS_CODE" -eq "$EXPECTED_CODE" ]; then
      echo "Health check passed for $SERVICE_NAME. Received status code $STATUS_CODE"
      return 0
    fi
    echo "Attempt $i/$RETRIES failed for $SERVICE_NAME. Received status code $STATUS_CODE. Retrying in $DELAY seconds..."
    sleep $DELAY
  done

  echo "Error: Health check failed for $SERVICE_NAME after $RETRIES attempts."
  exit 1
}

# Perform the health checks
check_url $BACKEND_URL 200 "Backend"
check_url $FRONTEND_URL 200 "Frontend"
check_url $GRAFANA_URL 302 "Grafana"

echo "All health checks passed successfully."
exit 0
