---
name: journal-daily-report
description: Create and update Apple Journal entries as daily reports with strict field separation. Use when the user asks to add diary/journal entries, daily reports, or log today in Journal app. Always format as Header/Title in the title field and structured Body content starting with Topic then Body bullets.
---

# Journal Daily Report

1. Open/activate Journal app.
2. Create a new entry.
3. Fill fields with strict separation:
   - **Title field**: `Daily Report - YYYY-MM-DD`
   - **Body field**:
     - `Topic: <short topic>`
     - blank line
     - `Body:`
     - bullet list of completed actions/results
4. Never paste full content into the title field.
5. If user says "today", use current local date format `YYYY-MM-DD`.
6. Keep entries concise and execution-focused.

## Default Template

Title:
`Daily Report - YYYY-MM-DD`

Body:
```text
Topic: <topic>

Body:
- <item 1>
- <item 2>
- <item 3>
```
