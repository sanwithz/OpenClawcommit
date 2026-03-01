#!/usr/bin/env bash
set -euo pipefail

# Fast URL -> Markdown using html2markdown
# Usage:
#   scripts/url2md.sh "https://example.com" > page.md
#   scripts/url2md.sh "https://example.com" output.md

URL="${1:-}"
OUT="${2:-}"
BIN="$HOME/go/bin/html2markdown"

if [[ -z "$URL" ]]; then
  echo "Usage: $0 <url> [output.md]" >&2
  exit 1
fi

if [[ ! -x "$BIN" ]]; then
  echo "html2markdown not found at $BIN. Install with:" >&2
  echo "go install github.com/JohannesKaufmann/html-to-markdown/v2/cli/html2markdown@latest" >&2
  exit 1
fi

if [[ -n "$OUT" ]]; then
  curl -L --silent --show-error "$URL" | "$BIN" > "$OUT"
  echo "Saved markdown -> $OUT"
else
  curl -L --silent --show-error "$URL" | "$BIN"
fi
