---
type: index
status: active
created: 2026-04-17
updated: 2026-04-17
tags: [projects]
area:
project:
source:
---

# Project Index

## Active Project Notes
```dataview
TABLE status, area, file.mtime as Updated
FROM "12 Operations/12.02 Projects"
WHERE type = "project"
SORT file.mtime desc
```
