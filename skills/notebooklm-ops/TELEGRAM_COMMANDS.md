# Telegram `/nlmpy` Command Behavior

## Goal
Make `/nlmpy` behave like a compact Telegram command surface for NotebookLM operations.

## Command Patterns
### 1. `/nlmpy`
Reply with a short help menu:
- `list` → list notebooks
- `status` → current notebook
- `use <id>` → select notebook
- `create <title>` → create notebook
- `add <url-or-path>` → add source
- `ask <question>` → ask current notebook
- `summary` → summarize current notebook
- `export <title>` → save NotebookLM summary into Obsidian

### 2. `/nlmpy list`
Run:
```bash
scripts/nlmpy list
```
Return a concise notebook list.

### 3. `/nlmpy status`
Run:
```bash
scripts/nlmpy status --json
```
Return the active notebook title/id.

### 4. `/nlmpy use <id>`
Run:
```bash
scripts/nlmpy use <id>
```
Reply with the selected notebook.

### 5. `/nlmpy create <title>`
Run:
```bash
scripts/nlmpy create "<title>"
```
Reply with the created notebook.

### 6. `/nlmpy add <url-or-path>`
Run:
```bash
scripts/nlmpy source add "<value>"
```
Reply with source-added confirmation.

### 7. `/nlmpy ask <question>`
Run:
```bash
scripts/nlmpy ask "<question>"
```
Reply with a concise answer.

### 8. `/nlmpy summary`
Run:
```bash
scripts/nlmpy summary
```
Reply with summary.

### 9. `/nlmpy export <title>`
Workflow:
1. get current notebook summary or ask output
2. save it into Obsidian via local export helper
3. reply with created note path

## Behavior Rules
- Keep Telegram replies concise.
- Prefer current notebook context unless user specifies otherwise.
- If auth fails, tell the user NotebookLM login expired.
- If no active notebook is set, ask the user to run `/nlmpy list` or `/nlmpy use <id>`.
