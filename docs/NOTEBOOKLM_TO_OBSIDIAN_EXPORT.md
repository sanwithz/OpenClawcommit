# NotebookLM → Obsidian Auto-Export Workflow

## Goal
Turn NotebookLM outputs into durable Obsidian notes.

## Local helper
```bash
scripts/notebooklm_to_obsidian.sh "Note Title" /path/to/content.txt [project] [area]
```

## Recommended workflow
1. Run NotebookLM summary or ask command
2. Save output to a temporary text file
3. Export it into Obsidian Resources using the helper script
4. Link the new note into the relevant Project or Area note if needed

## Result
Exports create markdown notes under:
```text
obsidian-openclaw-vault/12 Operations/12.04 Resources/
```

## Metadata applied
- `type: research`
- `source: notebooklm`
- tags include `notebooklm` and `export`

## Why this matters
NotebookLM is strong for source-grounded analysis, but Obsidian should remain the durable knowledge base.
