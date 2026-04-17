# NotebookLM Export Workflow

## Purpose
Capture useful NotebookLM outputs into the Obsidian vault as durable notes.

## Steps
1. Create/select a NotebookLM notebook
2. Add sources
3. Run `ask` or `summary`
4. Save the output through the local export helper
5. Place exported note in Resources
6. Link it to a Project or Area note if relevant

## Local helper
```bash
scripts/notebooklm_to_obsidian.sh "Title" /path/to/output.txt [project] [area]
```

## Rule
Do not leave important synthesized knowledge only inside NotebookLM.
Export the durable parts into Obsidian.
