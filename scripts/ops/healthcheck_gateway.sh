#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="$HOME/.openclaw/workspace/logs/ops"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/healthcheck_gateway.log"

now() { date '+%Y-%m-%d %H:%M:%S'; }

echo "[$(now)] healthcheck: start" >> "$LOG_FILE"

status_out="$(openclaw gateway status 2>&1 || true)"
if echo "$status_out" | grep -Eiq 'running|active'; then
  echo "[$(now)] gateway is healthy" >> "$LOG_FILE"
  exit 0
fi

echo "[$(now)] gateway unhealthy, attempting start" >> "$LOG_FILE"
openclaw gateway start >> "$LOG_FILE" 2>&1 || true
sleep 3

status_out2="$(openclaw gateway status 2>&1 || true)"
if echo "$status_out2" | grep -Eiq 'running|active'; then
  echo "[$(now)] recovery success" >> "$LOG_FILE"
  exit 0
fi

echo "[$(now)] recovery failed" >> "$LOG_FILE"
exit 1
