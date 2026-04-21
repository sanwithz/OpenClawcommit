#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

async function run(bin, args) {
  const { stdout, stderr } = await execFileAsync(bin, args, {
    timeout: 120000,
    maxBuffer: 1024 * 1024 * 4,
    env: {
      ...process.env,
      IMGBB_API_KEY: process.env.IMGBB_API_KEY || '115aad0d48571f740cf04ae968f12c16',
      PHAYA_API_KEY: process.env.PHAYA_API_KEY || 'pk_MU6zPtnaWXYHRBirWkASGiAQhOxEfeJpnQp9NgNmTLcLE7s5'
    }
  });
  return { stdout: stdout?.trim() || '', stderr: stderr?.trim() || '' };
}

async function main() {
  const filePath = process.argv[2];
  const duration = Number(process.argv[3] || '5');

  if (!filePath) {
    console.error(JSON.stringify({ ok: false, error: 'Usage: node scripts/phaya-image2video-from-file.mjs <filePath> [duration]' }, null, 2));
    process.exit(1);
  }

  const upload = await run('node', ['/Users/harvey/.openclaw/workspace/scripts/imgbb-upload.mjs', filePath]);
  const uploadJson = JSON.parse(upload.stdout);
  if (!uploadJson.ok || !uploadJson.imageUrl) {
    console.error(JSON.stringify({ ok: false, step: 'imgbb-upload', upload: uploadJson }, null, 2));
    process.exit(1);
  }

  const payload = JSON.stringify({ image_url: uploadJson.imageUrl, duration });
  const phaya = await run('/Users/harvey/.openclaw/workspace/scripts/phaya-image2video', [payload]);
  const phayaJson = JSON.parse(phaya.stdout);

  const output = {
    ok: !!phayaJson.ok,
    step: 'done',
    upload: {
      imageUrl: uploadJson.imageUrl,
      deleteUrl: uploadJson.deleteUrl || null,
    },
    phaya: phayaJson,
  };

  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
  if (!output.ok) process.exit(1);
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
