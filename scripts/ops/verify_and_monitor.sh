#!/bin/bash
# verify_and_monitor.sh
set -e

echo "Running health checks..."
./verify_health.sh >> monitoring_deployment.log
curl http://localhost:3001/api/health >> monitoring_deployment.log

echo "Verifying PostgreSQL status..."
psql -U user -d dashboard -c "SELECT 1" >> monitoring_deployment.log

echo "Setting up monitoring..."
# The monitoring is handled by the docker-compose.observability.yml file.
# This script will log the container statuses.
docker-compose -f docker-compose.yml -f docker-compose.observability.yml ps >> monitoring_deployment.log
