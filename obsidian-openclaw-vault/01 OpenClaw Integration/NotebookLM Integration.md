# NotebookLM Integration

## Purpose
Define how NotebookLM fits into the Obsidian + OpenClaw system.

## Roles
- **NotebookLM**: source-grounded analysis workspace
- **OpenClaw**: operator and bridge
- **Obsidian**: durable knowledge base and daily operating system

## Practical Workflow
1. Create/select a NotebookLM notebook
2. Add one or more sources
3. Ask focused questions or generate a summary
4. Save the useful results into Obsidian as a:
   - research note
   - literature note
   - evergreen note
   - project update
5. Link the new note into the relevant Project or Area note

## Shortcut
Use local wrapper:
```bash
scripts/nlmpy
```

## Export helper
Use:
```bash
scripts/notebooklm_to_obsidian.sh
```

## Related Notes
- [[../04 Knowledge Workflows/NotebookLM Export Workflow|NotebookLM Export Workflow]]
- [[../03 Prompt Library/NotebookLM Prompts|NotebookLM Prompts]]

## Rule
NotebookLM is for exploring source material.
Obsidian is for keeping the canonical long-term knowledge.
