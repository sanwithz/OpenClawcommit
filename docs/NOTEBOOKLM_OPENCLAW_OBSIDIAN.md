# NotebookLM + OpenClaw + Obsidian Workflow

## Purpose
Use NotebookLM as a source-grounded analysis layer, OpenClaw as the operator, and Obsidian as the long-term knowledge base.

## Architecture
- **NotebookLM** = source ingestion + source-grounded Q&A + generated learning artifacts
- **OpenClaw** = orchestration + CLI control + write-back into notes/workflows
- **Obsidian** = durable RAG memory, projects, areas, resources, reviews

## Recommended flow
1. Create or choose a NotebookLM notebook
2. Add a small set of sources
3. Ask focused questions or generate a summary
4. Save the useful output into Obsidian under:
   - `12 Operations/12.02 Projects/`
   - `12 Operations/12.04 Resources/`
   - `04 Knowledge Workflows/`
5. Link the resulting Obsidian notes into the vault’s dashboards/MOCs

## Why this split works
- NotebookLM is excellent for source-grounded exploration
- Obsidian is better for long-term structured knowledge
- OpenClaw bridges the two and keeps the workflow repeatable

## Suggested NotebookLM use cases
- YouTube/video transcript analysis
- paper/article comparison
- report/study guide generation
- question answering over a bounded set of sources

## Suggested Obsidian write-back types
- research note
- literature note
- evergreen note
- project update
- weekly review support note

## Local shortcut
Use:
```bash
scripts/nlmpy
```
Instead of typing the full venv path.
