// ─── CONFIG ───────────────────────────────────────────────────────────────
const calendars = [
  { id: '6da4d7a19d6ba0c1c41861df9e086a988cc43d48374155790889d8e460bdf996@group.calendar.google.com', name: 'คอร์สประถม' },
  { id: 'eb83d11d85fc5f71d74536203eace52a82ddc265c419221e125b1206ed265b8b@group.calendar.google.com', name: 'คอร์สสอบเข้า ม.1' },
  { id: '459e32cae0e76ac31ec7de7ae84807ec85dfeead6e873d411ed8caed21e48fbd@group.calendar.google.com', name: 'คอร์สสอบเข้า ม.4' },
  { id: '695804a3adc5419b76ed3ba2c5874c510ad9bb675882099a30e8d6dadccb4da0@group.calendar.google.com', name: 'คอร์สเรียนล่วงหน้า ม.1' },
  { id: '5d0974c4e747889ee29fac675b6f34b2c12315a92e212a0c751bd318cb63e05f@group.calendar.google.com', name: 'คอร์สเรียนล่วงหน้า ม.2' },
  { id: '669012299b6b52ffc6637f37bea13d29eb21fc056d6edc7a551548839fed916d@group.calendar.google.com', name: 'คอร์สเรียนล่วงหน้า ม.3' },
  { id: 'ac26cfa6216759ecc91b85222833d43775cc3318e0bf2ceae30c191e33a2de4b@group.calendar.google.com', name: 'คอร์สเรียนล่วงหน้า ม.4' },
  { id: '6ae61630807a1a0a169f82155ad41bb33e93d3e1887602e6d47d9465168d41b3@group.calendar.google.com', name: 'คอร์สเรียนล่วงหน้า ม.5' },
  { id: '6e6ede5e4e2e73de62d53ed8bf67e1a830e604a3ceaab0d0b3dbae82454f9eb9@group.calendar.google.com', name: 'คอร์สเรียนล่วงหน้า ม.6' },
  { id: '62581e8ad5cac0fe659ee09fe327797cd036bc4f04f2a4462fca1090e08e041d@group.calendar.google.com', name: 'คอร์สเตรียมสอบ A-level' },
  { id: 'cc44d7d4b20a282232f66c7b37e751a4099b0127f4b2a643d577214b5d5ab1d1@group.calendar.google.com', name: 'คอร์สเตรียมสอบ NETSAT' },
  { id: '18be9550758a687323cacc3332a650e4234a65a3df7eec50b90dfbafd41aafd5@group.calendar.google.com', name: 'คอร์สเตรียมสอบ สอวน.' },
];

const TOKEN = '8097021542:AAG-5mvgzQzhXRZFiyuw4ibfMMMb8ZE9vQg';
const CHAT_ID = '-1003841695178';
const OWNER_CHAT_ID = '6796212791';
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyhHGy-LL5Cjt1shRZtaq6Eqnb6NyxoPRxIsFdpnDb6V3xEsEsRNAH02sMuMpDpmGkOrw/exec';
// ─── CONFIG END ────────────────────────────────────────────────────────────

/**
 * Web API endpoint
 * Examples:
 *   ?mode=events&date=2026-02-21
 *   ?mode=events&start=2026-02-21&end=2026-02-28
 *   ?mode=events&days=7
 */
function doGet(e) {
  const p = (e && e.parameter) ? e.parameter : {};
  const mode = String(p.mode || 'events').toLowerCase();

  if (mode === 'events') {
    const range = resolveRange_(p);
    const data = getEventsJson_(range.start, range.end);
    return jsonOutput_(data);
  }

  return jsonOutput_({ ok: false, error: 'Unsupported mode', mode: mode });
}

function resolveRange_(p) {
  const tz = Session.getScriptTimeZone();
  const now = new Date();

  if (p.start && p.end) {
    const start = new Date(p.start + 'T00:00:00');
    const end = new Date(p.end + 'T23:59:59');
    return { start: start, end: end, tz: tz, source: 'start-end' };
  }

  if (p.date) {
    const d = new Date(p.date + 'T00:00:00');
    const start = new Date(d);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    return { start: start, end: end, tz: tz, source: 'date' };
  }

  const days = Math.max(1, Math.min(31, Number(p.days || 1)));
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + (days - 1));
  end.setHours(23, 59, 59, 999);

  return { start: start, end: end, tz: tz, source: 'days' };
}

