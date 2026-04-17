# Inbox Processing Workflow

## Purpose
Convert raw captures into trusted, useful notes.

## Trigger
Run during daily cleanup or when inbox count grows.

## Steps
1. Open `08 Visualization/Inbox Dashboard.md`
2. Read one inbox note at a time
3. Decide the destination:
   - keep as inbox temporarily
   - convert to project task or project note update
   - convert to area note support material
   - convert to resource / evergreen note
   - archive or delete if not useful
4. Add or fix metadata
5. Link to the relevant project/area/resource note
6. Update `updated:` when making meaningful changes
7. Remove or move the note from Inbox when processed

## OpenClaw Support
Use:
- `/.openclaw/commands/process-note`
- `/.openclaw/commands/search-vault-context`
- `/.openclaw/commands/create-evergreen`

## Processing Questions
- Is this actionable?
- Is this durable knowledge?
- Does this belong to an existing project?
- Does this deserve its own note?
- Should this just become a task?
