---
type: index
status: active
created: 2026-04-17
updated: 2026-04-17
tags: [dashboard, home]
area: Knowledge System
project: OpenClaw Vault Rollout
source:
---

# Central Dashboard

## Command Center
- [[../00 Vault Foundation/Vault Home|Vault Home]]
- [[Dataview Dashboard Setup]]
- [[Inbox Dashboard]]
- [[Projects Dashboard]]
- [[Areas Dashboard]]
- [[Reviews Dashboard]]
- [[Knowledge Dashboard]]
- [[Task Boards]]
- [[Active Work Board]]
- [[Project Health Dashboard]]
- [[Stale Notes Dashboard]]
- [[Area Focus Dashboard]]
- [[DataviewJS Dashboard Lab]]

## Work Areas
- [[../12 Operations/12.01 Inbox/README|Inbox]]
- [[../12 Operations/12.02 Projects/Project Index|Project Index]]
- [[../12 Operations/12.03 Areas/Area Index|Area Index]]
- [[../12 Operations/12.04 Resources/Resource Index|Resource Index]]

## Workflows
- [[../04 Knowledge Workflows/Inbox Processing Workflow|Inbox Processing Workflow]]
- [[../04 Knowledge Workflows/Weekly Review Workflow|Weekly Review Workflow]]

## Operating Rules
- [[../00 Vault Foundation/RAG-Ready Vault Rules|RAG-Ready Vault Rules]]
- [[../00 Vault Foundation/Metadata Schema by Note Type|Metadata Schema by Note Type]]
- [[../00 Vault Foundation/Daily Startup Checklist|Daily Startup Checklist]]
- [[../01 OpenClaw Integration/Context Loading Strategies|Context Loading Strategies]]
- [[../01 OpenClaw Integration/Session Memory System|Session Memory System]]

## Prompt Library
- [[../03 Prompt Library/OpenClaw Operating Prompts|OpenClaw Operating Prompts]]
- [[../03 Prompt Library/Daily OpenClaw Prompts|Daily OpenClaw Prompts]]

## Plugin Operations
- [[../02 Core Plugins/QuickAdd Capture Flows|QuickAdd Capture Flows]]
- [[../02 Core Plugins/QuickAdd Setup Checklist|QuickAdd Setup Checklist]]

## Action Dashboards
### Inbox Count
```dataview
TABLE length(rows) as Notes
FROM "12 Operations/12.01 Inbox"
GROUP BY "Inbox"
```

### Active Projects
```dataview
TABLE status, area, file.mtime as Updated
FROM "12 Operations/12.02 Projects"
WHERE type = "project" AND status = "active"
SORT file.mtime desc
```

### Open Inbox Tasks
```dataview
TASK
FROM "12 Operations/12.01 Inbox"
WHERE !completed
```

### Recent Daily Notes
```dataview
TABLE file.cday as Created
FROM "06 Daily Systems/Daily Notes"
WHERE type = "daily"
SORT file.name desc
LIMIT 7
```

### Recent Knowledge Notes
```dataview
TABLE type, area, project, file.mtime as Updated
FROM "12 Operations/12.04 Resources"
SORT file.mtime desc
LIMIT 15
```

## Suggested Workflow
1. Open dashboard
2. Check tasks and active work
3. Open or create daily note
4. Process inbox
5. Work projects
6. Review and capture again before closing
