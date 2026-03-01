# Kru Bank Nightly Autopilot (23:00 Asia/Bangkok)

## Goal
Every night at 23:00, proactively build one useful improvement and report by morning.

## Hard rules
1. **No live production deploys** unless explicitly requested.
2. **Create PR for review** when possible. If PR cannot be created, prepare PR-ready branch/patch + report.
3. **Locked Purse policy**: no payment/subscription/spend action without explicit written approval.

## Nightly run checklist
1. Read kanban board/tasks and current project context.
2. Pick highest-impact item (time-saving or revenue-improving).
3. Implement in workspace with clean commit(s).
4. Open PR (or prepare PR package if PR unavailable).
5. Write `docs/NIGHTLY_REPORT.md` with:
   - What was built
   - Why it matters
   - How to test
   - Blockers
   - Next suggested step
