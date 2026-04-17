# Projects Dashboard

## Active Projects
```dataview
TABLE status, area, file.mtime as Updated
FROM "12 Operations/12.02 Projects"
WHERE type = "project"
SORT file.mtime desc
```

## Stalled Projects
```dataview
TABLE status, area, file.mtime as Updated
FROM "12 Operations/12.02 Projects"
WHERE type = "project" AND status != "active"
SORT file.mtime desc
```
