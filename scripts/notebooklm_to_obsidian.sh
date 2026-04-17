#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 \"Note Title\" \"Content File\" [project] [area]" >&2
  exit 1
fi

TITLE="$1"
CONTENT_FILE="$2"
PROJECT="${3:-}"
AREA="${4:-Knowledge System}"
VAULT_BASE="/Users/harvey/.openclaw/workspace/obsidian-openclaw-vault"
TARGET_DIR="$VAULT_BASE/12 Operations/12.04 Resources"
DATE="$(date +%F)"
SAFE_TITLE="$(printf '%s' "$TITLE" | sed 's#[/:]#-#g')"
TARGET_FILE="$TARGET_DIR/${SAFE_TITLE}.md"

mkdir -p "$TARGET_DIR"

{
  echo '---'
  echo 'type: research'
  echo 'status: active'
  echo "created: $DATE"
  echo "updated: $DATE"
  echo 'tags: [notebooklm, export]'
  echo "area: $AREA"
  echo "project: $PROJECT"
  echo 'source: notebooklm'
  echo '---'
  echo
  echo "# $TITLE"
  echo
  echo '## NotebookLM Export'
  echo
  cat "$CONTENT_FILE"
} > "$TARGET_FILE"

echo "$TARGET_FILE"
