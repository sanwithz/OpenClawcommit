#!/usr/bin/env node
/**
 * Telegram Bot Menu Handler
 * Handles /menu command and inline keyboard callbacks
 */

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const GROUP_ID = process.env.TELEGRAM_GROUP_ID || '-1003841695178';

// Menu configuration
const MENU_ITEMS = {
  gold_price: {
    text: '🥇 หาราคาทอง',
    callback: 'gold_price',
    description: 'ดึงราคาทองคำล่าสุด + จับภาพหน้าจอ'
  },
  trade_image: {
    text: '📊 เทรดผ่านรูปภาพ',
    callback: 'trade_image',
    description: 'อ่านภาพกราฟ/สลิปเทรด วิเคราะห์ + บันทึกผล'
  },
  fallback_api: {
    text: '🔄 Fallback API',
    callback: 'fallback_api',
    description: 'สลับโมเดล API อัตโนมัติตาม chain'
  },
  kanban_board: {
    text: '📋 บอร์ดงาน',
    callback: 'kanban_board',
    description: 'ดูงานเสร็จ/งานถัดไป + Daily Summary'
  },
  trading_logger: {
    text: '📈 Trading Logger',
    callback: 'trading_logger',
    description: 'บันทึก/ดูสถิติการเทรด'
  }
};

const API_URL = `https://api.telegram.org/bot${TOKEN}`;

async function sendMessage(chatId, text, replyMarkup = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML'
  };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }
  
  const res = await fetch(`${API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram API error: ${err}`);
  }
  return res.json();
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
  return `<b>🤖 OpenClaw Control Menu</b>

เลือก action ที่ต้องการ:

🥇 <b>หาราคาทอง</b>
ดึงราคาทองคำ + จับภาพหน้าจอส่งเข้ากลุ่ม

📊 <b>เทรดผ่านรูปภาพ</b>
อ่านภาพกราฟ/สลิปเทรด วิเคราะห์แผน + บันทึกผล

🔄 <b>Fallback API</b>
สลับโมเดลตาม chain: Claude → Codex → Kimi → OpenRouter → Kimi-coding

📋 <b>บอร์ดงาน</b>
Kanban board สถานะงาน + Daily Summary + Export

📈 <b>Trading Logger</b>
บันทึกและดูสถิติการเทรด`;
}

async function handleMenuCommand(chatId) {
  await sendMessage(chatId, buildMenuText(), buildMenuKeyboard());
}

async function handleCallback(callbackQuery) {
  const { id: callbackId, message, data } = callbackQuery;
  const chatId = message.chat.id;
  
  // Answer callback to remove loading state
  await fetch(`${API_URL}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackId })
  });
  
  let responseText = '';
  let additionalKeyboard = null;
  
  switch (data) {
    case 'gold_price':
      responseText = `🥇 <b>หาราคาทอง</b>

กำลังดึงราคาทองคำล่าสุด...

💡 <i>Tip:</i> ส่งรูปภาพกราฟทองคำมา ผมจะวิเคราะห์ให้ทันที`;
      break;
      
    case 'trade_image':
      responseText = `📊 <b>เทรดผ่านรูปภาพ</b>

กรุณาส่ง:
• ภาพกราฟจาก TradingView
• สลิปเทรดจาก Binance
• ภาพอื่นที่เกี่ยวกับการเทรด

ผมจะวิเคราะห์และบันทึกผลให้อัตโนมัติ`;
      break;
      
    case 'fallback_api':
      responseText = `🔄 <b>Fallback API Chain</b>

ปัจจุบันใช้โมเดล: <code>gpt-5.3-codex</code>

ลำดับ Fallback:
1. Claude Sonnet 4-6 (primary)
2. Codex gpt-5.3-codex ✅
3. Kimi K2.5
4. OpenRouter free models
5. Kimi-coding K2.5

ระบบจะสลับอัตโนมัติเมื่อ quota หมด`;
      break;
      
    case 'kanban_board':
      responseText = `📋 <b>Kanban Board</b>

ไฟล์:
• <code>kanban-board/index.html</code> - Daily Summary
• <code>tasks/todo.md</code> - งานที่ต้องทำ
• <code>tasks/lessons.md</code> - บทเรียน

สถานะ:
🟡 In Progress | 🟢 Done | 🔴 Blocked`;
      additionalKeyboard = {
        inline_keyboard: [
          [{ text: '📂 เปิด Kanban', url: 'http://127.0.0.1:5500/kanban-board/index.html' }],
          [{ text: '🔙 กลับเมนูหลัก', callback_data: 'back_to_menu' }]
        ]
      };
      break;
      
    case 'trading_logger':
      responseText = `📈 <b>Trading Logger</b>

ระบบบันทึกการเทรด:
• ดูสถิติรายปี (dot visualization)
• Win/Loss ratio
• กำไร/ขาดทุนสะสม
• Export CSV

ส่งผลเทรดมา ผมจะบันทึกให้ทันที`;
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
      responseText = '❌ ไม่รู้จำคำสั่งนี้';
  }
  
  await sendMessage(chatId, responseText, additionalKeyboard);
}

// Poll for updates
let lastUpdateId = 0;

async function getUpdates() {
  try {
    const res = await fetch(`${API_URL}/getUpdates?offset=${lastUpdateId + 1}&limit=10`);
    const data = await res.json();
    
    if (!data.ok || !data.result.length) return;
    
    for (const update of data.result) {
      lastUpdateId = update.update_id;
      
      // Handle /menu command
      if (update.message?.text === '/menu') {
        await handleMenuCommand(update.message.chat.id);
      }
      
      // Handle callback queries
      if (update.callback_query) {
        await handleCallback(update.callback_query);
      }
    }
  } catch (e) {
    console.error('Poll error:', e.message);
  }
}

// Start polling
console.log('🤖 Telegram Menu Bot started');
console.log('Group:', GROUP_ID);
console.log('Commands: /menu');

setInterval(getUpdates, 2000);
getUpdates(); // Initial poll
