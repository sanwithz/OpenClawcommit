# Automated Inbox Processing

## Goal
Let OpenClaw help process inbox notes without losing control.

## Safe Pattern
1. Retrieve inbox notes
2. Process one note at a time
3. Propose destination and note type
4. Apply minimal changes
5. Link to canonical notes
6. Move the note only after it is clearly processed

## Recommended Commands
- `/search-vault-context`
- `/process-note`
- `/create-evergreen`

## Guardrail
Automation should assist classification and cleanup, not silently rewrite meaning.
