# Inbox Dashboard

## Unprocessed Inbox Notes
```dataview
TABLE file.mtime as Updated, type, status
FROM "12 Operations/12.01 Inbox"
SORT file.mtime desc
```

## Quick Rule
Anything that sits here too long should be processed, linked, moved, or deleted.
