---
name: google-workspace-manager
description: Manage Google Workspace end-to-end for one account: Gmail, Google Calendar, Google Drive, Google Docs, Google Sheets, and Google Slides. Use when user asks to send/summarize email, create or update Docs/Sheets/Slides, manage calendar events, organize Drive files, or run cross-app workflows. Always support two execution modes: read-only mode (no writes) and action mode (perform writes).
---

# Google Workspace Manager

Use this skill for all Google Service operations under one workspace account.

## Operating Modes

### 1) Read-only mode (safe)
Use for inspection/reporting only.

Allowed:
- Read/search/summarize Gmail
- Read calendar schedule
- Read Drive file/folder metadata
- Read Docs/Sheets/Slides content for summary

Blocked:
- Sending email
- Creating/editing/deleting files/events
- Sharing/permission changes

Output format:
- "Mode: READ-ONLY"
- "Actions performed"
- "No-write confirmation"

### 2) Action mode (execute)
Use when user explicitly asks to create/update/send.

Allowed:
- Send/reply email
- Create/update Docs, Sheets, Slides
- Create/update/delete calendar events
- Move/rename/share Drive files
- Cross-app automations

Output format:
- "Mode: ACTION"
- "Step log" (what changed)
- "Result IDs/links" when available

## Safety Rules

1. Default to read-only when intent is ambiguous.
2. Require clear user intent before destructive actions (delete, overwrite, revoke sharing).
3. Never perform payment/subscription/billing actions without explicit written confirmation.
4. Prefer minimal-change updates instead of full rewrites.

## Account Routing

- Use dedicated Google account for operations: `opensanwithz@gmail.com`.
- If multiple accounts are active, confirm target account before action mode writes.

## Common Task Playbooks

### A) Email summary (read-only)
1. Fetch unread/important emails.
2. Summarize by priority + action needed.
3. Return concise bullet list.

### B) Send email (action)
1. Draft subject/body from user instruction.
2. Confirm recipients and attachments.
3. Send and return confirmation.

### C) Build report pack (action)
1. Create/refresh Sheet data table.
2. Create Doc summary from Sheet results.
3. Generate Slides deck from Doc summary.
4. Return file links.

### D) Calendar planning
- Read-only: show free/busy windows.
- Action: create event with title, datetime, attendees, reminders.

## Response Contract

Always include:
- Selected mode: READ-ONLY or ACTION
- What was done
- What is next (optional 1-line suggestion)
