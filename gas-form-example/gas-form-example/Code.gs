const SHEET_NAME = 'Responses';
const PROP_SHEET_ID = 'FORM_SHEET_ID';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Kru Bank Form')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function submitForm(payload) {
  try {
    if (!payload || !payload.fullName || !payload.email || !payload.topic) {
      throw new Error('Missing required fields.');
    }

    const sheet = getOrCreateResponseSheet_();

    const id = Utilities.getUuid().slice(0, 8).toUpperCase();
    const ts = new Date();

    sheet.appendRow([
      id,
      ts,
      payload.fullName.trim(),
      payload.email.trim(),
      (payload.phone || '').trim(),
      payload.topic.trim(),
      (payload.message || '').trim(),
      'NEW'
    ]);

    MailApp.sendEmail({
      to: payload.email.trim(),
      subject: `Received: ${payload.topic} [${id}]`,
      htmlBody: `<p>Hi ${escapeHtml(payload.fullName)},</p><p>Thanks! We received your form.</p><p><b>Reference ID:</b> ${id}</p><p>We’ll get back to you soon.</p>`
    });

    return { ok: true, id };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function getOrCreateResponseSheet_() {
  const props = PropertiesService.getScriptProperties();
  let sheetId = props.getProperty(PROP_SHEET_ID);
  let ss;

  if (sheetId) {
    ss = SpreadsheetApp.openById(sheetId);
  } else {
    ss = SpreadsheetApp.create('Kru Bank Form Responses');
    props.setProperty(PROP_SHEET_ID, ss.getId());
  }

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'ID', 'Timestamp', 'Full Name', 'Email', 'Phone', 'Topic', 'Message', 'Status'
    ]);
  }

  return sheet;
}

function getResponseSheetUrl() {
  const id = PropertiesService.getScriptProperties().getProperty(PROP_SHEET_ID);
  if (!id) return 'Not created yet. Submit the form once first.';
  return `https://docs.google.com/spreadsheets/d/${id}/edit`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
