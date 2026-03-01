/**
 * Orange Second Brain (Apps Script + Google Sheets)
 * DB Sheet: https://docs.google.com/spreadsheets/d/19F_83Rt3S59plQ4QHUMshj5YcHvIyfzcz3MQAH9kCNQ
 */

const CONFIG = {
  SHEET_ID: '19F_83Rt3S59plQ4QHUMshj5YcHvIyfzcz3MQAH9kCNQ',
  TZ: 'Asia/Bangkok',
  SHEETS: {
    MEMORIES: 'Memories',
    TASKS: 'Tasks',
    DECISIONS: 'Decisions',
    IDEAS: 'Ideas',
    PREFERENCES: 'Preferences',
    DAILY_LOG: 'DailyLog'
  }
};

function initDatabase() {
  setupSecondBrain_();
  setPreference_('ownerName', 'Kru Bank');
  setPreference_('assistantName', 'Orange 🍊');
  setPreference_('timezone', CONFIG.TZ);
  return { ok: true, message: 'Second Brain database initialized', sheetId: CONFIG.SHEET_ID };
}

function doGet(e) {
  const p = (e && e.parameter) ? e.parameter : {};
  const action = String(p.action || 'health').toLowerCase();

  if (action === 'health') {
    return json_({ ok: true, app: 'Orange Second Brain', time: new Date().toISOString() });
  }

  if (action === 'search') {
    const q = String(p.q || '').trim();
    const limit = clamp_(Number(p.limit || 20), 1, 100);
    return json_({ ok: true, query: q, results: searchMemories_(q, limit) });
  }

  if (action === 'dailybrief') {
    return json_({ ok: true, brief: getDailyBrief_() });
  }

  if (action === 'tasks') {
    return json_({ ok: true, tasks: listTasks_({ status: p.status || '' }) });
  }

  if (action === 'smart_tasks') {
    return json_({ ok: true, tasks: getSmartTaskSuggestions_({ status: p.status || '' }) });
  }

  return json_({ ok: false, error: 'Unsupported action', action });
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = String(body.action || '').toLowerCase();

    if (!action) return json_({ ok: false, error: 'Missing action' });

    switch (action) {
      case 'setup':
        setupSecondBrain_();
        return json_({ ok: true, message: 'Sheets initialized' });

      case 'add_memory':
        return json_({ ok: true, id: addMemory_(body) });

      case 'add_task':
        return json_({ ok: true, id: addTask_(body) });

      case 'update_task_status':
        return json_({ ok: true, updated: updateTaskStatus_(body.taskId, body.status) });

      case 'add_decision':
        return json_({ ok: true, id: addDecision_(body) });

      case 'add_idea':
        return json_({ ok: true, id: addIdea_(body) });

      case 'set_preference':
        return json_({ ok: true, updated: setPreference_(body.key, body.value) });

      case 'log_daily':
        return json_({ ok: true, id: logDaily_(body) });

      case 'score_task':
        return json_({ ok: true, scored: scoreTask_(body) });

      case 'auto_prioritize':
        return json_({ ok: true, updated: autoPrioritizeTasks_() });

      default:
        return json_({ ok: false, error: 'Unsupported action', action });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// ---------- Setup ----------
function setupSecondBrain_() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);

  ensureSheet_(ss, CONFIG.SHEETS.MEMORIES, [
    'id', 'createdAt', 'type', 'topic', 'content', 'tags', 'source', 'importance'
  ]);

  ensureSheet_(ss, CONFIG.SHEETS.TASKS, [
    'id', 'createdAt', 'title', 'description', 'status', 'priority', 'owner', 'dueDate', 'project', 'notes'
  ]);

  ensureSheet_(ss, CONFIG.SHEETS.DECISIONS, [
    'id', 'createdAt', 'decision', 'context', 'reason', 'impact', 'owner'
  ]);

  ensureSheet_(ss, CONFIG.SHEETS.IDEAS, [
    'id', 'createdAt', 'idea', 'category', 'impactScore', 'effortScore', 'status'
  ]);

  ensureSheet_(ss, CONFIG.SHEETS.PREFERENCES, [
    'key', 'value', 'updatedAt'
  ]);

  ensureSheet_(ss, CONFIG.SHEETS.DAILY_LOG, [
    'id', 'date', 'top1', 'top2', 'top3', 'done', 'notDone', 'whyNot', 'carryOver', 'createdAt'
  ]);
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

// ---------- Commands ----------
function addMemory_(payload) {
  const sh = sheet_(CONFIG.SHEETS.MEMORIES);
  const id = id_('MEM');
  sh.appendRow([
    id,
    now_(),
    payload.type || 'note',
    payload.topic || '',
    payload.content || '',
    Array.isArray(payload.tags) ? payload.tags.join(', ') : (payload.tags || ''),
    payload.source || 'manual',
    payload.importance || 'medium'
  ]);
  return id;
}

function searchMemories_(query, limit) {
  const sh = sheet_(CONFIG.SHEETS.MEMORIES);
  const rows = dataRows_(sh);
  if (!query) return rows.slice(0, limit);

  const q = query.toLowerCase();
  return rows
    .filter(r => JSON.stringify(r).toLowerCase().indexOf(q) > -1)
    .slice(0, limit);
}

function addTask_(payload) {
  const sh = sheet_(CONFIG.SHEETS.TASKS);
  const id = id_('TSK');
  sh.appendRow([
    id,
    now_(),
    payload.title || '',
    payload.description || '',
    payload.status || 'Backlog',
    payload.priority || 'Medium',
    payload.owner || 'Orange',
    payload.dueDate || '',
    payload.project || '',
    payload.notes || ''
  ]);
  return id;
}

function updateTaskStatus_(taskId, status) {
  if (!taskId || !status) return false;
  const sh = sheet_(CONFIG.SHEETS.TASKS);
  const data = sh.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][0]) === String(taskId)) {
      sh.getRange(r + 1, 5).setValue(status);
      return true;
    }
  }
  return false;
}

