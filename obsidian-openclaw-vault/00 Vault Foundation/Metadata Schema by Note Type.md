# Metadata Schema by Note Type

## Base Fields
Use these whenever applicable:

```yaml
---
type:
status:
created:
updated:
tags: []
area:
project:
source:
---
```

## 1. Inbox Note
```yaml
---
type: inbox
status: inbox
created:
updated:
tags: [inbox]
area:
project:
source:
---
```

## 2. Project Note
```yaml
---
type: project
status: active
created:
updated:
tags: []
area:
project:
source:
---
```
Suggested status values:
- active
- on-hold
- waiting
- done
- archived

## 3. Area Note
```yaml
---
type: area
status: active
created:
updated:
tags: []
area:
project:
source:
---
```

## 4. Evergreen Note
```yaml
---
type: evergreen
status: active
created:
updated:
tags: []
area:
project:
source:
---
```

## 5. Literature Note
```yaml
---
type: literature
status:
created:
updated:
tags: []
area:
project:
source:
---
```

## 6. Research Note
```yaml
---
type: research
status:
created:
updated:
tags: []
area:
project:
source:
---
```

## 7. Meeting Note
```yaml
---
type: meeting
status:
created:
updated:
tags: []
area:
project:
source:
---
```

## 8. Daily Note
```yaml
---
type: daily
status: active
created:
updated:
tags: [daily]
area:
project:
source:
---
```

## 9. Review Note
```yaml
---
type: review
status: active
created:
updated:
tags: []
area:
project:
source:
---
```

## 10. Prompt Note
```yaml
---
type: prompt
status:
created:
updated:
tags: []
area:
project:
source:
---
```

## 11. Automation Spec
```yaml
---
type: automation
status:
created:
updated:
tags: []
area:
project:
source:
---
```

## 12. Index / Dashboard Note
```yaml
---
type: index
status: active
created:
updated:
tags: []
area:
project:
source:
---
```

## Metadata Rules
1. `type` is required.
2. `status` should be used for actionable notes.
3. `created` and `updated` should be kept current when possible.
4. `area` should map to an Area note when relevant.
5. `project` should map to a Project note when relevant.
6. Keep tags sparse and useful.
