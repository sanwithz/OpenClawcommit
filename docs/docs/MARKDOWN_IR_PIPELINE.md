# Markdown → IR → Channel Renderers (Skill Update)

## Goals
- **Consistency:** one parse step, multiple renderers.
- **Safe chunking:** split text before rendering so inline formatting never breaks across chunks.
- **Channel fit:** map the same IR to Slack mrkdwn, Telegram HTML, and Signal style ranges without re-parsing Markdown.

## Pipeline

### 1) Parse Markdown → IR
IR contains:
- `text` (plain text)
- `styles` spans: bold / italic / strike / code / spoiler
- `links` spans
- offsets in **UTF-16 code units** (for Signal compatibility)
- tables parsed only when channel opts into table conversion

### 2) Chunk IR (format-first)
- chunking happens on IR text **before** rendering
- inline formatting cannot split across chunks
- spans are sliced/remapped per chunk

### 3) Render per channel
- **Slack:** mrkdwn tokens + links as `<url|label>`
- **Telegram:** HTML tags (`<b> <i> <s> <code> <pre><code> <a href>`)
- **Signal:** plain text + `text_style_ranges`; links become `label (url)` if label differs

## IR Example
Input Markdown:
`Hello world — see [docs](https://docs.openclaw.ai).`

IR (schematic):
```json
{
  "text": "Hello world — see docs.",
  "styles": [{ "start": 6, "end": 11, "style": "bold" }],
  "links": [{ "start": 19, "end": 23, "href": "https://docs.openclaw.ai" }]
}
```
