#!/usr/bin/env node

import fs from 'node:fs';

const API_KEY = process.env.IMGBB_API_KEY || '115aad0d48571f740cf04ae968f12c16';
const EXPIRATION = process.env.IMGBB_EXPIRATION || '600';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error(JSON.stringify({ ok: false, error: 'Usage: node scripts/imgbb-upload.mjs <filePath>' }, null, 2));
    process.exit(1);
  }

  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');

  const form = new FormData();
  form.append('image', base64);

  const url = `https://api.imgbb.com/1/upload?expiration=${encodeURIComponent(EXPIRATION)}&key=${encodeURIComponent(API_KEY)}`;
  const res = await fetch(url, {
    method: 'POST',
    body: form,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  const output = {
    ok: res.ok && data?.success !== false,
    status: res.status,
    data,
    imageUrl: data?.data?.url || data?.data?.display_url || null,
    deleteUrl: data?.data?.delete_url || null,
  };

  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
  if (!output.ok) process.exit(1);
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
