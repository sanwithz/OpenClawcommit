# Workspace Governance - Adapted for Kru Bank's Assistant

> Lightweight governance adapted from WORKSPACE_GOVERNANCE by Adamchanadam
> Original: https://github.com/Adamchanadam/OpenClaw-WORKSPACE-GOVERNANCE

## 5-Gate Lifecycle (for file changes)

Every write/update/persist operation follows:

1. **PLAN GATE** - Plan changes internally before writing
2. **READ GATE** - Read existing files before modifying
3. **CHANGE GATE** - Make the minimum viable change
4. **QC GATE** - Verify quality (lint, test, review)
5. **PERSIST GATE** - Save run report to `_runs/`

## Operating Modes

| Mode | Description | Persistence? |
|------|-------------|--------------|
| **A** | Casual conversation, advice, planning | No |
| **B** | Verified answers (facts, status, dates) | No |
| **C** | File changes (write/edit/update/delete) | Yes |

## Brain Docs (read before Mode C changes)

When modifying these files, always read first:
- `SOUL.md` - My identity
- `USER.md` - Who I'm helping
- `MEMORY.md` - Long-term memory
- `TOOLS.md` - Tool configurations
- `IDENTITY.md` - My persona
- `HEARTBEAT.md` - Periodic tasks
- `memory/YYYY-MM-DD.md` - Daily context

## Workspace Structure

```
.
├── AGENTS.md              # This file - entry point
├── SOUL.md               # My identity/personality
├── USER.md               # User profile
├── MEMORY.md             # Long-term memory
├── TOOLS.md              # Tool configs
├── IDENTITY.md           # Persona metadata
├── HEARTBEAT.md          # Periodic tasks
├── BOOTSTRAP.md          # First-run guide (delete after use)
├── _control/             # Governance SSOT
│   ├── GOVERNANCE.md     # This governance doc
│   ├── ACTIVE_GUARDS.md  # Recurring failure guards
│   ├── LESSONS.md        # Lessons learned
│   └── DECISIONS.md      # Key decisions log
├── _runs/                # Run reports (artifacts)
├── archive/              # Backups before changes
├── memory/               # Daily notes
├── skills/               # Skill definitions
├── docs/                 # Documentation
├── scripts/              # Utility scripts
└── projects/             # Active projects
```

## Pre-Change Checklist (Mode C)

Before any file modification:
- [ ] Plan the change internally
- [ ] Read target file(s)
- [ ] Read relevant Brain Docs if applicable
- [ ] Determine backup path in `archive/`
- [ ] Execute minimum change
- [ ] Verify quality
- [ ] Write run report to `_runs/`

## Post-Change Requirements

1. **Backup**: Original files backed up to `archive/YYYY-MM-DD_HHMMSS/`
2. **Run Report**: Document what changed in `_runs/`
3. **Evidence**: Show before/after when applicable

## Active Guards System

When a failure repeats:
1. Record guard in `_control/ACTIVE_GUARDS.md`
2. Add lesson to `_control/LESSONS.md`
3. Include recurrence test

## Financial Safety (Hard Rule)

Never initiate, confirm, or enable any payment/purchase/subscription/trial without explicit written user approval (e.g., "Proceed. Confirmed. Done.")

---
*Adapted from WORKSPACE_GOVERNANCE v0.1.60*
