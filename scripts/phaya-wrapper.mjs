#!/usr/bin/env node

/**
 * Phaya API Wrapper
 *
 * Purpose:
 * - Call Phaya REST endpoints quickly from OpenClaw workflows, shell scripts, or n8n.
 * - Keep auth/base URL in env vars.
 *
 * Env:
 *   PHAYA_API_KEY=...
 *   PHAYA_BASE_URL=https://api.phaya.io/api/v1
 *
 * Examples:
 *   node scripts/phaya-wrapper.mjs image-to-video/create '{"image_url":"https://example.com/image.jpg","duration":5}'
 *   echo '{"text":"hello"}' | node scripts/phaya-wrapper.mjs tts/create --stdin
 */

const DEFAULT_BASE_URL = process.env.PHAYA_BASE_URL || 'https://api.phaya.io/api/v1';
const API_KEY = process.env.PHAYA_API_KEY || process.env.OPENAI_API_KEY || '';

function printUsage() {
  console.log(`Usage:
  node scripts/phaya-wrapper.mjs <endpoint> <jsonBody>
  node scripts/phaya-wrapper.mjs <endpoint> --stdin

Options:
  --method <METHOD>   HTTP method (default: POST)
  --stdin             Read JSON body from stdin
  --raw               Print raw response body only
  --help              Show this help

Env:
  PHAYA_API_KEY       Bearer token for Phaya
  PHAYA_BASE_URL      Base URL (default: https://api.phaya.io/api/v1)

Examples:
  node scripts/phaya-wrapper.mjs image-to-video/create '{"image_url":"https://example.com/image.jpg","duration":5}'
  echo '{"voice":"nova","text":"สวัสดี"}' | node scripts/phaya-wrapper.mjs tts/create --stdin
  node scripts/phaya-wrapper.mjs jobs/status '{"job_id":"abc123"}' --method POST
`);
}

function parseArgs(argv) {
  const args = [...argv];
  const out = {
    endpoint: '',
    bodyText: '',
    method: 'POST',
    stdin: false,
    raw: false,
  };

  while (args.length) {
    const token = args.shift();
    if (!out.endpoint && !token.startsWith('--')) {
      out.endpoint = token;
      continue;
    }
    if (!out.bodyText && !token.startsWith('--')) {
      out.bodyText = token;
      continue;
    }
    if (token === '--method') {
      out.method = String(args.shift() || 'POST').toUpperCase();
      continue;
    }
    if (token === '--stdin') {
      out.stdin = true;
      continue;
    }
    if (token === '--raw') {
      out.raw = true;
      continue;
    }
    if (token === '--help' || token === '-h') {
      out.help = true;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  return out;
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8').trim();
}

function safeJsonParse(text, label = 'JSON') {
  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(`Invalid ${label}: ${error.message}`);
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help || !opts.endpoint) {
    printUsage();
    process.exit(opts.help ? 0 : 1);
  }

  if (!API_KEY) {
    throw new Error('Missing PHAYA_API_KEY (or OPENAI_API_KEY fallback)');
  }

  const endpoint = opts.endpoint.replace(/^\/+/, '');
  const url = `${DEFAULT_BASE_URL.replace(/\/$/, '')}/${endpoint}`;

  const bodyText = opts.stdin ? await readStdin() : (opts.bodyText || '{}');
  const payload = safeJsonParse(bodyText, 'request body');

  const res = await fetch(url, {
    method: opts.method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: opts.method === 'GET' ? undefined : JSON.stringify(payload),
  });

  const responseText = await res.text();

  if (opts.raw) {
    process.stdout.write(responseText);
    process.exit(res.ok ? 0 : 1);
  }

  let parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    parsed = { raw: responseText };
  }

  const output = {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    url,
    method: opts.method,
    data: parsed,
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);

  if (!res.ok) process.exit(1);
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
