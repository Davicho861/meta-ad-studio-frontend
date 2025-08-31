#!/bin/bash

# Set a trap to exit on error
set -e

echo "Starting verification process with monitoring..."
start_time=$(date +%s)

# Function to log progress
log_progress() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 1. Check PostgreSQL status
log_progress "Starting PostgreSQL status check..."
echo "L@urencita3107" | sudo -S systemctl status postgresql > postgres_status.log 2>&1 &
PID1=$!

# 2. List PM2 processes
log_progress "Starting PM2 list command..."
pm2 list > pm2_list.log 2>&1 &
PID2=$!

# 3. Get latest PM2 logs
log_progress "Starting PM2 logs command..."
pm2 logs --lines 1000 --nostream > pm2_logs.log 2>&1 &
PID3=$!

# 4. Run npm tests with coverage
log_progress "Starting npm tests..."
npm test -- --coverage > npm_test.log 2>&1 &
PID4=$!

# 5. Run Cypress tests
log_progress "Starting Cypress tests..."
npx cypress run > cypress_run.log 2>&1 &
PID5=$!

# 6. Curl frontend
log_progress "Starting curl check for frontend..."
curl -o curl_frontend.log -s -w "%{http_code}\n" http://localhost:5175 &
PID6=$!

# 7. Curl backend health check
log_progress "Starting curl check for backend..."
curl -o curl_backend.log -s -w "%{http_code}\n" http://localhost:3001/api/health &
PID7=$!

# Wait for all background jobs to complete
log_progress "Waiting for all verification commands to finish..."
wait $PID1 && log_progress "PostgreSQL status check finished."
wait $PID2 && log_progress "PM2 list command finished."
wait $PID3 && log_progress "PM2 logs command finished."
wait $PID4 && log_progress "npm tests finished."
wait $PID5 && log_progress "Cypress tests finished."
wait $PID6 && log_progress "Frontend curl check finished."
wait $PID7 && log_progress "Backend curl check finished."

wait

end_time=$(date +%s)
runtime=$((end_time-start_time))
log_progress "All verification commands completed in ${runtime} seconds."
