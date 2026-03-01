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
  { id: '18be9550758a687323cacc3332a650e4234a65a3df7eec50b90dfbafd41aafd5@group.calendar.google.com', name: 'คอร์สเตรียมสอบ สอวน.' }
];

// Minion | Shrimp world
const TELEGRAM_BOT_TOKEN = '8020047301:AAGfwz4L--nD6DWCZoN9u9JEVJnsH3c-B8o';
const TELEGRAM_CHAT_ID = '-1003841695178';

function doGet(e) {
  const p = (e && e.parameter) ? e.parameter : {};
  const range = resolveRange_(p);
  const result = getEvents_(range.start, range.end, p.calendarId || '');
  return ContentService.createTextOutput(JSON.stringify(result, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

function resolveRange_(p) {
  const now = new Date();

  if (p.start && p.end) {
    return {
      start: new Date(p.start + 'T00:00:00'),
      end: new Date(p.end + 'T23:59:59.999')
    };
  }

  if (p.date) {
    const d = new Date(p.date + 'T00:00:00');
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    return { start: d, end: end };
  }

  const days = Math.max(1, Math.min(31, Number(p.days || 1)));
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + (days - 1));
  end.setHours(23, 59, 59, 999);
  return { start: start, end: end };
}

function getEvents_(start, end, singleCalendarId) {
  const tz = Session.getScriptTimeZone();
  const selected = singleCalendarId
    ? calendars.filter(c => c.id === singleCalendarId)
    : calendars;

  const calendarsOut = selected.map(cal => {
    try {
      const c = CalendarApp.getCalendarById(cal.id);
      if (!c) {
        return { id: cal.id, name: cal.name, count: 0, events: [], error: 'No access or not found' };
      }

      const events = c.getEvents(start, end).map(ev => ({
        id: ev.getId(),
        title: ev.getTitle(),
        description: ev.getDescription() || '',
        location: ev.getLocation() || '',
        isAllDay: ev.isAllDayEvent(),
        start: ev.getStartTime().toISOString(),
        end: ev.getEndTime().toISOString(),
        startLocal: Utilities.formatDate(ev.getStartTime(), tz, 'yyyy-MM-dd HH:mm'),
        endLocal: Utilities.formatDate(ev.getEndTime(), tz, 'yyyy-MM-dd HH:mm'),
        startTimeOnly: Utilities.formatDate(ev.getStartTime(), tz, 'HH:mm'),
        endTimeOnly: Utilities.formatDate(ev.getEndTime(), tz, 'HH:mm'),
        calendarId: cal.id,
        calendarName: cal.name
      }));

      return { id: cal.id, name: cal.name, count: events.length, events: events };
    } catch (err) {
      return { id: cal.id, name: cal.name, count: 0, events: [], error: String(err) };
    }
  });

  const allEvents = calendarsOut.flatMap(x => x.events)
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  return {
    ok: true,
    tz,
    range: { start: start.toISOString(), end: end.toISOString() },
    summary: {
      calendarsSelected: selected.length,
      totalEvents: allEvents.length
    },
    calendars: calendarsOut,
    events: allEvents
  };
}

function buildDailySummaryText_(result) {
  if (!result || !result.ok) return 'ไม่สามารถดึงข้อมูลปฏิทินได้';

  const lines = [];
  lines.push(`• วันนี้มีทั้งหมด ${result.summary.totalEvents} กิจกรรม`);

  const activeCalendars = result.calendars.filter(c => c.count > 0);
  if (activeCalendars.length === 0) {
    lines.push('• วันนี้ไม่มีตารางสอน');
    return lines.join('\n');
  }

  activeCalendars.forEach(cal => {
    lines.push(`• อยู่ในปฏิทิน ${cal.name}`);
    lines.push('• รายการ:');
    cal.events.forEach(ev => {
      lines.push(`• ${ev.title}`);
      lines.push(`• เวลา ${ev.startTimeOnly}–${ev.endTimeOnly}`);
    });
  });

  return lines.join('\n');
}

function sendTelegramMessage_(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text
    }),
    muteHttpExceptions: true
  });
}

function sendDailyCalendarSummary() {
  const range = resolveRange_({ days: 1 });
  const result = getEvents_(range.start, range.end, '');
  const msg = buildDailySummaryText_(result);
  sendTelegramMessage_(msg);
}

function setupDaily6AMTrigger() {
  const target = 'sendDailyCalendarSummary';
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === target) ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger(target)
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .nearMinute(0)
    .inTimezone('Asia/Bangkok')
    .create();
}
