#!/usr/bin/env node
import http from 'node:http';

const PORT = Number(process.env.SIM_ALERT_BRIDGE_PORT || 8787);
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const GROUP_ID = process.env.TELEGRAM_GROUP_ID || '-1003841695178';
const SIM_URL = process.env.SIMULATION_URL || 'http://127.0.0.1:5500/Trading%20Simulator/index.html';

let lastAlert = null;
let lastSentAt = 0;
const cooldownMs = Number(process.env.ALERT_COOLDOWN_MS || 60_000);

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

async function sendTelegramAlert(payload) {
  if (!TOKEN) throw new Error('Missing TELEGRAM_BOT_TOKEN');
  const alert = payload.alert || 'Indicator alert';
  const p = payload.position || null;

  let text = `🚨 <b>Simulation Indicator Alert</b>\n${alert}`;
  if (p) {
    text += `\n\nSide: <b>${p.side}</b>`;
    text += `\nSL: <b>${Number(p.stopLoss).toFixed(1)}</b>`;
    text += `\nTP: <b>${Number(p.takeProfit).toFixed(1)}</b>`;
    text += `\nRR: <b>1:${p.rr}</b>`;
  }

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: GROUP_ID,
      text,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: '📈 Open Simulation', url: payload.simulationUrl || SIM_URL }]],
      },
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Telegram API ${res.status}: ${detail}`);
  }
}

async function sendTelegramPhoto(buffer, caption) {
  if (!TOKEN) throw new Error('Missing TELEGRAM_BOT_TOKEN');

  const form = new FormData();
  form.append('chat_id', GROUP_ID);
  form.append('photo', new Blob([buffer], { type: 'image/png' }), 'chart.png');
  form.append('caption', caption || 'Trading Simulator Chart');
  form.append('parse_mode', 'HTML');
  form.append('reply_markup', JSON.stringify({
    inline_keyboard: [[{ text: '📈 Open Simulation', url: SIM_URL }]],
  }));

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Telegram API ${res.status}: ${detail}`);
  }
}

function readBodyBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function parseMultipart(body, boundary) {
  const parts = [];
  const sep = `--${boundary}`;
  const lines = body.toString('binary').split(sep);
  for (const part of lines) {
    const trimmed = part.trim();
    if (!trimmed || trimmed === '--') continue;
    const headerEnd = trimmed.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;
    const headers = trimmed.slice(0, headerEnd);
    const content = Buffer.from(trimmed.slice(headerEnd + 4, trimmed.length - 2), 'binary');
    const nameMatch = /name="([^"]+)"/.exec(headers);
    const filenameMatch = /filename="([^"]*)"/.exec(headers);
    parts.push({
      name: nameMatch?.[1] || '',
      filename: filenameMatch?.[1] || '',
      content,
    });
  }
  return parts;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'sim-alert-bridge', port: PORT }));
    return;
  }

  if (req.method === 'POST' && req.url === '/indicator-alert') {
    try {
      const payload = await readJson(req);
      const alert = payload.alert || '';
      const now = Date.now();

      if (!alert) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'missing alert' }));
        return;
      }

      if (alert === lastAlert && now - lastSentAt < cooldownMs) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, skipped: 'duplicate cooldown' }));
        return;
      }

      await sendTelegramAlert(payload);
      lastAlert = alert;
      lastSentAt = now;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  if (req.method === 'POST' && req.url === '/screenshot') {
    try {
      const contentType = req.headers['content-type'] || '';
      const boundaryMatch = /boundary=([^;]+)/.exec(contentType);
      if (!boundaryMatch) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'missing boundary' }));
        return;
      }

      const body = await readBodyBuffer(req);
      const parts = parseMultipart(body, boundaryMatch[1].trim());
      const imagePart = parts.find(p => p.name === 'image');
      const captionPart = parts.find(p => p.name === 'caption');
      const caption = captionPart ? captionPart.content.toString('utf8') : 'Trading Simulator Chart';

      if (!imagePart || !imagePart.content.length) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'missing image' }));
        return;
      }

      await sendTelegramPhoto(imagePart.content, caption);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: false, error: 'not found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`sim-alert-bridge listening at http://127.0.0.1:${PORT}`);
  console.log(`group: ${GROUP_ID}`);
});
