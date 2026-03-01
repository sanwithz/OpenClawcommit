// // ─── CONFIG ───────────────────────────────────────────────────────────────
// var calendars = [
//   { id: '6da4d7a19d6ba0c1c41861df9e086a988cc43d48374155790889d8e460bdf996@group.calendar.google.com', name: 'A-Level' },
//   { id: '5d0974c4e747889ee29fac675b6f34b2c12315a92e212a0c751bd318cb63e05f@group.calendar.google.com', name: 'คอร์ส ม.1' },
//   { id: '459e32cae0e76ac31ec7de7ae84807ec85dfeead6e873d411ed8caed21e48fbd@group.calendar.google.com', name: 'คอร์ส ม.4' },
//   { id: '6ae61630807a1a0a169f82155ad41bb33e93d3e1887602e6d47d9465168d41b3@group.calendar.google.com', name: 'คอร์ส ม.5' },
//   { id: '6e6ede5e4e2e73de62d53ed8bf67e1a830e604a3ceaab0d0b3dbae82454f9eb9@group.calendar.google.com', name: 'คอร์ส ม.6' },
//   // …add More
// ];


// var telegramToken = "8020047301:AAGfwz4L--nD6DWCZoN9u9JEVJnsH3c-B8o";  // Telegram bot token
// var chatId = "6796212791";  // Telegram chat ID

// // ─── CONFIG END ────────────────────────────────────────────────────────────


// // This is the entry-point you trigger daily
// function dailyEventMessage() {
//   var today       = new Date();
//   var messages    = calendars.map(function(cal) {
//     return getEventMessage(today, cal);
//   });
//   var fullMessage = messages.join('\n\n');  // separate each calendar block
//   Logger.log(fullMessage);
//   sendTelegramNotify(fullMessage);
// }



// function getEventMessage(date, cal) {
//   var calendar   = CalendarApp.getCalendarById(cal.id);
//   var events     = calendar.getEventsForDay(date);
//   var formatted  = date.toLocaleDateString('th-TH', {
//     day: 'numeric', month: 'long', year: 'numeric'
//   });
  
//   // Header with calendar name
//   var msg = '📣 ปฏิทิน: *' + cal.name + '*\n';
  
//   if (events.length === 0) {
//     msg += '  ไม่มีรายการในวันที่ ' + formatted;
//     return msg;
//   }
  
//   msg += '  แจ้งเตือนภารกิจของวันที่ ' + formatted +
//          '\n  🔶 มีทั้งหมด ' + events.length + ' กิจกรรม';
  
//   events.forEach(function(ev, i) {
//     var start = Utilities.formatDate(ev.getStartTime(),
//                  Session.getScriptTimeZone(), 'HH:mm');
//     var end   = Utilities.formatDate(ev.getEndTime(),
//                  Session.getScriptTimeZone(), 'HH:mm');
    
//     msg += '\n' + (i+1) + '. 📁 ' + ev.getTitle() +
//            '\n    ⏰ ' + start + '‑' + end +
//            '\n    📍 ' + (ev.getDescription() || '-');
//   });
  
//   return msg;
// }


// // Send the composed message to Telegram
// function sendTelegramNotify(message) {
//   var url     = 'https://api.telegram.org/bot' + telegramToken + '/sendMessage';
//   var payload = {
//     chat_id:    chatId,
//     text:       message,
//     parse_mode: 'Markdown'
//   };
//   var options = {
//     method:      'post',
//     contentType: 'application/json',
//     payload:     JSON.stringify(payload)
//   };
//   UrlFetchApp.fetch(url, options);
// }
