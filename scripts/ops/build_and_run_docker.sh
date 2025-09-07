#!/bin/bash
# build_and_run_docker.sh
set -e

echo "Building Docker image..."
docker build . -t meta-studio-ad-app 2>&1 | tee docker_build.log

echo "Running Docker containers..."
docker-compose -f docker-compose.yml -f docker-compose.observability.yml up -d

echo "Verifying container health..."
./verify_health.sh >> docker_run.log

echo "Cleaning up unused Docker resources..."
./clean_docker.sh
