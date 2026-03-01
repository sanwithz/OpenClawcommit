#!/usr/bin/env bash
set -euo pipefail

# One-command URL -> Markdown note in Obsidian Second Brain
# Usage:
#   scripts/url2obsidian.sh "https://example.com"
#   scripts/url2obsidian.sh "https://example.com" "Custom Note Title"

URL="${1:-}"
TITLE="${2:-}"
BIN_HTML2MD="$HOME/go/bin/html2markdown"

if [[ -z "$URL" ]]; then
  echo "Usage: $0 <url> [note-title]" >&2
  exit 1
fi

if [[ ! -x "$BIN_HTML2MD" ]]; then
  echo "html2markdown not found at $BIN_HTML2MD" >&2
  echo "Install with: go install github.com/JohannesKaufmann/html-to-markdown/v2/cli/html2markdown@latest" >&2
  exit 1
fi

VAULT_PATH="$(obsidian-cli print-default --path-only 2>/dev/null || true)"
if [[ -z "$VAULT_PATH" || ! -d "$VAULT_PATH" ]]; then
  echo "Cannot resolve default Obsidian vault. Set one with: obsidian-cli set-default \"<vault-name>\"" >&2
  exit 1
fi

DEST_DIR="$VAULT_PATH/Orange Second Brain/Web Clips"
mkdir -p "$DEST_DIR"

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9ก-๙]+/-/g; s/^-+|-+$//g; s/-+/-/g'
}

if [[ -z "$TITLE" ]]; then
  # derive title from URL tail
  base="${URL#*://}"
  base="${base%%\?*}"
  base="${base%%#*}"
  TITLE="$base"
fi

DATE_TAG="$(date +%F)"
NOTE_NAME="${DATE_TAG}-$(slugify "$TITLE")"
OUT="$DEST_DIR/$NOTE_NAME.md"

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

curl -L --silent --show-error "$URL" | "$BIN_HTML2MD" > "$TMP"

{
  echo "# ${TITLE}"
  echo
  echo "- Source: $URL"
  echo "- Captured: $(date '+%Y-%m-%d %H:%M:%S %Z')"
  echo
  cat "$TMP"
} > "$OUT"

echo "Saved -> $OUT"