function getEventsJson_(start, end) {
  const tz = Session.getScriptTimeZone();

  const calendarsOut = calendars.map(function(cal) {
    const calendar = CalendarApp.getCalendarById(cal.id);

    if (!calendar) {
      return {
        id: cal.id,
        name: cal.name,
        error: 'Calendar not found or no access',
        count: 0,
        events: []
      };
    }

    const events = calendar.getEvents(start, end).map(function(ev) {
      return {
        id: ev.getId(),
        title: ev.getTitle(),
        description: ev.getDescription() || '',
        location: ev.getLocation() || '',
        isAllDay: ev.isAllDayEvent(),
        start: ev.getStartTime().toISOString(),
        end: ev.getEndTime().toISOString(),
        startLocal: Utilities.formatDate(ev.getStartTime(), tz, 'yyyy-MM-dd HH:mm'),
        endLocal: Utilities.formatDate(ev.getEndTime(), tz, 'yyyy-MM-dd HH:mm'),
        calendarId: cal.id,
        calendarName: cal.name
      };
    });

    return {
      id: cal.id,
      name: cal.name,
      count: events.length,
      events: events
    };
  });

  const allEvents = calendarsOut
    .reduce(function(acc, c) { return acc.concat(c.events); }, [])
    .sort(function(a, b) { return new Date(a.start) - new Date(b.start); });

  return {
    ok: true,
    tz: tz,
    range: {
      start: start.toISOString(),
      end: end.toISOString()
    },
    summary: {
      calendars: calendarsOut.length,
      totalEvents: allEvents.length
    },
    calendars: calendarsOut,
    events: allEvents
  };
}

function jsonOutput_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

function dailyEventMessage() {
  sendTelegramMessage_(CHAT_ID, getAgendaText_(new Date()));
}

function doPost(e) {
  try {
    const update = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const msg = update.message || update.edited_message;
    if (!msg || !msg.text) return ok_();

    const chatId = msg.chat.id;
    const raw = (msg.text || '').trim();
    const text = raw.toLowerCase().split(' ')[0];
    const cmd = text.split('@')[0]; // support /today@botname in groups

    if (cmd === '/start') {
      sendTelegramMessage_(chatId, 'สวัสดีครับ ผม Orange 🍊\nคำสั่งที่ใช้ได้: /start /today /tomorrow /daily');
    } else if (cmd === '/today') {
      sendTelegramMessage_(chatId, getAgendaText_(new Date()));
    } else if (cmd === '/tomorrow') {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      sendTelegramMessage_(chatId, getAgendaText_(d));
    } else if (cmd === '/daily') {
      dailyEventMessage();
      sendTelegramMessage_(chatId, 'ส่งสรุปตารางวันนี้เข้า group หลักเรียบร้อย ✅');
    }

    return ok_();
  } catch (err) {
    Logger.log('doPost error: ' + err);
    return ok_();
  }
}

function getAgendaText_(targetDate) {
  const tz = Session.getScriptTimeZone();
  const fmtD = d => d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
  const fmtT = dt => Utilities.formatDate(dt, tz, 'HH:mm');

  const blocks = calendars.reduce((acc, cal) => {
    const evs = CalendarApp.getCalendarById(cal.id).getEventsForDay(targetDate);
    if (!evs.length) return acc;

    let b = `📣 ปฏิทิน: *${cal.name}*\nแจ้งเตือน ${fmtD(targetDate)}\n🔶 มีทั้งหมด ${evs.length} กิจกรรม`;
    evs.forEach((e, i) => {
      b += `\n${i + 1}. 📁 ${e.getTitle()}` +
           `\n   ⏰ ${fmtT(e.getStartTime())}-${fmtT(e.getEndTime())}` +
           `\n   📍 ${e.getDescription() || '-'}`;
    });

    acc.push(b);
    return acc;
  }, []);

  return blocks.length ? blocks.join('\n\n') : `วันนี้ไม่มีตาราง (${fmtD(targetDate)})`;
}

function sendTelegramMessage_(chatId, text) {
  UrlFetchApp.fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    })
  });
}

function setWebhook() {
  const res = UrlFetchApp.fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ url: WEBAPP_URL })
  });
  Logger.log(res.getContentText());
}

function setOrangeIdentity() {
  UrlFetchApp.fetch(`https://api.telegram.org/bot${TOKEN}/setMyName`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ name: 'Orange 🍊' })
  });

  UrlFetchApp.fetch(`https://api.telegram.org/bot${TOKEN}/setMyName`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ language_code: 'th', name: 'น้องส้ม 🍊' })
  });
}

function setCommands() {
  const commands = [
    { command: 'start', description: 'เริ่มใช้งาน Orange 🍊' },
    { command: 'today', description: 'ดูตารางวันนี้' },
    { command: 'tomorrow', description: 'ดูตารางพรุ่งนี้' },
    { command: 'daily', description: 'ส่งสรุปวันนี้เข้า group หลัก' }
  ];

  const res = UrlFetchApp.fetch(`https://api.telegram.org/bot${TOKEN}/setMyCommands`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ commands: commands })
  });
  Logger.log(res.getContentText());
}

function initOrangeBot() {
  setOrangeIdentity();
  setCommands();
  setWebhook();
}

// ---------- Daily accountability reminders ----------
function sendMorningPriorityPrompt() {
  const text = 'Good morning Kru Bank ☀️\nPlease send your top 3 priorities for today:\n1) ...\n2) ...\n3) ...';
  sendTelegramMessage_(OWNER_CHAT_ID, text);
  appendAccountabilityLog_('MORNING_PROMPT', text);
}