function listTasks_(opts) {
  const sh = sheet_(CONFIG.SHEETS.TASKS);
  let rows = dataRows_(sh);
  if (opts && opts.status) rows = rows.filter(r => String(r.status).toLowerCase() === String(opts.status).toLowerCase());
  return rows;
}

function addDecision_(payload) {
  const sh = sheet_(CONFIG.SHEETS.DECISIONS);
  const id = id_('DEC');
  sh.appendRow([
    id,
    now_(),
    payload.decision || '',
    payload.context || '',
    payload.reason || '',
    payload.impact || '',
    payload.owner || 'Kru Bank'
  ]);
  return id;
}

function addIdea_(payload) {
  const sh = sheet_(CONFIG.SHEETS.IDEAS);
  const id = id_('IDEA');
  sh.appendRow([
    id,
    now_(),
    payload.idea || '',
    payload.category || 'workflow',
    payload.impactScore || 5,
    payload.effortScore || 5,
    payload.status || 'new'
  ]);
  return id;
}

function setPreference_(key, value) {
  if (!key) return false;
  const sh = sheet_(CONFIG.SHEETS.PREFERENCES);
  const data = sh.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][0]) === String(key)) {
      sh.getRange(r + 1, 2, 1, 2).setValues([[value, now_()]]);
      return true;
    }
  }
  sh.appendRow([key, value, now_()]);
  return true;
}

function logDaily_(payload) {
  const sh = sheet_(CONFIG.SHEETS.DAILY_LOG);
  const id = id_('DAY');
  sh.appendRow([
    id,
    payload.date || Utilities.formatDate(new Date(), CONFIG.TZ, 'yyyy-MM-dd'),
    payload.top1 || '',
    payload.top2 || '',
    payload.top3 || '',
    payload.done || '',
    payload.notDone || '',
    payload.whyNot || '',
    payload.carryOver || '',
    now_()
  ]);
  return id;
}

function getDailyBrief_() {
  const tasks = listTasks_({ status: 'In Progress' }).slice(0, 5);
  const ideas = dataRows_(sheet_(CONFIG.SHEETS.IDEAS)).filter(r => r.status === 'new').slice(0, 3);
  const smart = getSmartTaskSuggestions_({}).slice(0, 3);
  return {
    timestamp: now_(),
    focusTasks: tasks,
    freshIdeas: ideas,
    smartTop3: smart,
    recommendation: 'Pick 1 revenue task, 1 system task, 1 follow-up task today.'
  };
}

