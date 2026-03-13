#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="$HOME/.openclaw/workspace/logs/ops"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/autofix_gateway.log"

now() { date '+%Y-%m-%d %H:%M:%S'; }

echo "[$(now)] autofix: start" >> "$LOG_FILE"

# 1) basic process hygiene (non-destructive)
pkill -f "openclaw.*gateway" >/dev/null 2>&1 || true
sleep 1

# 2) restart daemon
openclaw gateway restart >> "$LOG_FILE" 2>&1 || true
sleep 3

# 3) verify
status_out="$(openclaw gateway status 2>&1 || true)"
if echo "$status_out" | grep -Eiq 'running|active'; then
  echo "[$(now)] autofix success" >> "$LOG_FILE"
  exit 0
fi

echo "[$(now)] autofix failed" >> "$LOG_FILE"
exit 1