function sendEveningReviewPrompt() {
  const text = 'End-of-day check-in 🌙\nWhat got done today, what did not, and why?\n- Done:\n- Not done:\n- Why:\n- Carry over to tomorrow:';
  sendTelegramMessage_(OWNER_CHAT_ID, text);
  appendAccountabilityLog_('EVENING_PROMPT', text);
}

function setupDailyAccountabilityTriggers() {
  const keep = ['sendMorningPriorityPrompt', 'sendEveningReviewPrompt'];
  ScriptApp.getProjectTriggers().forEach(t => {
    const fn = t.getHandlerFunction();
    if (keep.indexOf(fn) > -1) ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger('sendMorningPriorityPrompt')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .nearMinute(30)
    .inTimezone('Asia/Bangkok')
    .create();

  ScriptApp.newTrigger('sendEveningReviewPrompt')
    .timeBased()
    .everyDays(1)
    .atHour(22)
    .nearMinute(0)
    .inTimezone('Asia/Bangkok')
    .create();
}

function sendDailyResearchBrief() {
  const brief = buildDailyResearchBrief_();
  sendTelegramMessage_(OWNER_CHAT_ID, brief.text);
  appendAccountabilityLog_('DAILY_RESEARCH', JSON.stringify(brief));
}

function setupDailyResearchTrigger() {
  const target = 'sendDailyResearchBrief';
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === target) ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger(target)
    .timeBased()
    .everyDays(1)
    .atHour(16) // afternoon
    .nearMinute(0)
    .inTimezone('Asia/Bangkok')
    .create();
}

function buildDailyResearchBrief_() {
  const topics = [
    {
      title: 'Machine Learning Workflow for a One-Person Business',
      why: 'Use ML where it removes repetitive decisions, not where it adds complexity.',
      actions: [
        'List 3 repetitive decisions you make daily (lead scoring, follow-up priority, schedule conflicts).',
        'Start with a simple rules + score model in Google Sheets before training anything heavy.',
        'Measure weekly: hours saved + conversion impact.'
      ],
      experiment: 'Build a lead-priority scorecard this week (0-100) and compare against manual prioritization.'
    },
    {
      title: 'Weekly Build Loop: Ship Better Systems with Less Context Switching',
      why: 'A fixed loop prevents decision fatigue and keeps projects moving.',
      actions: [
        'Monday: plan backlog, Tuesday–Thursday: build, Friday: review + cleanup.',
        'Limit active projects to max 3 to preserve execution quality.',
        'Use a strict definition of done with test steps + rollback notes.'
      ],
      experiment: 'Run a 7-day WIP limit and track done tasks vs previous week.'
    },
    {
      title: 'Client Operations SLA for Faster Response Without Burnout',
      why: 'Clear response windows increase trust and reduce reactive stress.',
      actions: [
        'Set response SLA bands: urgent 2h, normal 24h.',
        'Template common replies and automate first response acknowledgements.',
        'Use a daily 2x communication block instead of constant interruption.'
      ],
      experiment: 'Apply SLA tags to all inbound requests for one week and analyze delay patterns.'
    },
    {
      title: 'Revenue-Focused Task Triage',
      why: 'Not all productivity creates revenue; rank tasks by business impact.',
      actions: [
        'Score each task by revenue impact (R), urgency (U), strategic value (S).',
        'Prioritize highest R first when time is limited.',
        'Archive low-R busywork or automate it.'
      ],
      experiment: 'For 5 days, spend first 90 minutes only on top-R task.'
    },
    {
      title: 'Human + Agent Collaboration Protocol',
      why: 'Clear handoffs reduce back-and-forth and speed delivery.',
      actions: [
        'Always define: objective, inputs, constraints, done criteria.',
        'Batch tasks into mission packs with priority labels.',
        'Use nightly build reports with test instructions and next action.'
      ],
      experiment: 'Use mission-pack format for 1 week and count message reduction.'
    }
  ];

  const idx = Math.floor((new Date().getTime() / 86400000)) % topics.length;
  const pick = topics[idx];
  const text = [
    '📚 Daily Research Brief (Afternoon)',
    `Topic: ${pick.title}`,
    `Why it matters: ${pick.why}`,
    'Action plan:',
    `1) ${pick.actions[0]}`,
    `2) ${pick.actions[1]}`,
    `3) ${pick.actions[2]}`,
    `Today\'s experiment: ${pick.experiment}`
  ].join('\n');

  return { topic: pick.title, text: text };
}

function appendAccountabilityLog_(type, content) {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('Orange Accountability Log');
  let sh = ss.getSheetByName('DailyLog');
  if (!sh) {
    sh = ss.insertSheet('DailyLog');
    sh.appendRow(['Timestamp', 'Type', 'Content']);
  }
  sh.appendRow([new Date(), type, content]);
}

function ok_() {
  return ContentService.createTextOutput('ok');
}
