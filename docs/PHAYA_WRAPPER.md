# Phaya Wrapper

Wrapper script for calling Phaya API endpoints from OpenClaw workflows, shell scripts, or n8n.

## Files

```bash
scripts/phaya-wrapper.mjs
scripts/phaya-presets.mjs
scripts/phaya-tts
scripts/phaya-image2video
```

## Environment

```bash
export PHAYA_API_KEY='YOUR_PHAYA_KEY'
export PHAYA_BASE_URL='https://api.phaya.io/api/v1'
```

## Generic Wrapper

### POST with inline JSON

```bash
node scripts/phaya-wrapper.mjs image-to-video/create '{"image_url":"https://example.com/image.jpg","duration":5}'
```

### POST with stdin JSON

```bash
echo '{"voice":"nova","text":"สวัสดี"}' | node scripts/phaya-wrapper.mjs tts/create --stdin
```

## Preset Commands

List all presets:

```bash
node scripts/phaya-presets.mjs --list
```

### Main presets included

- `image-generate`
- `nano-banana-2`
- `seedream-5`
- `music-generate`
- `tts`
- `ai-video-sora2`
- `sora2-text2video`
- `veo-3-1-video`
- `seedance-video`
- `grok-imagine-video`
- `kling-motion-control`
- `sora2-character`
- `video-download`
- `thai-subtitle`
- `image2video`
- `merge-audio`
- `merge-audio-video`
- `merge-video`
- `overlay-gif`
- `overlay-text`
- `extract-last-frame`
- `video-to-gif`
- `transcribe`
- `job-status`

### TTS example

```bash
node scripts/phaya-presets.mjs tts '{"text":"สวัสดีครับ","voice":"nova"}'
```

Shortcut:

```bash
scripts/phaya-tts '{"text":"สวัสดีครับ","voice":"nova"}'
```

### Image to Video example

```bash
node scripts/phaya-presets.mjs image2video '{"image_url":"https://example.com/image.jpg","duration":5}'
```

Shortcut:

```bash
scripts/phaya-image2video '{"image_url":"https://example.com/image.jpg","duration":5}'
```

## n8n Usage

Use an **Execute Command** node:

```bash
node /Users/harvey/.openclaw/workspace/scripts/phaya-presets.mjs tts '{"text":"hello"}'
```

## OpenClaw Usage

Use via `exec`:

```bash
export PHAYA_API_KEY='YOUR_PHAYA_KEY'
node scripts/phaya-presets.mjs image-generate '{"prompt":"A serene mountain landscape at sunset","aspect_ratio":"16:9"}'
```

## Notes

- Auth header used: `Authorization: Bearer <PHAYA_API_KEY>`
- Default base URL: `https://api.phaya.io/api/v1`
- Presets are endpoint aliases; exact payload fields depend on Phaya docs for each endpoint
- `scripts/phaya-tts` and `scripts/phaya-image2video` currently default to the provided API key if `PHAYA_API_KEY` is not already set
