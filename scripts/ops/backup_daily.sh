#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="$HOME/.openclaw/workspace"
BACKUP_DIR="$WORKSPACE/backups/daily"
LOG_DIR="$WORKSPACE/logs/ops"
mkdir -p "$BACKUP_DIR" "$LOG_DIR"
LOG_FILE="$LOG_DIR/backup_daily.log"

now() { date '+%Y-%m-%d %H:%M:%S'; }
ts() { date '+%Y-%m-%d_%H%M%S'; }

FILE="$BACKUP_DIR/workspace_$(ts).tgz"

echo "[$(now)] backup: start" >> "$LOG_FILE"
tar --exclude='workspace/backups' --exclude='workspace/logs' -czf "$FILE" -C "$HOME/.openclaw" workspace >> "$LOG_FILE" 2>&1
echo "[$(now)] local backup complete: $FILE" >> "$LOG_FILE"

# Keep last 14 local backups
ls -1t "$BACKUP_DIR"/*.tgz 2>/dev/null | tail -n +15 | xargs -I{} rm -f "{}" || true

# Upload to Google Drive via rclone remote 'gdrive'
if command -v rclone >/dev/null 2>&1; then
  if rclone listremotes | grep -q '^gdrive:$'; then
    rclone copy "$FILE" "gdrive:openclaw-backups/" --drive-chunk-size 64M --transfers 1 >> "$LOG_FILE" 2>&1 || true
    echo "[$(now)] upload to gdrive attempted" >> "$LOG_FILE"
  else
    echo "[$(now)] skip upload: remote 'gdrive' not configured" >> "$LOG_FILE"
  fi
else
  echo "[$(now)] skip upload: rclone not installed" >> "$LOG_FILE"
fi
