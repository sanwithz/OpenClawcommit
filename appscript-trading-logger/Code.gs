const CONFIG = {
  SHEET_ID: '1CLvA2dvl420BK8Csdy9i7ca3SKm7fgj64MG7P1uE4Yg',
  TZ: 'Asia/Bangkok',
  SHEET_NAME: 'Trades'
};

function doGet(e) {
  const p = (e && e.parameter) ? e.parameter : {};
  const action = String(p.action || 'list').toLowerCase();

  if (action === 'list') {
    return json_({ ok: true, trades: listTrades_() });
  }

  if (action === 'stats') {
    return json_({ ok: true, stats: getStats_() });
  }

  return json_({ ok: false, error: 'Unsupported action', action });
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = String(body.action || '').toLowerCase();

    if (action === 'add') {
      const id = addTrade_(body.trade);
      return json_({ ok: true, id, message: 'Trade added' });
    }

    if (action === 'update') {
      const updated = updateTrade_(body.id, body.trade);
      return json_({ ok: updated, message: updated ? 'Trade updated' : 'Trade not found' });
    }

    if (action === 'delete') {
      const deleted = deleteTrade_(body.id);
      return json_({ ok: deleted, message: deleted ? 'Trade deleted' : 'Trade not found' });
    }

    if (action === 'setup') {
      setupSheet_();
      seedInitialData_();
      return json_({ ok: true, message: 'Sheet initialized with seed data', sheetUrl: `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/edit` });
    }

    return json_({ ok: false, error: 'Unsupported action', action });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function setupSheet_() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  ensureSheet_(ss, CONFIG.SHEET_NAME, [
    'id', 'createdAt', 'dt', 'symbol', 'side', 'entry', 'exit', 'pnl', 'note'
  ]);
}

function seedInitialData_() {
  const sh = sheet_();
  const values = sh.getDataRange().getValues();
  
  // Only seed if sheet is empty (just headers)
  if (values.length <= 1) {
    const seedTrades = [
      {
        id: 'TRD-SEED-001',
        createdAt: now_(),
        dt: '2025-08-21T14:00:00',
        symbol: 'BTCUSDT',
        side: 'SHORT',
        entry: 0,
        exit: 0,
        pnl: 0,
        note: 'Win trade - screenshot saved: file_8---22247abe-ab67-4748-b62c-42cf6acf58e4.jpg'
      },
      {
        id: 'TRD-SEED-002',
        createdAt: now_(),
        dt: '2026-02-23T07:49:00',
        symbol: 'BTCUSDT',
        side: 'SHORT',
        entry: 67653.29,
        exit: 67061.4,
        pnl: 15.38,
        note: 'First logged win (+15.38 USDT)'
      }
    ];
    
    for (const t of seedTrades) {
      sh.appendRow([
        t.id, t.createdAt, t.dt, t.symbol, t.side, t.entry, t.exit, t.pnl, t.note
      ]);
    }
  }
}

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);

  const existing = sh.getLastRow() >= 1 ? sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), headers.length)).getValues()[0] : [];
  const needsHeader = headers.some((h, i) => existing[i] !== h);
  if (needsHeader) {
    sh.clearContents();
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
  }
}

function listTrades_() {
  const sh = sheet_();
  const values = sh.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  return values.slice(1).map(row => ({
    id: row[0],
    createdAt: row[1],
    dt: row[2],
    symbol: row[3],
    side: row[4],
    entry: Number(row[5]) || 0,
    exit: Number(row[6]) || 0,
    pnl: Number(row[7]) || 0,
    note: row[8] || ''
  })).sort((a, b) => new Date(b.dt) - new Date(a.dt));
}

function addTrade_(trade) {
  const sh = sheet_();
  const id = 'TRD-' + Utilities.getUuid().slice(0, 8).toUpperCase();
  sh.appendRow([
    id,
    now_(),
    trade.dt || now_(),
    trade.symbol || 'BTCUSDT',
    trade.side || 'LONG',
    Number(trade.entry) || 0,
    Number(trade.exit) || 0,
    Number(trade.pnl) || 0,
    trade.note || ''
  ]);
  return id;
}

function updateTrade_(id, trade) {
  const sh = sheet_();
  const data = sh.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][0]) === String(id)) {
      const row = r + 1;
      if (trade.dt !== undefined) sh.getRange(row, 3).setValue(trade.dt);
      if (trade.symbol !== undefined) sh.getRange(row, 4).setValue(trade.symbol);
      if (trade.side !== undefined) sh.getRange(row, 5).setValue(trade.side);
      if (trade.entry !== undefined) sh.getRange(row, 6).setValue(Number(trade.entry));
      if (trade.exit !== undefined) sh.getRange(row, 7).setValue(Number(trade.exit));
      if (trade.pnl !== undefined) sh.getRange(row, 8).setValue(Number(trade.pnl));
      if (trade.note !== undefined) sh.getRange(row, 9).setValue(trade.note);
      return true;
    }
  }
  return false;
}

function deleteTrade_(id) {
  const sh = sheet_();
  const data = sh.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][0]) === String(id)) {
      sh.deleteRow(r + 1);
      return true;
    }
  }
  return false;
}

function getStats_() {
  const trades = listTrades_();
  const total = trades.length;
  const wins = trades.filter(t => t.pnl > 0).length;
  const totalPnl = trades.reduce((a, b) => a + b.pnl, 0);
  const avg = total ? (totalPnl / total) : 0;

  const dayPnl = {};
  for (const t of trades) {
    const k = t.dt.slice(0, 10);
    dayPnl[k] = (dayPnl[k] || 0) + t.pnl;
  }

  return {
    total,
    wins,
    losses: total - wins,
    winrate: total ? (wins / total * 100) : 0,
    totalPnl,
    avgPnl: avg,
    profitDays: Object.values(dayPnl).filter(p => p > 0).length,
    lossDays: Object.values(dayPnl).filter(p => p < 0).length
  };
}

function sheet_() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) throw new Error('Missing sheet: ' + CONFIG.SHEET_NAME + '. Run setup action first.');
  return sh;
}

function now_() {
  return Utilities.formatDate(new Date(), CONFIG.TZ, 'yyyy-MM-dd HH:mm:ss');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}
