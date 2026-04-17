# Telegram `/nlmpy` Behavior

## Purpose
Define a practical Telegram-side command behavior for controlling local NotebookLM operations through OpenClaw.

## Supported Commands
- `/nlmpy`
- `/nlmpy list`
- `/nlmpy status`
- `/nlmpy use <id>`
- `/nlmpy create <title>`
- `/nlmpy add <url-or-path>`
- `/nlmpy ask <question>`
- `/nlmpy summary`
- `/nlmpy export <title>`

## Response Style
- concise
- operational
- return notebook title/id when useful
- when exporting, include the Obsidian note path

## Notes
This is a behavior contract for the assistant layer. It does not require a Telegram bot code rewrite if OpenClaw handles command routing conversationally.
