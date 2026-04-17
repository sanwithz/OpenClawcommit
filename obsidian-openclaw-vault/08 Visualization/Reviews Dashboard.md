# Reviews Dashboard

## Recent Daily Notes
```dataview
TABLE file.cday as Created, status
FROM "06 Daily Systems/Daily Notes"
WHERE type = "daily"
SORT file.name desc
LIMIT 14
```

## Weekly Reviews
```dataview
TABLE status, file.mtime as Updated
FROM "06 Daily Systems/Weekly Reviews"
SORT file.name desc
LIMIT 12
```

## Monthly Reviews
```dataview
TABLE status, file.mtime as Updated
FROM "06 Daily Systems/Monthly Reviews"
SORT file.name desc
LIMIT 12
```
