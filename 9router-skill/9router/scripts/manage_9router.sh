#!/usr/bin/env bash
set -euo pipefail

# 9Router Life Cycle Manager
# Usage:
#   scripts/manage_9router.sh <start|stop|status|health>

COMMAND="${1:-status}"
PORT=20128
URL="http://127.0.0.1:$PORT"

case "$COMMAND" in
  start)
    if curl -s "$URL/health" >/dev/null; then
      echo "9Router is already running at $URL"
    else
      echo "Starting 9Router in tray mode..."
      9router --tray --no-browser &
      echo "Started 9Router (background)"
    fi
    ;;
  stop)
    echo "Stopping 9Router..."
    pkill -f "9router" || echo "9Router was not running"
    echo "Stopped"
    ;;
  status)
    if curl -s "$URL/health" >/dev/null; then
      echo "9Router is RUNNING at $URL"
    else
      echo "9Router is STOPPED"
    fi
    ;;
  health)
    curl -s "$URL/health" || { echo "{"ok":false,"error":"not_running"}"; exit 1; }
    ;;
  *)
    echo "Usage: $0 <start|stop|status|health>"
    exit 1
    ;;
esac
