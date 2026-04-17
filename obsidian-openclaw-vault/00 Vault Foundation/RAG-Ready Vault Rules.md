# RAG-Ready Vault Rules

## Purpose
Make this vault reliable as a retrieval-augmented knowledge system for OpenClaw.

## Core Principle
The vault should be easy to retrieve from, easy to reason over, and safe to write back into.

## Retrieval Rules
1. Prefer **canonical notes** over duplicate fragments.
2. Start retrieval from:
   - hub notes
   - project notes
   - area notes
   - resource notes
3. Read the **smallest useful set of notes** first.
4. Prefer recent notes for status; prefer evergreen notes for stable knowledge.
5. Use metadata and folder scope before broad full-vault search.

## Writing Rules
1. Do not overwrite important notes carelessly.
2. Add structured updates instead of rewriting history unless cleanup is intentional.
3. Preserve decisions, status changes, and next actions in project notes.
4. Promote durable insights into resource or evergreen notes.
5. Move inactive material to Archive instead of deleting by default.

## Note Quality Rules
1. One note should have one clear role.
2. Titles should be human-readable and retrieval-friendly.
3. Use frontmatter consistently.
4. Keep notes linkable and specific.
5. Avoid giant mixed-purpose notes unless they are intentional hub notes.

## Operational Rules for OpenClaw
1. Search before answering when vault context matters.
2. Load focused context, not entire folders.
3. Prefer updating existing canonical notes over spawning duplicates.
4. If creating a new note, place it in the correct operational folder.
5. When summarizing, link back to source notes when useful.

## Recommended Retrieval Order
1. Central Dashboard
2. Relevant Hub Note
3. Matching Project / Area Note
4. Related Resource Notes
5. Recent Daily / Review Notes
