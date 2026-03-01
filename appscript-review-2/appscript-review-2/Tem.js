// // ─── CONFIG ───────────────────────────────────────────────────────────────
// const calendars = [
//   { id: '6da4d7a19d6ba0c1c41861df9e086a988cc43d48374155790889d8e460bdf996@group.calendar.google.com', name: 'A-Level' },
//   // { id: '6da4d7a19d6ba0c1c41861df9e086a988cc43d48374155790889d8e460bdf996@group.calendar.google.com', name: 'สอวน' },
//   { id: '5d0974c4e747889ee29fac675b6f34b2c12315a92e212a0c751bd318cb63e05f@group.calendar.google.com', name: 'คอร์ส ม.1' },
//   // { id: '5d0974c4e747889ee29fac675b6f34b2c12315a92e212a0c751bd318cb63e05f@group.calendar.google.com', name: 'คอร์ส ม.2' },
//   // { id: '5d0974c4e747889ee29fac675b6f34b2c12315a92e212a0c751bd318cb63e05f@group.calendar.google.com', name: 'คอร์ส ม.3' },
//   { id: 'ac26cfa6216759ecc91b85222833d43775cc3318e0bf2ceae30c191e33a2de4b@group.calendar.google.com', name: 'คอร์ส ม.4' },
//   { id: '6ae61630807a1a0a169f82155ad41bb33e93d3e1887602e6d47d9465168d41b3@group.calendar.google.com', name: 'คอร์ส ม.5' },
//   { id: '6e6ede5e4e2e73de62d53ed8bf67e1a830e604a3ceaab0d0b3dbae82454f9eb9@group.calendar.google.com', name: 'คอร์ส ม.6' },
//   { id: '459e32cae0e76ac31ec7de7ae84807ec85dfeead6e873d411ed8caed21e48fbd@group.calendar.google.com', name: 'คอร์สสอบเข้า ม.1' },
//   { id: '459e32cae0e76ac31ec7de7ae84807ec85dfeead6e873d411ed8caed21e48fbd@group.calendar.google.com', name: 'คอร์สสอบเข้า ม.4' },
//   // …add more
// ];

// var telegramToken = "8097021542:AAG-5mvgzQzhXRZFiyuw4ibfMMMb8ZE9vQg";  // Telegram bot token
// var chatId = "6796212791";  // Telegram chat ID

// // ─── CONFIG END ────────────────────────────────────────────────────────────



// function dailyEventMessage() {
//   const now = new Date(), tz = Session.getScriptTimeZone();
//   const fmtD = d => d.toLocaleDateString('th-TH', { day:'numeric', month:'long', year:'numeric' });
//   const fmtT = dt => Utilities.formatDate(dt, tz, 'HH:mm');

//   const text = calendars.map(c => {
//     const evs = CalendarApp.getCalendarById(c.id).getEventsForDay(now);
//     const header = `📣 ปฏิทิน: *${c.name}*`;
//     const info = evs.length
//       ? `แจ้งเตือน ${fmtD(now)} \n  🔶 มีทั้งหมด ${evs.length} กิจกรรม`
//       : `ไม่มีรายการ ${fmtD(now)}`;
//     const details = evs.map((e, i) =>
//       `${i+1}. 📁 ${e.getTitle()}
//    ⏰ ${fmtT(e.getStartTime())}-${fmtT(e.getEndTime())}
//    📍 ${e.getDescription()||'-'}`
//     ).join('\n');
//     return [header, info, details].filter(Boolean).join('\n');
//   }).join('\n\n');

//   UrlFetchApp.fetch(
//     `https://api.telegram.org/bot${telegramToken}/sendMessage`,
//     {
//       method: 'post',
//       contentType: 'application/json',
//       payload: JSON.stringify({
//         chat_id: chatId,
//         text,
//         parse_mode: 'Markdown'
//       })
//     }
//   );
// }
