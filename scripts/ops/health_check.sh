#!/bin/bash

# Simple health check script for a web service
SERVICE_URL="http://localhost:3000/health"

echo "Running health check for $SERVICE_URL..."

response=$(curl -s -o /dev/null -w "%{http_code}" $SERVICE_URL)

if [ "$response" -eq 200 ]; then
  echo "Health check PASSED. Service is up and running."
  exit 0
else
  echo "Health check FAILED. Service returned HTTP $response."
  exit 1
fi