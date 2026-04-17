---
name: notebooklm-ops
description: Operate NotebookLM from the local notebooklm-py CLI for create/list/use/source/chat/download workflows and Obsidian-connected research capture.
---

# NotebookLM Ops

Use this skill when the user wants to work with **NotebookLM** via the local `notebooklm-py` integration.

## Local setup
- Wrapper command: `/Users/harvey/.openclaw/workspace/scripts/nlmpy`
- Underlying CLI: `/Users/harvey/.openclaw/workspace/.venvs/notebooklm-py/bin/notebooklm`
- Repo: `/Users/harvey/.openclaw/workspace/external/notebooklm-py`

## Safe workflow
1. Check auth first:
   ```bash
   scripts/nlmpy auth check --test
   ```
2. List notebooks or create a new one.
3. Set active notebook with `use <id>` when needed.
4. Add sources conservatively; prefer one or a few sources at a time.
5. Ask questions only after sources are processed.
6. For long-running generation, prefer async or inform the user.

## Obsidian-connected workflow
Use NotebookLM for:
- summarizing a source set
- asking questions over imported material
- generating study/research outputs

Use Obsidian for:
- long-term storage
- structured project knowledge
- evergreen notes
- review and synthesis

Recommended pattern:
1. Source material enters NotebookLM.
2. Ask/summarize in NotebookLM.
3. Save the resulting synthesis into Obsidian as project/resource/research notes.
4. Keep canonical knowledge in Obsidian, not only in NotebookLM.

## Common commands
```bash
scripts/nlmpy list
scripts/nlmpy create "Title"
scripts/nlmpy use <notebook_id>
scripts/nlmpy source add "https://example.com"
scripts/nlmpy ask "What are the key themes?"
scripts/nlmpy summary
scripts/nlmpy status --json
```

## Daily-use command ideas
- Create temporary research notebook
- Add one URL/PDF
- Ask for concise summary
- Copy result into Obsidian resource or research note

## Guardrails
- NotebookLM auth expires; re-run login if token fetch fails.
- Prefer minimal source batches to reduce errors/rate limits.
- Keep the durable knowledge layer in Obsidian.
