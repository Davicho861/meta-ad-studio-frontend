#!/bin/bash

# ==============================================================================
# Agile Deployment Orchestrator for Meta Studio Ad Studio App SPA
# ==============================================================================
#
# Usage: ./agile-deploy.sh [FLAG]
#
# Flags:
#   --quick-start     Installs dependencies and starts all dev servers. (Default)
#   --hot-reload      Alias for --quick-start, emphasizes HMR.
#   --data-refresh    Fetches fresh data for all dashboards.
#   --light-mode      (Placeholder) For production-like builds.
#   --build-only      Builds all projects for production.
#
# ==============================================================================

# --- Configuration ---
set -e # Exit immediately if a command exits with a non-zero status.
BASE_DIR=$(pwd)
PROJECTS=(
    "."
    "meta-studio-flow-main"
    "meta-verse-visualizer-main"
    "Meta Ad Studio-sdlc-nexus-main"
    "server"
)
# Assign ports for each dev server to avoid conflicts
declare -A PORTS
PORTS["."]="5173"
PORTS["meta-studio-flow-main"]="5174"
PORTS["meta-verse-visualizer-main"]="5175"
PORTS["Meta Ad Studio-sdlc-nexus-main"]="5176"
PORTS["server"]="3000"


# --- Helper Functions ---
log() {
    echo "🚀 [AgileDeploy] $1"
}

install_dependencies() {
    log "Installing dependencies for all projects..."
    for project in "${PROJECTS[@]}"; do
        if [ -f "$BASE_DIR/$project/package.json" ]; then
            log "Installing in '$project'..."
            (cd "$BASE_DIR/$project" && bun install)
        fi
    done
    log "All dependencies installed."
}

start_dev_servers() {
    log "Starting all dev servers with Hot-Reload..."
    for project in "${PROJECTS[@]}"; do
        if [ -f "$BASE_DIR/$project/package.json" ]; then
            local port=${PORTS[$project]}
            log "Starting '$project' on port $port..."
            # Start each server in the background
            (cd "$BASE_DIR/$project" && bun --bun run dev -- --port $port &)
        fi
    done
    log "All dev servers are starting up."
    log "Access URLs:"
    for project in "${PROJECTS[@]}"; do
        if [ -f "$BASE_DIR/$project/package.json" ]; then
             echo "  - $project: http://localhost:${PORTS[$project]}"
        fi
    done
    wait # Wait for all background processes to finish (e.g., on Ctrl+C)
}

refresh_data() {
    log "Refreshing data..."
    # Make the data fetching script executable
    chmod +x "$BASE_DIR/agile_deployment/fetch_insights_data.js"
    # Execute and save output
    "$BASE_DIR/agile_deployment/fetch_insights_data.js" > "$BASE_DIR/agile_deployment/mocks/insights.json"
    log "Insights data saved to agile_deployment/mocks/insights.json"
    # Add other data fetching scripts here
}


# --- Main Execution Logic ---
main() {
    FLAG=${1:---quick-start} # Default to --quick-start

    case $FLAG in
        --quick-start|--hot-reload)
            log "Mode: Quick Start / Hot Reload"
            install_dependencies
            start_dev_servers
            ;;
        --data-refresh)
            log "Mode: Data Refresh"
            refresh_data
            ;;
        *)
            log "Error: Invalid flag '$FLAG'."
            echo "Usage: $0 [--quick-start|--hot-reload|--data-refresh]"
            exit 1
            ;;
    esac
}

main "$@"
