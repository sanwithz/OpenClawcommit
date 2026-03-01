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

  // …add more
];

// var TOKEN = "8097021542:AAG-5mvgzQzhXRZFiyuw4ibfMMMb8ZE9vQg";  // Telegram bot token
// var CHAT_ID = "6796212791";  // Telegram chat ID


// ALPHA GROUP
const TOKEN     = '7428193893:AAFWPr3ubkhafGq27-ig3b6gxh_5-MzUuSw';
const CHAT_ID   = '-1002618393192';

// ─── CONFIG END ────────────────────────────────────────────────────────────

function dailyEventMessage() {
  const now = new Date(),
        tz  = Session.getScriptTimeZone(),
        fmtD = d => d.toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'}),
        fmtT = dt=>Utilities.formatDate(dt,tz,'HH:mm');

  const blocks = calendars.reduce((a,c)=>{
    const evs = CalendarApp.getCalendarById(c.id).getEventsForDay(now);
    if (!evs.length) return a;
    let b = `📣 ปฏิทิน: *${c.name}*\nแจ้งเตือน ${fmtD(now)} \n🔶 มีทั้งหมด ${evs.length} กิจกรรม`;
    evs.forEach((e,i)=>
      b+= `\n${i+1}. 📁 ${e.getTitle()}` +
          `\n   ⏰ ${fmtT(e.getStartTime())}-${fmtT(e.getEndTime())}` +
          `\n   📍 ${e.getDescription()||'-'}`
    );
    a.push(b);
    return a;
  },[]);

  const text = blocks.length
    ? blocks.join('\n\n')
    : 'วันนี้ไม่มีกิจกรรมการเรียนการสอน';

  UrlFetchApp.fetch(
    `https://api.telegram.org/bot${TOKEN}/sendMessage`,
    {
      method:'post',
      contentType:'application/json',
      payload: JSON.stringify({
        chat_id:CHAT_ID,
        text,
        parse_mode:'Markdown'
      })
    }
  );
}