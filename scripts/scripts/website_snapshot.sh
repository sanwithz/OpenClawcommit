#!/usr/bin/env bash
set -euo pipefail

# One-command website snapshot
# Usage:
#   scripts/website_snapshot.sh "https://example.com"
#   scripts/website_snapshot.sh "https://example.com" --send-telegram 6796212791

URL="${1:-}"
MODE="${2:-}"
TARGET="${3:-}"

if [[ -z "$URL" ]]; then
  echo "Usage: $0 <url> [--send-telegram <chat_id>]"
  exit 1
fi

echo "[1/3] Open URL: $URL"
openclaw browser start >/dev/null
openclaw browser open "$URL" >/dev/null

# small wait for render
sleep 2

echo "[2/3] Capture screenshot"
SHOT_OUT="$(openclaw browser screenshot --full-page)"
# extract path from output like MEDIA:/path/to/file.jpg
SHOT_PATH="${SHOT_OUT#MEDIA:}"

echo "Saved: $SHOT_PATH"

if [[ "$MODE" == "--send-telegram" ]]; then
  if [[ -z "$TARGET" ]]; then
    echo "Missing chat_id for --send-telegram"
    exit 1
  fi
  echo "[3/3] Send to Telegram chat: $TARGET"
  openclaw message send --channel telegram --target "$TARGET" --media "$SHOT_PATH" --caption "Website snapshot: $URL" >/dev/null
  echo "Sent ✅"
else
  echo "[3/3] Skip Telegram send (pass --send-telegram <chat_id> to auto-send)"
fi
