# Knowledge Dashboard

## Evergreen Notes
```dataview
TABLE area, project, file.mtime as Updated
FROM "12 Operations/12.04 Resources"
WHERE type = "evergreen"
SORT file.mtime desc
LIMIT 30
```

## Literature Notes
```dataview
TABLE source, area, file.mtime as Updated
FROM "12 Operations/12.04 Resources"
WHERE type = "literature"
SORT file.mtime desc
LIMIT 30
```

## Research Notes
```dataview
TABLE area, project, file.mtime as Updated
FROM "12 Operations/12.04 Resources"
WHERE type = "research"
SORT file.mtime desc
LIMIT 30
```
