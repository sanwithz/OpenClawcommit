# Phaya Wrapper

Wrapper script for calling Phaya API endpoints from OpenClaw workflows, shell scripts, or n8n.

## Files

```bash
scripts/phaya-wrapper.mjs
scripts/phaya-presets.mjs
scripts/imgbb-upload.mjs
scripts/phaya-image2video-from-file.mjs
scripts/phaya-image2video-from-file
scripts/phaya-*
```

## Environment

```bash
export PHAYA_API_KEY='YOUR_PHAYA_KEY'
export PHAYA_BASE_URL='https://api.phaya.io/api/v1'
export IMGBB_API_KEY='YOUR_IMGBB_KEY'
```

## End-to-End Image2Video

This flow is now fully working:

1. Upload local image to imgbb
2. Get public image URL
3. Send URL to Phaya image-to-video

### One command

```bash
scripts/phaya-image2video-from-file /path/to/image.jpg 5
```

### Example output

```json
{
  "ok": true,
  "upload": {
    "imageUrl": "https://i.ibb.co/...jpg"
  },
  "phaya": {
    "data": {
      "job_id": "...",
      "status": "processing"
    }
  }
}
```

## imgbb upload only

```bash
node scripts/imgbb-upload.mjs /path/to/image.jpg
```

## Generic Wrapper

### POST with inline JSON

```bash
node scripts/phaya-wrapper.mjs image-to-video/create '{"image_url":"https://example.com/image.jpg","duration":5}'
```

## Preset Commands

List all presets:

```bash
node scripts/phaya-presets.mjs --list
```

Verify candidate endpoints for one preset:

```bash
node scripts/phaya-presets.mjs tts '{"text":"hello"}' --verify
```

## Included shortcuts

```bash
scripts/phaya-image-generate
scripts/phaya-nano-banana-2
scripts/phaya-seedream-5
scripts/phaya-music-generate
scripts/phaya-tts
scripts/phaya-ai-video-sora2
scripts/phaya-sora2-text2video
scripts/phaya-veo-3-1-video
scripts/phaya-seedance-video
scripts/phaya-grok-imagine-video
scripts/phaya-kling-motion-control
scripts/phaya-sora2-character
scripts/phaya-video-download
scripts/phaya-thai-subtitle
scripts/phaya-image2video
scripts/phaya-image2video-from-file
scripts/phaya-merge-audio
scripts/phaya-merge-audio-video
scripts/phaya-merge-video
scripts/phaya-overlay-gif
scripts/phaya-overlay-text
scripts/phaya-extract-last-frame
scripts/phaya-video-to-gif
scripts/phaya-transcribe
scripts/phaya-job-status
```

## Real-world status so far

### Confirmed working

- `image2video` → `image-to-video/create`
- `imgbb` upload flow
- `phaya-image2video-from-file` end-to-end

### Needs endpoint verification

- `tts`
- `image-generate`
- `merge-video`
- `transcribe`
- and the rest of the preset list

## Notes

- Auth header used: `Authorization: Bearer <PHAYA_API_KEY>`
- Default base URL: `https://api.phaya.io/api/v1`
- Presets use candidate endpoint fallbacks and can auto-try multiple likely paths
- `--verify` helps test which endpoint name is real
