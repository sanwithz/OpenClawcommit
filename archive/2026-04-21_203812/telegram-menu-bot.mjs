#!/usr/bin/env node
/**
 * Telegram Bot Menu Handler
 * Handles /menu and botCM commands plus inline keyboard callbacks
 * botCM buttons now execute real OpenClaw CLI actions where possible.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const GROUP_ID = process.env.TELEGRAM_GROUP_ID || '-1003841695178';
const API_URL = `https://api.telegram.org/bot${TOKEN}`;
const OPENCLAW_BIN = 'openclaw';

const MENU_ITEMS = {
  gold_price: { text: '🥇 หาราคาทอง', callback: 'gold_price' },
  trade_image: { text: '📊 เทรดผ่านรูปภาพ', callback: 'trade_image' },
  fallback_api: { text: '🔄 Fallback API', callback: 'fallback_api' },
  kanban_board: { text: '📋 บอร์ดงาน', callback: 'kanban_board' },
  trading_logger: { text: '📈 Trading Logger', callback: 'trading_logger' }
};

const BOTCM_ITEMS = {
  status: { text: '📊 Status', callback: 'oc_status' },
  tinystatus: { text: '📉 TinyStatus', callback: 'oc_tinystatus' },
  kimi: { text: '🌙 Kimi', callback: 'oc_model_kimi' },
  sonnet: { text: '🧠 Sonnet', callback: 'oc_model_sonnet' },
  opus: { text: '🎯 Opus', callback: 'oc_model_opus' },
  gemini: { text: '💎 Gemini', callback: 'oc_model_gemini' },
  plan: { text: '📝 Plan First', callback: 'oc_plan' },
  think: { text: '🧩 Think Harder', callback: 'oc_reasoning' },
  browser: { text: '🌐 Browser', callback: 'oc_browser' },
  agents: { text: '🤖 Agents', callback: 'oc_agents' },
  backtrack: { text: '↩️ Backtrack', callback: 'oc_backtrack' },
  cheatsheet: { text: '📚 Cheatsheet', callback: 'oc_cheatsheet' },
  newtask: { text: '🆕 New Task', callback: 'oc_newtask' },
  help: { text: '❓ Help', callback: 'oc_help' }
};

const PHAYA_ITEMS = [
  { text: '🖼️ Image Generate', preset: 'image-generate', callback: 'phaya_image-generate' },
  { text: '🍌 Nano Banana 2', preset: 'nano-banana-2', callback: 'phaya_nano-banana-2' },
  { text: '🌈 Seedream 5', preset: 'seedream-5', callback: 'phaya_seedream-5' },
  { text: '🎵 Music Generate', preset: 'music-generate', callback: 'phaya_music-generate' },
  { text: '🗣️ TTS', preset: 'tts', callback: 'phaya_tts' },
  { text: '🎬 AI Video Sora2', preset: 'ai-video-sora2', callback: 'phaya_ai-video-sora2' },
  { text: '🎥 Sora2 T2V', preset: 'sora2-text2video', callback: 'phaya_sora2-text2video' },
  { text: '📹 Veo 3.1', preset: 'veo-3-1-video', callback: 'phaya_veo-3-1-video' },
  { text: '💃 Seedance', preset: 'seedance-video', callback: 'phaya_seedance-video' },
  { text: '🧠 Grok Video', preset: 'grok-imagine-video', callback: 'phaya_grok-imagine-video' },
  { text: '🎮 Kling Motion', preset: 'kling-motion-control', callback: 'phaya_kling-motion-control' },
  { text: '🧍 Sora2 Character', preset: 'sora2-character', callback: 'phaya_sora2-character' },
  { text: '⬇️ Download Video', preset: 'video-download', callback: 'phaya_video-download' },
  { text: '🇹🇭 Thai Subtitle', preset: 'thai-subtitle', callback: 'phaya_thai-subtitle' },
  { text: '🖼️➡️🎥 Image2Video', preset: 'image2video', callback: 'phaya_image2video', verified: true },
  { text: '🔊 Merge Audio', preset: 'merge-audio', callback: 'phaya_merge-audio' },
  { text: '🎞️+🔊 Merge AV', preset: 'merge-audio-video', callback: 'phaya_merge-audio-video' },
  { text: '📼 Merge Video', preset: 'merge-video', callback: 'phaya_merge-video' },
  { text: '✨ Overlay GIF', preset: 'overlay-gif', callback: 'phaya_overlay-gif' },
  { text: '🔤 Overlay Text', preset: 'overlay-text', callback: 'phaya_overlay-text' },
  { text: '🖼️ Last Frame', preset: 'extract-last-frame', callback: 'phaya_extract-last-frame' },
  { text: '🎞️ GIF', preset: 'video-to-gif', callback: 'phaya_video-to-gif' },
  { text: '📝 Transcribe', preset: 'transcribe', callback: 'phaya_transcribe' },
  { text: '📍 Job Status', preset: 'job-status', callback: 'phaya_job-status' }
];

const phayaWizardState = new Map();

async function telegram(method, payload) {
  const res = await fetch(`${API_URL}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram API error (${method}): ${JSON.stringify(data)}`);
  return data;
}

async function sendMessage(chatId, text, replyMarkup = null) {
  const payload = { chat_id: chatId, text, parse_mode: 'HTML' };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  return telegram('sendMessage', payload);
}

async function answerCallback(callbackId, text = '') {
  return telegram('answerCallbackQuery', {
    callback_query_id: callbackId,
    text: text || undefined
  });
}

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function runOpenClaw(args) {
  const { stdout, stderr } = await execFileAsync(OPENCLAW_BIN, args, {
    timeout: 30000,
    maxBuffer: 1024 * 1024
  });
  return { stdout: stdout?.trim() || '', stderr: stderr?.trim() || '' };
}

async function runOpenClawSafe(args) {
  try {
    const result = await runOpenClaw(args);
    return { ok: true, ...result };
  } catch (error) {
    return {
      ok: false,
      stdout: error?.stdout?.trim?.() || '',
      stderr: error?.stderr?.trim?.() || '',
      message: error?.message || String(error)
    };
  }
}

async function runScriptSafe(scriptName, jsonPayload) {
  try {
    const { stdout, stderr } = await execFileAsync(`/Users/harvey/.openclaw/workspace/scripts/${scriptName}`, [jsonPayload], {
      timeout: 120000,
      maxBuffer: 1024 * 1024 * 4,
      env: { ...process.env, PHAYA_API_KEY: process.env.PHAYA_API_KEY || 'pk_MU6zPtnaWXYHRBirWkASGiAQhOxEfeJpnQp9NgNmTLcLE7s5' }
    });
    return { ok: true, stdout: stdout?.trim() || '', stderr: stderr?.trim() || '' };
  } catch (error) {
    return {
      ok: false,
      stdout: error?.stdout?.trim?.() || '',
      stderr: error?.stderr?.trim?.() || '',
      message: error?.message || String(error)
    };
  }
}

function buildMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: MENU_ITEMS.gold_price.text, callback_data: MENU_ITEMS.gold_price.callback }],
      [{ text: MENU_ITEMS.trade_image.text, callback_data: MENU_ITEMS.trade_image.callback }],
      [{ text: MENU_ITEMS.fallback_api.text, callback_data: MENU_ITEMS.fallback_api.callback }],
      [
        { text: MENU_ITEMS.kanban_board.text, callback_data: MENU_ITEMS.kanban_board.callback },
        { text: MENU_ITEMS.trading_logger.text, callback_data: MENU_ITEMS.trading_logger.callback }
      ]
    ]
  };
}

function buildMenuText() {
  return `<b>🤖 OpenClaw Control Menu</b>\n\nเลือก action ที่ต้องการ:\n\n🥇 <b>หาราคาทอง</b>\nดึงราคาทองคำ + จับภาพหน้าจอส่งเข้ากลุ่ม\n\n📊 <b>เทรดผ่านรูปภาพ</b>\nอ่านภาพกราฟ/สลิปเทรด วิเคราะห์แผน + บันทึกผล\n\n🔄 <b>Fallback API</b>\nสลับโมเดลตาม chain\n\n📋 <b>บอร์ดงาน</b>\nKanban board สถานะงาน + Daily Summary + Export\n\n📈 <b>Trading Logger</b>\nบันทึกและดูสถิติการเทรด`;
}

function buildBotCMKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: BOTCM_ITEMS.status.text, callback_data: BOTCM_ITEMS.status.callback },
        { text: BOTCM_ITEMS.tinystatus.text, callback_data: BOTCM_ITEMS.tinystatus.callback }
      ],
      [
        { text: BOTCM_ITEMS.kimi.text, callback_data: BOTCM_ITEMS.kimi.callback },
        { text: BOTCM_ITEMS.sonnet.text, callback_data: BOTCM_ITEMS.sonnet.callback }
      ],
      [
        { text: BOTCM_ITEMS.opus.text, callback_data: BOTCM_ITEMS.opus.callback },
        { text: BOTCM_ITEMS.gemini.text, callback_data: BOTCM_ITEMS.gemini.callback }
      ],
      [
        { text: BOTCM_ITEMS.plan.text, callback_data: BOTCM_ITEMS.plan.callback },
        { text: BOTCM_ITEMS.think.text, callback_data: BOTCM_ITEMS.think.callback }
      ],
      [
        { text: BOTCM_ITEMS.browser.text, callback_data: BOTCM_ITEMS.browser.callback },
        { text: BOTCM_ITEMS.agents.text, callback_data: BOTCM_ITEMS.agents.callback }
      ],
      [
        { text: BOTCM_ITEMS.backtrack.text, callback_data: BOTCM_ITEMS.backtrack.callback },
        { text: BOTCM_ITEMS.cheatsheet.text, callback_data: BOTCM_ITEMS.cheatsheet.callback }
      ],
      [
        { text: BOTCM_ITEMS.newtask.text, callback_data: BOTCM_ITEMS.newtask.callback },
        { text: BOTCM_ITEMS.help.text, callback_data: BOTCM_ITEMS.help.callback }
      ]
    ]
  };
}

function buildBotCMText() {
  return `<b>🎛️ OpenClaw Command Menu</b>\n\nแตะปุ่มที่ต้องการได้เลย\n\n<b>Session</b>\n• Status / TinyStatus\n• New Task\n\n<b>Model</b>\n• Kimi / Sonnet / Opus / Gemini\n\n<b>Work</b>\n• Plan First\n• Think Harder\n• Browser\n• Agents\n\n<b>Control</b>\n• Backtrack\n• Cheatsheet\n• Help`;
}

async function handleMenuCommand(chatId) {
  await sendMessage(chatId, buildMenuText(), buildMenuKeyboard());
}

async function handleBotCMCommand(chatId) {
  await sendMessage(chatId, buildBotCMText(), buildBotCMKeyboard());
}

function buildPhayaKeyboard() {
  const rows = [];
  for (let i = 0; i < PHAYA_ITEMS.length; i += 2) {
    rows.push(PHAYA_ITEMS.slice(i, i + 2).map(item => ({ text: item.text, callback_data: item.callback })));
  }
  rows.push([{ text: '🔙 กลับ botCM', callback_data: 'back_to_botcm' }]);
  return { inline_keyboard: rows };
}

function buildPhayaText() {
  return `<b>🎛️ Phaya Media Tools</b>\n\nเลือกเครื่องมือที่ต้องการ แล้วผมจะส่ง format ตัวอย่างสำหรับใช้งานทันที\n\n• Image / Video / Audio / Subtitle / Transcribe\n• ใช้กับ preset scripts ที่สร้างไว้แล้ว`;
}

async function handlePhayaCommand(chatId) {
  await sendMessage(chatId, buildPhayaText(), buildPhayaKeyboard());
}

function getPhayaItemByPreset(preset) {
  return PHAYA_ITEMS.find(item => item.preset === preset);
}

function buildWizardPrompt(preset) {
  const prompts = {
    'image-generate': 'ส่ง JSON เช่น {"prompt":"A serene mountain landscape","aspect_ratio":"16:9"}',
    'nano-banana-2': 'ส่ง JSON เช่น {"prompt":"Cute orange cat astronaut","aspect_ratio":"1:1"}',
    'seedream-5': 'ส่ง JSON เช่น {"prompt":"Luxury modern house","aspect_ratio":"16:9"}',
    'music-generate': 'ส่ง JSON เช่น {"prompt":"Lo-fi chill beat for studying"}',
    'tts': 'ส่ง JSON เช่น {"text":"สวัสดีครับ"}',
    'ai-video-sora2': 'ส่ง JSON เช่น {"prompt":"Cinematic walk through Bangkok at night"}',
    'sora2-text2video': 'ส่ง JSON เช่น {"prompt":"Drone flyover of temples at sunrise"}',
    'veo-3-1-video': 'ส่ง JSON เช่น {"prompt":"Product ad for smartwatch"}',
    'seedance-video': 'ส่ง JSON เช่น {"prompt":"Stylized dance motion video"}',
    'grok-imagine-video': 'ส่ง JSON เช่น {"prompt":"Sci-fi city cinematic sequence"}',
    'kling-motion-control': 'ส่ง JSON เช่น {"image_url":"https://example.com/image.jpg","motion":"camera pan left"}',
    'sora2-character': 'ส่ง JSON เช่น {"prompt":"Anime hero turnaround"}',
    'video-download': 'ส่ง JSON เช่น {"url":"https://example.com/video.mp4"}',
    'thai-subtitle': 'ส่ง JSON เช่น {"video_url":"https://example.com/video.mp4"}',
    'merge-audio': 'ส่ง JSON เช่น {"audio_urls":["https://example.com/a.mp3","https://example.com/b.mp3"]}',
    'merge-audio-video': 'ส่ง JSON เช่น {"video_url":"https://example.com/video.mp4","audio_url":"https://example.com/audio.mp3"}',
    'merge-video': 'ส่ง JSON เช่น {"video_urls":["https://example.com/a.mp4","https://example.com/b.mp4"]}',
    'overlay-gif': 'ส่ง JSON เช่น {"video_url":"https://example.com/video.mp4","gif_url":"https://example.com/overlay.gif"}',
    'overlay-text': 'ส่ง JSON เช่น {"video_url":"https://example.com/video.mp4","text":"Hello world"}',
    'extract-last-frame': 'ส่ง JSON เช่น {"video_url":"https://example.com/video.mp4"}',
    'video-to-gif': 'ส่ง JSON เช่น {"video_url":"https://example.com/video.mp4"}',
    'transcribe': 'ส่ง JSON เช่น {"audio_url":"https://example.com/audio.mp3"}',
    'job-status': 'ส่ง JSON เช่น {"job_id":"YOUR_JOB_ID"}'
  };
  return prompts[preset] || 'ส่ง JSON payload สำหรับงานนี้มาได้เลย';
}

async function startPhayaWizard(chatId, preset) {
  phayaWizardState.set(String(chatId), { preset, startedAt: Date.now() });
  const item = getPhayaItemByPreset(preset);
  return `🧙 <b>Phaya Wizard: ${escapeHtml(item?.text || preset)}</b>\n\n${escapeHtml(buildWizardPrompt(preset))}\n\nส่งมาเป็น JSON ได้เลย แล้วผมจะยิงงานให้ทันที`;
}

async function maybeHandlePhayaWizardMessage(message) {
  const chatId = String(message.chat.id);
  const state = phayaWizardState.get(chatId);
  if (!state) return false;

  const text = String(message.text || '').trim();
  if (!text) return false;

  const scriptName = `phaya-${state.preset}`;
  const result = await runScriptSafe(scriptName, text);
  phayaWizardState.delete(chatId);

  if (result.ok) {
    await sendMessage(message.chat.id, `✅ <b>Phaya job submitted</b>\n\n<pre>${escapeHtml(result.stdout.slice(0, 3500))}</pre>`, {
      inline_keyboard: [[{ text: '🔙 กลับ Phaya', callback_data: 'back_to_phaya' }]]
    });
  } else {
    await sendMessage(message.chat.id, `❌ <b>Phaya wizard failed</b>\n\n<pre>${escapeHtml((result.stderr || result.stdout || result.message || '').slice(0, 3500))}</pre>`, {
      inline_keyboard: [[{ text: '🔙 กลับ Phaya', callback_data: 'back_to_phaya' }]]
    });
  }

  return true;
}

async function getTinyStatusText() {
  const status = await runOpenClawSafe(['status', '--usage', '--json']);
  if (!status.ok || !status.stdout) {
    return `📉 <b>TinyStatus</b>\n\nไม่สามารถดึงข้อมูลได้ตอนนี้\n<code>${escapeHtml(status.stderr || status.message || 'unknown error')}</code>`;
  }

  try {
    const data = JSON.parse(status.stdout);
    const recent = data?.sessions?.recent?.[0];
    if (!recent || recent.percentUsed == null || recent.remainingTokens == null || recent.contextTokens == null) {
      return `📉 <b>TinyStatus</b>\n\nยังไม่มีข้อมูล quota ล่าสุดพอให้คำนวณ`; 
    }

    const used = `${recent.percentUsed}%`;
    const left = `${100 - Number(recent.percentUsed)}%`;
    return [
      '📉 <b>TinyStatus</b>',
      '',
      `Used: ${escapeHtml(used)}`,
      `Left: ${escapeHtml(left)}`,
      `Context: ${escapeHtml(String(recent.remainingTokens))} / ${escapeHtml(String(recent.contextTokens))} left`,
      `Model: <code>${escapeHtml(recent.model || 'unknown')}</code>`
    ].join('\n');
  } catch (e) {
    return `📉 <b>TinyStatus</b>\n\nparse error\n<code>${escapeHtml(String(e))}</code>`;
  }
}

async function getStatusText() {
  const result = await runOpenClawSafe(['status', '--all']);
  const body = result.stdout || result.stderr || result.message || 'No output';
  return `<b>📊 OpenClaw Status</b>\n\n<pre>${escapeHtml(body.slice(0, 3500))}</pre>`;
}

async function switchModel(model) {
  const setRes = await runOpenClawSafe(['models', 'set', model]);
  if (!setRes.ok) {
    return `❌ <b>Switch model failed</b>\n\n<code>${escapeHtml(setRes.stderr || setRes.message)}</code>`;
  }

  const statusRes = await runOpenClawSafe(['models', 'status', '--plain']);
  const current = statusRes.stdout || model;
  return `✅ <b>Model switched</b>\n\nCurrent default model:\n<code>${escapeHtml(current)}</code>`;
}

async function executeBotCMAction(data) {
  switch (data) {
    case 'oc_status':
      return await getStatusText();

    case 'oc_tinystatus':
      return await getTinyStatusText();

    case 'oc_model_kimi':
      return await switchModel('moonshot/kimi-k2.5');

    case 'oc_model_sonnet':
      return await switchModel('sonnet');

    case 'oc_model_opus':
      return await switchModel('anthropic/claude-opus-4');

    case 'oc_model_gemini':
      return await switchModel('gemini-flash');

    case 'oc_plan':
      return '✅ <b>Plan mode ready</b>\n\nต่อจากนี้ส่งงานมาได้เลย\nผมจะวางแผนก่อนลงมือทำ';

    case 'oc_reasoning': {
      const res = await runOpenClawSafe(['config', 'set', 'agents.defaults.thinking', 'high']);
      if (!res.ok) {
        return `❌ <b>Think Harder failed</b>\n\n<code>${escapeHtml(res.stderr || res.message)}</code>`;
      }
      return '✅ <b>Think Harder enabled</b>\n\nตั้งค่า default thinking = <code>high</code> แล้ว';
    }

    case 'oc_browser':
      return '🌐 <b>Browser mode</b>\n\nส่งงานต่อได้เลย เช่น\n<code>open example.com and click login</code>';

    case 'oc_agents':
      return '🤖 <b>Agents mode</b>\n\nส่งงานต่อได้เลย เช่น\n<code>run in claude code: review this repo</code>';

    case 'oc_backtrack':
      return '↩️ <b>Backtrack</b>\n\nส่งข้อความต่อว่า\n<code>ignore the last direction and go back one step</code>';

    case 'oc_cheatsheet':
      return '📚 <b>Cheatsheet</b>\n\n<code>botCM</code>\n<code>/menu</code>\n<code>/status</code>\n<code>/tinystatus</code>\n<code>/model ...</code>\n<code>/reasoning</code>';

    case 'oc_newtask':
      return '🆕 <b>New Task</b>\n\nพิมพ์โจทย์ใหม่มาได้เลย — ผมจะถือว่าเป็นงานใหม่ทันที';

    case 'oc_help':
      return '❓ <b>Help</b>\n\n• <code>botCM</code> = เปิดปุ่มคำสั่ง\n• <code>/menu</code> = เมนูงาน\n• ปุ่ม model / status ตอนนี้สั่งงานจริงแล้ว';

    default:
      return '❌ ไม่รู้จักคำสั่งนี้';
  }
}

function buildPhayaExample(preset) {
  const examples = {
    'image-generate': `🖼️ <b>Image Generate</b>\n\n<code>scripts/phaya-image-generate '{"prompt":"A serene mountain landscape at sunset","aspect_ratio":"16:9"}'</code>`,
    'nano-banana-2': `🍌 <b>Nano Banana 2</b>\n\n<code>scripts/phaya-nano-banana-2 '{"prompt":"Cute orange cat astronaut","aspect_ratio":"1:1"}'</code>`,
    'seedream-5': `🌈 <b>Seedream 5.0</b>\n\n<code>scripts/phaya-seedream-5 '{"prompt":"Luxury modern house in tropical forest","aspect_ratio":"16:9"}'</code>`,
    'music-generate': `🎵 <b>Music Generate</b>\n\n<code>scripts/phaya-music-generate '{"prompt":"Lo-fi chill beat for studying"}'</code>`,
    'tts': `🗣️ <b>Text to Speech</b>\n\n<code>scripts/phaya-tts '{"text":"สวัสดีครับ"}'</code>`,
    'ai-video-sora2': `🎬 <b>AI Video Sora 2</b>\n\n<code>scripts/phaya-ai-video-sora2 '{"prompt":"A cinematic walk through neon Bangkok at night"}'</code>`,
    'sora2-text2video': `🎥 <b>Sora2 Text-to-Video</b>\n\n<code>scripts/phaya-sora2-text2video '{"prompt":"A drone flyover of temples at sunrise"}'</code>`,
    'veo-3-1-video': `📹 <b>Veo 3.1 Video</b>\n\n<code>scripts/phaya-veo-3-1-video '{"prompt":"Product ad for a smartwatch"}'</code>`,
    'seedance-video': `💃 <b>Seedance Video</b>\n\n<code>scripts/phaya-seedance-video '{"prompt":"Stylized dance motion video"}'</code>`,
    'grok-imagine-video': `🧠 <b>Grok Imagine Video</b>\n\n<code>scripts/phaya-grok-imagine-video '{"prompt":"Sci-fi city cinematic sequence"}'</code>`,
    'kling-motion-control': `🎮 <b>Kling Motion Control</b>\n\n<code>scripts/phaya-kling-motion-control '{"image_url":"https://example.com/image.jpg","motion":"camera pan left"}'</code>`,
    'sora2-character': `🧍 <b>Sora2 Character</b>\n\n<code>scripts/phaya-sora2-character '{"prompt":"Anime hero turnaround"}'</code>`,
    'video-download': `⬇️ <b>Download Video</b>\n\n<code>scripts/phaya-video-download '{"url":"https://example.com/video.mp4"}'</code>`,
    'thai-subtitle': `🇹🇭 <b>Thai Subtitle</b>\n\n<code>scripts/phaya-thai-subtitle '{"video_url":"https://example.com/video.mp4"}'</code>`,
    'image2video': `🖼️➡️🎥 <b>Image to Video</b>\n\n<code>scripts/phaya-image2video '{"image_url":"https://example.com/image.jpg","duration":5}'</code>`,
    'merge-audio': `🔊 <b>Merge Audio</b>\n\n<code>scripts/phaya-merge-audio '{"audio_urls":["https://example.com/a.mp3","https://example.com/b.mp3"]}'</code>`,
    'merge-audio-video': `🎞️+🔊 <b>Merge Audio + Video</b>\n\n<code>scripts/phaya-merge-audio-video '{"video_url":"https://example.com/video.mp4","audio_url":"https://example.com/audio.mp3"}'</code>`,
    'merge-video': `📼 <b>Merge Video</b>\n\n<code>scripts/phaya-merge-video '{"video_urls":["https://example.com/a.mp4","https://example.com/b.mp4"]}'</code>`,
    'overlay-gif': `✨ <b>Overlay GIF</b>\n\n<code>scripts/phaya-overlay-gif '{"video_url":"https://example.com/video.mp4","gif_url":"https://example.com/overlay.gif"}'</code>`,
    'overlay-text': `🔤 <b>Overlay Text</b>\n\n<code>scripts/phaya-overlay-text '{"video_url":"https://example.com/video.mp4","text":"Hello world"}'</code>`,
    'extract-last-frame': `🖼️ <b>Extract Last Frame</b>\n\n<code>scripts/phaya-extract-last-frame '{"video_url":"https://example.com/video.mp4"}'</code>`,
    'video-to-gif': `🎞️ <b>Video to GIF</b>\n\n<code>scripts/phaya-video-to-gif '{"video_url":"https://example.com/video.mp4"}'</code>`,
    'transcribe': `📝 <b>Transcribe</b>\n\n<code>scripts/phaya-transcribe '{"audio_url":"https://example.com/audio.mp3"}'</code>`,
    'job-status': `📍 <b>Job Status</b>\n\n<code>scripts/phaya-job-status '{"job_id":"YOUR_JOB_ID"}'</code>`
  };
  return examples[preset] || `❌ ไม่มีตัวอย่างสำหรับ <code>${escapeHtml(preset)}</code>`;
}

async function handleCallback(callbackQuery) {
  const { id: callbackId, message, data } = callbackQuery;
  const chatId = message.chat.id;

  await answerCallback(callbackId, 'Working...');

  let responseText = '';
  let additionalKeyboard = null;

  switch (data) {
    case 'gold_price':
      responseText = `🥇 <b>หาราคาทอง</b>\n\nกำลังดึงราคาทองคำล่าสุด...\n\n💡 <i>Tip:</i> ส่งรูปภาพกราฟทองคำมา ผมจะวิเคราะห์ให้ทันที`;
      break;

    case 'trade_image':
      responseText = `📊 <b>เทรดผ่านรูปภาพ</b>\n\nกรุณาส่ง:\n• ภาพกราฟจาก TradingView\n• สลิปเทรดจาก Binance\n• ภาพอื่นที่เกี่ยวกับการเทรด\n\nผมจะวิเคราะห์และบันทึกผลให้อัตโนมัติ`;
      break;

    case 'fallback_api':
      responseText = `🔄 <b>Fallback API Chain</b>\n\nปัจจุบันใช้โมเดล: <code>gpt-5.4</code>\n\nลำดับตัวอย่าง:\n1. GPT-5.4\n2. Kimi K2.5\n3. Sonnet\n4. Gemini`;
      break;

    case 'kanban_board':
      responseText = `📋 <b>Kanban Board</b>\n\nไฟล์:\n• <code>kanban-board/index.html</code>\n• <code>tasks/todo.md</code>\n• <code>tasks/lessons.md</code>\n\nสถานะ:\n🟡 In Progress | 🟢 Done | 🔴 Blocked`;
      additionalKeyboard = {
        inline_keyboard: [
          [{ text: '📂 เปิด Kanban', url: 'http://127.0.0.1:5500/kanban-board/index.html' }],
          [{ text: '🔙 กลับเมนูหลัก', callback_data: 'back_to_menu' }]
        ]
      };
      break;

    case 'trading_logger':
      responseText = `📈 <b>Trading Logger</b>\n\nระบบบันทึกการเทรด:\n• ดูสถิติรายปี\n• Win/Loss ratio\n• กำไร/ขาดทุนสะสม\n• Export CSV\n\nส่งผลเทรดมา ผมจะบันทึกให้ทันที`;
      additionalKeyboard = {
        inline_keyboard: [
          [{ text: '📂 เปิด Trading Logger', url: 'http://127.0.0.1:5500/kanban-board/trading-logger.html' }],
          [{ text: '🔙 กลับเมนูหลัก', callback_data: 'back_to_menu' }]
        ]
      };
      break;

    case 'back_to_menu':
      await handleMenuCommand(chatId);
      return;

    case 'back_to_botcm':
      await handleBotCMCommand(chatId);
      return;

    case 'back_to_phaya':
      await handlePhayaCommand(chatId);
      return;

    default:
      if (data.startsWith('oc_')) {
        responseText = await executeBotCMAction(data);
        additionalKeyboard = {
          inline_keyboard: [
            [{ text: '🔙 กลับ botCM', callback_data: 'back_to_botcm' }]
          ]
        };
      } else if (data.startsWith('phaya_')) {
        const preset = data.replace(/^phaya_/, '');
        const item = getPhayaItemByPreset(preset);
        if (item?.verified) {
          if (preset === 'image2video') {
            responseText = await startPhayaWizard(chatId, preset);
          } else {
            responseText = buildPhayaExample(preset);
          }
        } else {
          responseText = await startPhayaWizard(chatId, preset);
        }
        additionalKeyboard = {
          inline_keyboard: [
            [{ text: '🔙 กลับ Phaya', callback_data: 'back_to_phaya' }]
          ]
        };
      } else {
        responseText = '❌ ไม่รู้จำคำสั่งนี้';
      }
  }

  await sendMessage(chatId, responseText, additionalKeyboard);
}

let lastUpdateId = 0;

function isBotCMCommand(text = '') {
  const normalized = String(text || '').trim().toLowerCase();
  return normalized === 'botcm' || normalized === '/botcm';
}

function isPhayaCommand(text = '') {
  const normalized = String(text || '').trim().toLowerCase();
  return normalized === 'phaya' || normalized === '/phaya';
}

async function getUpdates() {
  try {
    const res = await fetch(`${API_URL}/getUpdates?offset=${lastUpdateId + 1}&limit=20`);
    const data = await res.json();
    if (!data.ok || !data.result.length) return;

    for (const update of data.result) {
      lastUpdateId = update.update_id;

      if (update.message?.text === '/menu') {
        await handleMenuCommand(update.message.chat.id);
      }

      if (isBotCMCommand(update.message?.text)) {
        await handleBotCMCommand(update.message.chat.id);
      }

      if (isPhayaCommand(update.message?.text)) {
        await handlePhayaCommand(update.message.chat.id);
      }

      if (update.callback_query) {
        await handleCallback(update.callback_query);
      }
    }
  } catch (e) {
    console.error('Poll error:', e.message);
  }
}

console.log('🤖 Telegram Menu Bot started');
console.log('Group:', GROUP_ID);
console.log('Commands: /menu, botCM');

setInterval(getUpdates, 2000);
getUpdates();
