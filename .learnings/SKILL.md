# Self-Improvement Logging Skill

Log learnings, errors, and feature requests to markdown files for continuous improvement.

## Purpose

This skill creates a structured logging system in `.learnings/` that captures:
- **Errors** — failed commands, API failures, integration issues
- **Learnings** — corrections, knowledge gaps, best practices, pattern hardening
- **Feature Requests** — missing capabilities users want

Coding agents can later process these into fixes. Important learnings get promoted to project memory.

## Quick Reference

| Situation | Action |
|-----------|--------|
| Command/operation fails | Log to `ERRORS.md` |
| User corrects me | Log to `LEARNINGS.md` with category `correction` |
| User wants missing feature | Log to `FEATURE_REQUESTS.md` |
| API/external tool fails | Log to `ERRORS.md` with integration details |
| Knowledge was outdated | Log to `LEARNINGS.md` with category `knowledge_gap` |
| Found better approach | Log to `LEARNINGS.md` with category `best_practice` |
| Simplify/Harden recurring patterns | Log/update `LEARNINGS.md` with `Source: simplify-and-harden` and a stable `Pattern-Key` |
| Similar to existing entry | Link with "See Also", consider priority bump |
| Broadly applicable learning | Promote to `CLAUDE.md`, `AGENTS.md`, and/or `.github/copilot-instructions.md` |
| Workflow improvements | Promote to `AGENTS.md` (OpenClaw workspace) |
| Tool gotchas | Promote to `TOOLS.md` (OpenClaw workspace) |
| Behavioral patterns | Promote to `SOUL.md` (OpenClaw workspace) |

## Files

```
.learnings/
├── ERRORS.md           # Command/API failures
├── LEARNINGS.md        # Knowledge & improvements
└── FEATURE_REQUESTS.md # Missing features
```

## Usage Example

When an error occurs:

```markdown
## 2026-02-24 14:30 - API Timeout on TradingView Fetch

**Source:** TradingView screenshot fetch
**Severity:** minor
**Impact:** Delayed trade plan generation by ~5 seconds

### Error Details
```
TimeoutError: Navigation timeout of 30000 ms exceeded
```

### Context
Fetching BTCUSDT chart screenshot during high volatility period.

### Resolution
**UNRESOLVED** - Will implement retry logic with exponential backoff.

### Prevention
Add retry logic for network-dependent operations.
```

## Promotion Rules

When a learning proves broadly applicable:

1. **Copy** the relevant content to the target file
2. **Update** the "Promoted" checklist in the original entry
3. **Condense** for the target file (remove timestamps, format for instructions)

## Review Cadence

- **Weekly:** Quick scan for high-priority items
- **Monthly:** Process backlog, promote valuable learnings
- **Quarterly:** Full review, archive obsolete entries
