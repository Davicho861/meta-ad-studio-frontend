#!/usr/bin/env bash
# Usage: wait-for-port.sh PORT TIMEOUT_SECONDS
PORT=${1:-5173}
TIMEOUT=${2:-30}
START=$(date +%s)
while :; do
  if nc -z localhost $PORT 2>/dev/null; then
    echo "Port $PORT is open"
    exit 0
  fi
  NOW=$(date +%s)
  ELAPSED=$((NOW-START))
  if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
    echo "Timeout waiting for port $PORT after ${TIMEOUT}s" >&2
    exit 1
  fi
  sleep 1
done
