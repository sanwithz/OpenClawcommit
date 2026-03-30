---
name: gogcli
description: Use gogcli (`gog`) for Google Workspace and consumer Google operations from the terminal: Gmail, Calendar, Drive, Docs, Sheets, Slides, Forms, Tasks, Contacts, Apps Script, Chat, Classroom, and more. Use when the user explicitly wants terminal/CLI-based Google operations, gog/gogcli setup, auth inspection, or script-friendly JSON output.
---

# gogcli Skill

Use `gog` when the user specifically asks for gog/gogcli, wants CLI-based Google operations, or when terminal JSON output is more useful than browser/manual workflows.

## Installed Status

On this machine, `gogcli` is already installed via Homebrew and exposed as:

```bash
gog
```

Check:

```bash
which gog
gog --version
gog --help
```

## Safety Modes

### 1) READ-ONLY / INSPECT
Safe for:
- checking version/help
- listing configured accounts
- checking auth status
- reading Gmail/Calendar/Drive metadata
- exporting JSON for summaries

Examples:

```bash
gog --version
gog auth list
gog auth status
gog gmail labels list
gog calendar list
gog drive files list
```

### 2) ACTION / WRITE
Only use when the user clearly requests it.

Examples:
- send email
- create/update calendar events
- upload/edit Drive files
- create/update Docs/Sheets/Slides
- run Apps Script functions

## Auth Setup Notes

Before `gog auth add`, OAuth desktop client credentials must be stored first:

```bash
gog auth credentials ~/Downloads/client_secret_xxx.json
```

Then add an account:

```bash
gog auth add you@gmail.com
```

Useful auth commands:

```bash
gog auth list
gog auth list --check
gog auth status
gog auth credentials list
```

## Account Preference

Default assistant operations should prefer:

```text
opensanwithz@gmail.com
```

If multiple accounts are present and the action writes data, confirm the target account first unless the user was explicit.

## Common Command Patterns

### Gmail
```bash
gog gmail threads list --help
gog gmail messages get --help
gog gmail send --help
```

### Calendar
```bash
gog calendar list
gog calendar events list --help
gog calendar events create --help
```

### Drive
```bash
gog drive files list
gog drive files upload --help
gog drive files download --help
```

### Docs / Sheets / Slides
```bash
gog docs --help
gog sheets --help
gog slides --help
```

### Apps Script
```bash
gog script --help
```

## JSON-First Usage

Prefer machine-readable output when summarizing or chaining commands:

```bash
gog <command> --json
```

If a subcommand supports filtering/formatting, prefer fewer, higher-signal calls instead of many small loops.

## Execution Guidance

- Use `exec` for `gog` commands.
- Keep read operations concise.
- For write operations, provide a short step log.
- For destructive or external effects, confirm scope first.
- Never perform payment/billing/subscription actions.

## When To Prefer Other Skills

- Use `google-workspace-manager` when the user wants outcome-focused Google help and doesn’t care about the CLI.
- Use `gogcli` when the user explicitly mentions `gog`, `gogcli`, terminal setup, auth, JSON output, or shell automation.
