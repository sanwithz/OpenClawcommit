#!/usr/bin/env node

/**
 * Phaya Preset Commands
 *
 * Friendly aliases for common Phaya media endpoints.
 * This script maps preset names -> endpoint + payload shaping.
 *
 * Usage examples:
 *   node scripts/phaya-presets.mjs tts '{"text":"สวัสดี"}'
 *   node scripts/phaya-presets.mjs image2video '{"image_url":"https://example.com/a.jpg","duration":5}'
 *   node scripts/phaya-presets.mjs sora2-text2video '{"prompt":"A cinematic drone shot over Bangkok at night"}'
 */

const DEFAULT_BASE_URL = process.env.PHAYA_BASE_URL || 'https://api.phaya.io/api/v1';
const API_KEY = process.env.PHAYA_API_KEY || process.env.OPENAI_API_KEY || '';

const PRESETS = {
  'image-generate': { endpoint: 'image-generation/create', description: 'สร้างภาพจากข้อความ' },
  'nano-banana-2': { endpoint: 'nano-banana-2/create', description: 'Nano Banana 2' },
  'seedream-5': { endpoint: 'seedream-5/create', description: 'Seedream 5.0' },
  'music-generate': { endpoint: 'music/create', description: 'สร้างเพลงจากข้อความ' },
  'tts': { endpoint: 'tts/create', description: 'แปลงข้อความเป็นเสียง' },
  'ai-video-sora2': { endpoint: 'ai-video/sora-2/create', description: 'AI Video (Sora 2)' },
  'sora2-text2video': { endpoint: 'sora-2/text-to-video/create', description: 'Sora 2 Text-to-Video' },
  'veo-3-1-video': { endpoint: 'veo-3-1/video/create', description: 'Veo 3.1 Video' },
  'seedance-video': { endpoint: 'seedance/video/create', description: 'Seedance Video' },
  'grok-imagine-video': { endpoint: 'grok-imagine/video/create', description: 'Grok Imagine Video' },
  'kling-motion-control': { endpoint: 'kling-motion-control/create', description: 'Kling Motion Control' },
  'sora2-character': { endpoint: 'sora-2/character/create', description: 'Sora 2 Character' },
  'video-download': { endpoint: 'video/download', description: 'ดาวน์โหลดวิดีโอ' },
  'thai-subtitle': { endpoint: 'subtitle/thai/create', description: 'ซับไตเติ้ลไทย' },
  'image2video': { endpoint: 'image-to-video/create', description: 'ภาพเป็นวิดีโอ (FFmpeg)' },
  'merge-audio': { endpoint: 'merge-audio/create', description: 'รวมเสียง' },
  'merge-audio-video': { endpoint: 'merge-audio-video/create', description: 'รวมเสียงกับวิดีโอ' },
  'merge-video': { endpoint: 'merge-video/create', description: 'รวมวิดีโอ' },
  'overlay-gif': { endpoint: 'overlay-gif/create', description: 'วาง GIF บนวิดีโอ' },
  'overlay-text': { endpoint: 'overlay-text/create', description: 'วางข้อความบนวิดีโอ' },
  'extract-last-frame': { endpoint: 'extract-last-frame/create', description: 'ดึงเฟรมสุดท้าย' },
  'video-to-gif': { endpoint: 'video-to-gif/create', description: 'วิดีโอเป็น GIF' },
  'transcribe': { endpoint: 'transcribe/create', description: 'ถอดเสียง' },
  'job-status': { endpoint: 'jobs/status', description: 'เช็กสถานะงาน' },
};

function usage() {
  const lines = Object.entries(PRESETS).map(([name, meta]) => `  ${name.padEnd(20)} ${meta.description} -> ${meta.endpoint}`);
  console.log(`Usage:
  node scripts/phaya-presets.mjs <preset> <jsonBody>
  node scripts/phaya-presets.mjs <preset> --stdin
  node scripts/phaya-presets.mjs --list

Env:
  PHAYA_API_KEY
  PHAYA_BASE_URL=https://api.phaya.io/api/v1

Presets:
${lines.join('\n')}
`);
}

function parseArgs(argv) {
  const args = [...argv];
  const out = { preset: '', bodyText: '', stdin: false, raw: false, method: 'POST', list: false };
  while (args.length) {
    const token = args.shift();
    if (!out.preset && !token.startsWith('--')) {
      out.preset = token;
      continue;
    }
    if (!out.bodyText && !token.startsWith('--')) {
      out.bodyText = token;
      continue;
    }
    if (token === '--stdin') out.stdin = true;
    else if (token === '--raw') out.raw = true;
    else if (token === '--list') out.list = true;
    else if (token === '--method') out.method = String(args.shift() || 'POST').toUpperCase();
    else if (token === '--help' || token === '-h') out.help = true;
    else throw new Error(`Unknown argument: ${token}`);
  }
  return out;
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8').trim();
}

function parseJson(text) {
  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(`Invalid JSON body: ${error.message}`);
  }
}

async function callPhaya(endpoint, payload, method, raw) {
  const url = `${DEFAULT_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: method === 'GET' ? undefined : JSON.stringify(payload),
  });

  const text = await res.text();
  if (raw) {
    process.stdout.write(text);
    process.exit(res.ok ? 0 : 1);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  process.stdout.write(JSON.stringify({
    ok: res.ok,
    preset: endpoint,
    status: res.status,
    statusText: res.statusText,
    data,
  }, null, 2) + '\n');

  if (!res.ok) process.exit(1);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help || opts.list || !opts.preset) {
    usage();
    process.exit(opts.help || opts.list ? 0 : 1);
  }

  if (!API_KEY) throw new Error('Missing PHAYA_API_KEY (or OPENAI_API_KEY fallback)');

  const preset = PRESETS[opts.preset];
  if (!preset) {
    throw new Error(`Unknown preset: ${opts.preset}`);
  }

  const bodyText = opts.stdin ? await readStdin() : (opts.bodyText || '{}');
  const payload = parseJson(bodyText);

  await callPhaya(preset.endpoint, payload, opts.method, opts.raw);
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
