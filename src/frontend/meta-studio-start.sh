#!/bin/bash

# Script to check Docker and start the Meta Studio application

LOG_FILE="/tmp/meta-studio-start.log"
PROJECT_DIR="/home/davicho/Documentos/Meta Studio Ad Studio App SPA"
APP_URL="http://localhost:3000"

# Redirect all output to a log file
exec >> "$LOG_FILE" 2>&1

echo "--- $(date): Starting Meta Studio ---"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    # Use notify-send to show a desktop notification if available
    if command -v notify-send > /dev/null; then
        notify-send "Meta Studio Error" "Docker is not running. Please start it first." -i error
    fi
    exit 1
fi

echo "Docker is running. Navigating to project directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || {
    echo "Error: Could not change to directory $PROJECT_DIR."
    if command -v notify-send > /dev/null; then
        notify-send "Meta Studio Error" "Project directory not found." -i error
    fi
    exit 1
}

echo "Starting Docker Compose services in detached mode..."
docker-compose up -d

# Check if the services started correctly
if [ $? -eq 0 ]; then
    echo "Docker Compose services started successfully."
    echo "Opening application at $APP_URL"
    # Wait a few seconds for the services to be fully up
    sleep 5
    xdg-open "$APP_URL"
else
    echo "Error: Failed to start Docker Compose services."
    if command -v notify-send > /dev/null; then
        notify-send "Meta Studio Error" "Failed to start Docker Compose services. Check logs for details." -i error
    fi
    exit 1
fi

echo "--- $(date): Script finished ---"