function scoreTask_(task) {
  const text = `${task.title || ''} ${task.description || ''} ${task.project || ''} ${task.notes || ''}`.toLowerCase();
  const now = new Date();

  const revenueKw = ['sale', 'lead', 'client', 'proposal', 'invoice', 'closing', 'deal', 'follow-up', 'upsell'];
  const urgentKw = ['urgent', 'today', 'asap', 'deadline', 'critical', 'now'];
  const strategyKw = ['system', 'automation', 'workflow', 'template', 'dashboard', 'process'];

  let revenue = keywordScore_(text, revenueKw, 12);
  let urgency = keywordScore_(text, urgentKw, 10);
  let strategic = keywordScore_(text, strategyKw, 8);

  if (String(task.priority || '').toLowerCase() === 'high') urgency += 12;
  if (String(task.priority || '').toLowerCase() === 'urgent') urgency += 20;

  const due = task.dueDate ? new Date(task.dueDate) : null;
  if (due && !isNaN(due.getTime())) {
    const daysDiff = Math.ceil((due - now) / 86400000);
    if (daysDiff <= 0) urgency += 25;
    else if (daysDiff <= 1) urgency += 18;
    else if (daysDiff <= 3) urgency += 10;
  }

  revenue = clamp_(revenue, 0, 100);
  urgency = clamp_(urgency, 0, 100);
  strategic = clamp_(strategic, 0, 100);

  const score = Math.round(revenue * 0.45 + urgency * 0.35 + strategic * 0.20);
  const suggestedPriority = score >= 75 ? 'Urgent' : score >= 60 ? 'High' : score >= 35 ? 'Medium' : 'Low';

  return {
    id: task.id || '',
    title: task.title || '',
    score,
    dimensions: { revenue, urgency, strategic },
    suggestedPriority
  };
}

function getSmartTaskSuggestions_(opts) {
  let tasks = listTasks_({ status: opts && opts.status ? opts.status : '' });
  tasks = tasks.filter(t => String(t.status || '').toLowerCase() !== 'done');

  const scored = tasks.map(scoreTask_)
    .sort((a, b) => b.score - a.score);

  return scored;
}

function autoPrioritizeTasks_() {
  const sh = sheet_(CONFIG.SHEETS.TASKS);
  const data = sh.getDataRange().getValues();
  if (data.length <= 1) return 0;

  const headers = data[0];
  const idx = {
    id: headers.indexOf('id'),
    title: headers.indexOf('title'),
    description: headers.indexOf('description'),
    status: headers.indexOf('status'),
    priority: headers.indexOf('priority'),
    dueDate: headers.indexOf('dueDate'),
    project: headers.indexOf('project'),
    notes: headers.indexOf('notes')
  };

  let updated = 0;
  for (let r = 1; r < data.length; r++) {
    const task = {
      id: data[r][idx.id],
      title: data[r][idx.title],
      description: data[r][idx.description],
      status: data[r][idx.status],
      priority: data[r][idx.priority],
      dueDate: data[r][idx.dueDate],
      project: data[r][idx.project],
      notes: data[r][idx.notes]
    };

    if (String(task.status || '').toLowerCase() === 'done') continue;

    const scored = scoreTask_(task);
    const currentPriority = String(task.priority || '');
    if (currentPriority !== scored.suggestedPriority) {
      sh.getRange(r + 1, idx.priority + 1).setValue(scored.suggestedPriority);
      updated++;
    }
  }
  return updated;
}

function keywordScore_(text, keywords, weight) {
  return keywords.reduce((sum, kw) => sum + (text.indexOf(kw) > -1 ? weight : 0), 0);
}

// ---------- Helpers ----------
function sheet_(name) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Missing sheet: ' + name + '. Run setup action first.');
  return sh;
}

function dataRows_(sh) {
  const values = sh.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  return values.slice(1).map(row => headers.reduce((o, h, i) => (o[h] = row[i], o), {}));
}

function id_(prefix) {
  return prefix + '-' + Utilities.getUuid().slice(0, 8).toUpperCase();
}

function now_() {
  return Utilities.formatDate(new Date(), CONFIG.TZ, 'yyyy-MM-dd HH:mm:ss');
}

function clamp_(n, min, max) {
  return Math.max(min, Math.min(max, isNaN(n) ? min : n));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj, null, 2)).setMimeType(ContentService.MimeType.JSON);
}
