const APP = {
  NAME: 'Contact Form PDF Mailer',
  SHEET_NAME: 'Submissions',
  // ตามที่ผู้ใช้ระบุ
  RECIPIENT_EMAIL: 'sanwithz@gmai.com',
};

class Utils {
  constructor() {
    this.ss = SpreadsheetApp.getActive();
  }

  getOrCreateSheet(name) {
    let ws = this.ss.getSheetByName(name);
    if (!ws) ws = this.ss.insertSheet(name);
    return ws;
  }

  ensureHeaders(ws, headers) {
    if (ws.getLastRow() === 0) ws.appendRow(headers);
  }

  timestamp() {
    return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  }
}

class App {
  constructor() {
    this.utils = new Utils();
  }

  doGet() {
    return HtmlService.createTemplateFromFile('form')
      .evaluate()
      .setTitle(APP.NAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  submit(payload) {
    const data = JSON.parse(payload || '{}');
    const name = (data.name || '').trim();
    const phone = (data.phone || '').trim();
    const email = (data.email || '').trim();

    if (!name || !phone || !email) {
      throw new Error('กรอกข้อมูลไม่ครบ (ชื่อ, เบอร์โทร, อีเมล)');
    }

    // 1) Save to sheet
    const ws = this.utils.getOrCreateSheet(APP.SHEET_NAME);
    this.utils.ensureHeaders(ws, ['Timestamp', 'Name', 'Phone', 'Email']);
    ws.appendRow([this.utils.timestamp(), name, phone, email]);

    // 2) Build PDF
    const template = HtmlService.createTemplateFromFile('pdf');
    template.name = name;
    template.phone = phone;
    template.email = email;
    template.generatedAt = this.utils.timestamp();

    const html = template.evaluate().getContent();
    const blob = Utilities.newBlob(html, 'text/html', `submission-${name}.html`)
      .getAs(MimeType.PDF)
      .setName(`submission-${name}-${Date.now()}.pdf`);

    // 3) Send email with PDF
    GmailApp.sendEmail(
      APP.RECIPIENT_EMAIL,
      `New Submission: ${name}`,
      `มีข้อมูลใหม่จากฟอร์ม\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`,
      { attachments: [blob] }
    );

    return {
      ok: true,
      message: 'บันทึกข้อมูล + สร้าง PDF + ส่งอีเมลเรียบร้อย',
      sentTo: APP.RECIPIENT_EMAIL,
    };
  }
}

const _app = new App();
const doGet = () => _app.doGet();
const submit = (payload) => _app.submit(payload);
