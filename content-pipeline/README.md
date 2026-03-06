# Content Pipeline Manager

A local, browser-based content workflow board.

## Features
- 10 end-to-end stages of content creation
- Create/edit ideas and full scripts
- Optional image attachments per item
- Search across title/tags/script/notes
- One-click stage progression (`Next`)
- Local autosave via browser storage
- Export/import JSON backups

## Run
Open in browser:

```bash
open /Users/harvey/.openclaw/workspace/content-pipeline/index.html
```

No server required.

## Notes
- Attachments are stored as Base64 in localStorage. Keep images small to avoid browser storage limits.
- For multi-device sync later, we can upgrade this to a small Node + SQLite app.
