# Areas Dashboard

## Area Notes
```dataview
TABLE status, file.mtime as Updated
FROM "12 Operations/12.03 Areas"
WHERE type = "area"
SORT file.name asc
```

## Recently Updated Area Support Notes
```dataview
TABLE area, file.mtime as Updated
FROM "12 Operations/12.03 Areas"
WHERE file.name != "README"
SORT file.mtime desc
LIMIT 20
```
