#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="$HOME/.openclaw/workspace"
BACKUP_ROOT="$WORKSPACE/backups/openclaw-updates"
LOG_DIR="$WORKSPACE/logs/ops"
mkdir -p "$BACKUP_ROOT" "$LOG_DIR"
LOG_FILE="$LOG_DIR/safe_update_openclaw.log"

now() { date '+%Y-%m-%d %H:%M:%S'; }
ts() { date '+%Y-%m-%d_%H%M%S'; }

echo "[$(now)] safe-update: start" >> "$LOG_FILE"

SNAP="$BACKUP_ROOT/backup_$(ts)"
mkdir -p "$SNAP"

# Mandatory backup before update
tar -czf "$SNAP/workspace.tgz" -C "$HOME/.openclaw" workspace >> "$LOG_FILE" 2>&1 || true
[ -d "$HOME/.openclaw/config" ] && tar -czf "$SNAP/config.tgz" -C "$HOME/.openclaw" config >> "$LOG_FILE" 2>&1 || true

openclaw update status >> "$LOG_FILE" 2>&1 || true

if [[ "${1:-}" == "--apply" ]]; then
  echo "[$(now)] applying update" >> "$LOG_FILE"
  openclaw update >> "$LOG_FILE" 2>&1
  openclaw gateway restart >> "$LOG_FILE" 2>&1 || true
  echo "[$(now)] safe-update: complete" >> "$LOG_FILE"
else
  echo "[$(now)] dry-run complete. Use --apply to update." >> "$LOG_FILE"
fi
