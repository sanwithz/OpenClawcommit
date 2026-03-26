# Run Report — botCM Real Actions

- **Timestamp:** 2026-03-26 23:19:36 Asia/Bangkok
- **Mode:** C (file change)
- **Request:** Make botCM buttons execute real actions instead of only replying with helper text.

## Plan
- Inspect OpenClaw CLI for safe non-interactive commands.
- Upgrade botCM callbacks to call real CLI actions where supported.
- Keep session-native actions as safe conversational fallbacks.

## Files Read / Inspected
- `scripts/telegram-menu-bot.mjs`
- OpenClaw CLI help for:
  - `openclaw help`
  - `openclaw status --help`
  - `openclaw sessions --help`
  - `openclaw system --help`
  - `openclaw agent --help`
  - `openclaw message --help`
  - `openclaw models --help`
  - `openclaw models set --help`
  - `openclaw models status --help`
  - `openclaw config --help`

## Backup
- `archive/2026-03-26_231936/telegram-menu-bot.mjs.bak`

## Changes Made
- Added real CLI execution via `child_process.execFile`
- Implemented real actions for:
  - `Status` → `openclaw status --all`
  - `TinyStatus` → `openclaw status --usage --json`
  - `Kimi` → `openclaw models set moonshot/kimi-k2.5`
  - `Sonnet` → `openclaw models set sonnet`
  - `Opus` → `openclaw models set anthropic/claude-opus-4`
  - `Gemini` → `openclaw models set gemini-flash`
  - `Think Harder` → `openclaw config set agents.defaults.thinking high`
- Kept non-direct/session-native actions as guided real-use prompts:
  - Plan First
  - Browser
  - Agents
  - Backtrack
  - New Task
- Improved callback UX with `Working...` acknowledgement
- Added HTML escaping for CLI output safety

## QC
- `node --check scripts/telegram-menu-bot.mjs` ✅
- Started script successfully in a short test run ✅

## Notes
- Buttons now perform actual OpenClaw mutations where a safe CLI exists.
- Some actions are intentionally not force-automated because they are session-scoped conversation behaviors, not stable standalone CLI mutations.
