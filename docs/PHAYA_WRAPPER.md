# Phaya Wrapper

Wrapper script for calling Phaya API endpoints from OpenClaw workflows, shell scripts, or n8n.

## File

```bash
scripts/phaya-wrapper.mjs
```

## Environment

```bash
export PHAYA_API_KEY='YOUR_PHAYA_KEY'
export PHAYA_BASE_URL='https://api.phaya.io/api/v1'
```

## Basic Usage

### POST with inline JSON

```bash
node scripts/phaya-wrapper.mjs image-to-video/create '{"image_url":"https://example.com/image.jpg","duration":5}'
```

### POST with stdin JSON

```bash
echo '{"voice":"nova","text":"สวัสดี"}' | node scripts/phaya-wrapper.mjs tts/create --stdin
```

### Raw response only

```bash
node scripts/phaya-wrapper.mjs image-to-video/create '{"image_url":"https://example.com/image.jpg","duration":5}' --raw
```

## Output Format

By default the wrapper prints normalized JSON:

```json
{
  "ok": true,
  "status": 200,
  "statusText": "OK",
  "url": "https://api.phaya.io/api/v1/image-to-video/create",
  "method": "POST",
  "data": {}
}
```

## n8n Usage

Use an **Execute Command** node:

```bash
node /Users/harvey/.openclaw/workspace/scripts/phaya-wrapper.mjs image-to-video/create '{"image_url":"https://example.com/image.jpg","duration":5}'
```

Or pass JSON dynamically via stdin.

## OpenClaw Usage

Use via `exec`:

```bash
export PHAYA_API_KEY='YOUR_PHAYA_KEY'
node scripts/phaya-wrapper.mjs image-to-video/create '{"image_url":"https://example.com/image.jpg","duration":5}'
```

## Notes

- Auth header used: `Authorization: Bearer <PHAYA_API_KEY>`
- Default base URL: `https://api.phaya.io/api/v1`
- Wrapper is generic: any documented Phaya endpoint can be called by path
- Current wrapper assumes JSON request/response
