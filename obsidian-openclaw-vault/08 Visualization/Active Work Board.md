# Active Work Board

## Active Projects
```dataview
TABLE status, area, file.mtime as Updated
FROM "12 Operations/12.02 Projects"
WHERE type = "project" AND status = "active"
SORT file.mtime desc
```

## Recently Updated Work
```dataview
TABLE type, status, area, project, file.mtime as Updated
FROM "12 Operations"
WHERE file.name != "README"
SORT file.mtime desc
LIMIT 25
```

## Waiting / On-Hold Projects
```dataview
TABLE status, area, file.mtime as Updated
FROM "12 Operations/12.02 Projects"
WHERE type = "project" AND (status = "waiting" OR status = "on-hold")
SORT file.mtime desc
```
