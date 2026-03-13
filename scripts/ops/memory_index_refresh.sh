#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="$HOME/.openclaw/workspace"
MEM_DIR="$WORKSPACE/memory"
OUT_FILE="$WORKSPACE/memory/INDEX.md"
LOG_DIR="$WORKSPACE/logs/ops"
mkdir -p "$LOG_DIR" "$MEM_DIR"
LOG_FILE="$LOG_DIR/memory_index_refresh.log"

now() { date '+%Y-%m-%d %H:%M:%S'; }

echo "[$(now)] memory-index: start" >> "$LOG_FILE"

{
  echo "# Memory Index"
  echo
  echo "Generated: $(date '+%Y-%m-%d %H:%M:%S %Z')"
  echo
  echo "## Daily Files"
  for f in $(ls -1 "$MEM_DIR"/*.md 2>/dev/null | grep -v '/INDEX.md' | sort); do
    base=$(basename "$f")
    lines=$(wc -l < "$f" | tr -d ' ')
    bytes=$(wc -c < "$f" | tr -d ' ')
    echo "- $base — ${lines} lines, ${bytes} bytes"
  done
  echo
  echo "## Long-term"
  if [[ -f "$WORKSPACE/MEMORY.md" ]]; then
    l=$(wc -l < "$WORKSPACE/MEMORY.md" | tr -d ' ')
    b=$(wc -c < "$WORKSPACE/MEMORY.md" | tr -d ' ')
    echo "- MEMORY.md — ${l} lines, ${b} bytes"
  else
    echo "- MEMORY.md not found"
  fi
} > "$OUT_FILE"

echo "[$(now)] memory-index: refreshed $OUT_FILE" >> "$LOG_FILE"
