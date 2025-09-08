#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "Stopping mock if running..."
if [ -f mock.pid ]; then
  PID=$(cat mock.pid 2>/dev/null || true)
  if [ -n "$PID" ] && ps -p "$PID" > /dev/null 2>&1; then
    echo "Killing pid from mock.pid: $PID"
    kill "$PID" || true
    sleep 0.2
  fi
  rm -f mock.pid
fi

# Kill any stray mock-server processes (safe pattern)
for p in $(pgrep -f "mock-server(\.js|-3101\.js)" || true); do
  if [ -n "$p" ]; then
    echo "Killing stray process: $p"
    kill "$p" || true
  fi
done

echo "Removing old logs"
rm -f mock.log || true
echo "stopped"
