# Task Boards

## Inbox Processing Tasks
```dataview
TASK
FROM "12 Operations/12.01 Inbox"
```

## Project Tasks
```dataview
TASK
FROM "12 Operations/12.02 Projects"
```

## Daily Tasks
```dataview
TASK
FROM "06 Daily Systems/Daily Notes"
WHERE !completed
```

## Review Tasks
```dataview
TASK
FROM "06 Daily Systems/Weekly Reviews" OR "06 Daily Systems/Monthly Reviews"
WHERE !completed
```
