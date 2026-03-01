#!/usr/bin/env bash
set -euo pipefail
VAULT="/Users/sanwithz/Documents/Obsidian Vault"
NOTE="$VAULT/Orange Second Brain/Daily/$(date +%F).md"
mkdir -p "$(dirname "$NOTE")"
if [ ! -f "$NOTE" ]; then
  cat > "$NOTE" <<EOF
# Daily Note - $(date +%F)

## Top 3 Priorities
1. 
2. 
3. 

## What I got done
- 

## What I didn’t do
- 

## Why not
- 

## Carry over
- 
EOF
fi

echo "- $*" >> "$NOTE"
echo "Appended to $NOTE"