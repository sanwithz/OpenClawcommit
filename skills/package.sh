#!/bin/bash
# Package skills into .skill files (zip with .skill extension)

SKILL_DIR="${HOME}/.openclaw/workspace/skills"
OUTPUT_DIR="${SKILL_DIR}/dist"

mkdir -p "$OUTPUT_DIR"

for skill in trading-analysis gold-price gas-webapp-builder; do
  if [ -d "$SKILL_DIR/$skill" ]; then
    echo "📦 Packaging $skill..."
    cd "$SKILL_DIR"
    zip -r "$OUTPUT_DIR/$skill.skill" "$skill" -x "*.DS_Store" -x "__MACOSX/*"
    echo "✅ $OUTPUT_DIR/$skill.skill"
  fi
done

echo ""
echo "All skills packaged:"
ls -lh "$OUTPUT_DIR/"
