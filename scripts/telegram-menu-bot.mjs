#!/usr/bin/env node
/**
 * Telegram Bot Menu Handler
 * Handles /menu and botCM commands plus inline keyboard callbacks
 */

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const GROUP_ID = process.env.TELEGRAM_GROUP_ID || '-1003841695178';

const API_URL = `https://api.telegram.org/bot${TOKEN}`;

const MENU_ITEMS = {
  gold_price: {
    text: '🥇 หาราคาทอง',
    callback: 'gold_price'
  },
  trade_image: {
    text: '📊 เทรดผ่านรูปภาพ',
    callback: 'trade_image'
  },
  fallback_api: {
    text: '🔄 Fallback API',
    callback: 'fallback_api'
  },
  kanban_board: {
    text: '📋 บอร์ดงาน',
    callback: 'kanban_board'
  },
  trading_logger: {
    text: '📈 Trading Logger',
    callback: 'trading_logger'
  }
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

async function telegram(method, payload) {
  const res = await fetch(`${API_URL}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram API error (${method}): ${JSON.stringify(data)}`);
  }
  return data;
}

async function sendMessage(chatId, text, replyMarkup = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML'
  };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  return telegram('sendMessage', payload);
}

async function answerCallback(callbackId, text = '') {
  return telegram('answerCallbackQuery', {
    callback_query_id: callbackId,
    text: text || undefined
  });
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
  return `<b>🤖 OpenClaw Control Menu</b>\n\nเลือก action ที่ต้องการ:\n\n🥇 <b>หาราคาทอง</b>\nดึงราคาทองคำ + จับภาพหน้าจอส่งเข้ากลุ่ม\n\n📊 <b>เทรดผ่านรูปภาพ</b>\nอ่านภาพกราฟ/สลิปเทรด วิเคราะห์แผน + บันทึกผล\n\n🔄 <b>Fallback API</b>\nสลับโมเดลตาม chain: Claude → Codex → Kimi → OpenRouter → Kimi-coding\n\n📋 <b>บอร์ดงาน</b>\nKanban board สถานะงาน + Daily Summary + Export\n\n📈 <b>Trading Logger</b>\nบันทึกและดูสถิติการเทรด`;
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

function buildBotCMResponse(data) {
  switch (data) {
    case 'oc_status':
      return '📊 <b>Status</b>\n\nใน OpenClaw ให้ใช้:\n<code>/status</code>';
    case 'oc_tinystatus':
      return '📉 <b>TinyStatus</b>\n\nใช้:\n<code>/tinystatus</code>';
    case 'oc_model_kimi':
      return '🌙 <b>Switch to Kimi</b>\n\nใช้:\n<code>/model moonshot/kimi-k2.5</code>';
    case 'oc_model_sonnet':
      return '🧠 <b>Switch to Sonnet</b>\n\nใช้:\n<code>/model sonnet</code>';
    case 'oc_model_opus':
      return '🎯 <b>Switch to Opus</b>\n\nใช้:\n<code>/model anthropic/claude-opus-4</code>';
    case 'oc_model_gemini':
      return '💎 <b>Switch to Gemini</b>\n\nใช้:\n<code>/model gemini-flash</code>';
    case 'oc_plan':
      return '📝 <b>Plan First</b>\n\nพิมพ์ต่อได้เลย:\n<code>make a plan first, then implement</code>';
    case 'oc_reasoning':
      return '🧩 <b>Think Harder</b>\n\nใช้:\n<code>/reasoning</code>\nหรือบอกว่า <code>think harder</code>';
    case 'oc_browser':
      return '🌐 <b>Browser Mode</b>\n\nพิมพ์สิ่งที่ต้องการ เช่น:\n<code>open this site and click login</code>';
    case 'oc_agents':
      return '🤖 <b>Agents</b>\n\nพิมพ์เช่น:\n<code>run in claude code: review this repo</code>';
    case 'oc_backtrack':
      return '↩️ <b>Backtrack</b>\n\nพิมพ์:\n<code>ignore the last direction and go back one step</code>';
    case 'oc_cheatsheet':
      return '📚 <b>Cheatsheet</b>\n\nหลัก ๆ คือ:\n<code>/new</code> <code>/reset</code> <code>/status</code> <code>/tinystatus</code> <code>/model ...</code> <code>/reasoning</code>';
    case 'oc_newtask':
      return '🆕 <b>New Task</b>\n\nเริ่มงานใหม่ได้ด้วย:\n<code>/new</code>\nหรือพิมพ์โจทย์ใหม่มาได้เลย';
    case 'oc_help':
      return '❓ <b>Help</b>\n\nถ้าจะใช้งานแบบเร็ว:\n• <code>botCM</code> = เปิดปุ่มคำสั่ง\n• <code>/menu</code> = เมนูงาน\n• <code>/status</code> = สถานะ session';
    default:
      return '❌ ไม่รู้จักคำสั่งนี้';
  }
}

async function handleCallback(callbackQuery) {
  const { id: callbackId, message, data } = callbackQuery;
  const chatId = message.chat.id;

  await answerCallback(callbackId);

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
      responseText = `📋 <b>Kanban Board</b>\n\nไฟล์:\n• <code>kanban-board/index.html</code> - Daily Summary\n• <code>tasks/todo.md</code> - งานที่ต้องทำ\n• <code>tasks/lessons.md</code> - บทเรียน\n\nสถานะ:\n🟡 In Progress | 🟢 Done | 🔴 Blocked`;
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
    default:
      if (data.startsWith('oc_')) {
        responseText = buildBotCMResponse(data);
        additionalKeyboard = {
          inline_keyboard: [
            [{ text: '🔙 กลับ botCM', callback_data: 'back_to_botcm' }]
          ]
        };
      } else if (data === 'back_to_botcm') {
        await handleBotCMCommand(chatId);
        return;
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
