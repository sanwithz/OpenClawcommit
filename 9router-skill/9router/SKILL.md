---
name: 9router
description: AI endpoint proxy with web dashboard. Unified access to 15+ AI providers (Claude, OpenAI, Gemini, GitHub Copilot, and more) through a single endpoint. Use when managing multiple AI accounts, setting up fallbacks, or routing Claude/OpenAI requests via a local proxy.
---

# 9Router Skill

9Router is an AI endpoint proxy that provides unified access to multiple AI providers through a single local endpoint (default: `http://localhost:20128/v1`).

## Core Features

- **Multi-Provider Support**: Claude, OpenAI, Gemini, GitHub Copilot, etc.
- **Intelligent Fallback**: Automatic account rotation and error handling.
- **Web Dashboard**: Manage providers and settings at `http://localhost:20128/dashboard`.
- **Format Translation**: Auto-translates between OpenAI, Claude, Gemini, and Codex formats.

## Usage

### Start 9Router
To start the 9Router server in the background:
```bash
9router --tray --no-browser
```

### Check Status
Verify if 9Router is running:
```bash
curl -s http://localhost:20128/health || echo "9Router is not running"
```

### Integration with OpenClaw
To use 9Router as a custom provider in OpenClaw, add it to your `openclaw.json`:

```json
{
  "models": {
    "providers": {
      "9router": {
        "baseUrl": "http://127.0.0.1:20128/v1",
        "apiKey": "sk_9router",
        "api": "openai-completions",
        "models": [
          {
            "id": "claude-3-5-sonnet",
            "name": "Claude 3.5 Sonnet (via 9Router)",
            "contextWindow": 200000
          }
        ]
      }
    }
  }
}
```

## Bundled Resources

### Scripts
- `scripts/manage_9router.sh`: Start, stop, and check status of the 9Router server.

## Tips
- Use the dashboard to configure your AI accounts and "combos" (fallback chains).
- 9Router is especially useful for bypassing rate limits by rotating through multiple accounts.
