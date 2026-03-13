#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="$HOME/.openclaw/workspace/logs/ops"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/setup_rclone_gdrive.log"

now() { date '+%Y-%m-%d %H:%M:%S'; }

echo "[$(now)] setup rclone start" >> "$LOG_FILE"

if ! command -v rclone >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    brew install rclone >> "$LOG_FILE" 2>&1
  else
    echo "brew not found; install rclone manually" >> "$LOG_FILE"
    exit 1
  fi
fi

if rclone listremotes | grep -q '^gdrive:$'; then
  echo "[$(now)] remote gdrive already configured" >> "$LOG_FILE"
  exit 0
fi

echo "[$(now)] run interactive config: rclone config" >> "$LOG_FILE"
echo "Please run: rclone config" 
echo "- New remote name: gdrive"
echo "- Storage: drive"
echo "- Complete OAuth in browser"
