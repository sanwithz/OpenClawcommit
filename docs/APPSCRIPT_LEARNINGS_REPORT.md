# Google Apps Script Learnings Report (Interim)

Prepared for: **Kru Bank**  
Date: 2026-02-21

## Executive Summary (1-page)
I reviewed the repository `sanwithz/google-apps-script-projects` and extracted practical patterns that match your build style: real business automations, form workflows, Gmail-driven operations, API integrations, and Apps Script web apps.

The repo’s strongest value is **project breadth + repeatable templates**. It shows production-oriented use of Apps Script for:
- Form pipelines (submit → route/approve/notify)
- Gmail and Calendar automation
- Dashboard-style web UIs
- Integration bridges (Telegram, Airtable, API workflows)
- Utility tools with low deployment overhead

### What stands out
1. **Branch-per-project structure** is excellent for learning and reuse.
2. Projects focus on **execution-first automation** rather than theory.
3. Frequent use of **HTMLService + external JS/CSS** confirms a practical frontend stack for internal tools.
4. Patterns are reusable for your workflow: intake forms, approvals, trackers, reminders, lightweight admin apps.

### Immediate recommendation for your stack
Use a consistent starter architecture:
- `Code.gs` for server APIs + business logic
- `Index.html` + partial templates for UI
- `appsscript.json` pinned with timezone/runtime/scopes
- Script Properties for env-like config
- Spreadsheet-backed persistence first, API/DB second
- Standard logging/audit rows for every sensitive operation

---

## Source Status
- ✅ GitHub repo analyzed: `https://github.com/sanwithz/google-apps-script-projects`
- ⚠️ PDF extraction blocked in current run: `/Users/sanwithz/Downloads/GoogleAppsScript_Fundamental.pdf` (preprocessor failed on this environment)

---

## Top 20 Practical Lessons
1. Design each app around a **single workflow** (intake, approval, reminder, sync).
2. Keep `doGet()` minimal; move business logic to named server functions.
3. Use `google.script.run` with clear success/failure handlers.
4. Validate required fields client-side **and** server-side.
5. Add unique IDs to every submitted record for traceability.
6. Store config in `PropertiesService` (sheet IDs, webhook URLs, feature flags).
7. Use Spreadsheet as fast MVP datastore, then evolve when needed.
8. Normalize headers and avoid magic column indices.
9. Add status fields (`NEW`, `PENDING`, `APPROVED`, `DONE`) for workflow clarity.
10. Keep deployment notes/version notes with `clasp version` messages.
11. For integrations, wrap `UrlFetchApp` in helper functions + retry/backoff.
12. Log operational errors in a dedicated sheet or structured logger.
13. Use triggers for recurring checks/reminders; avoid manual cron dependence.
14. Build lightweight dashboards with ChartJS/ApexCharts for visibility.
15. Separate “UI concerns” from “business rules” to reduce breakage.
16. Use lock/guard patterns for concurrent writes when needed.
17. Restrict scopes to least privilege in `appsscript.json`.
18. Favor explicit approval states before irreversible actions.
19. Build user-facing feedback loops (emails/alerts/Telegram notifications).
20. Create reusable template components (form card, table card, chart card).

---

## Reusable Code Patterns

### 1) Server action with guard + result envelope
```javascript
function submitAction(payload) {
  try {
    if (!payload?.name) throw new Error('name required');
    // business logic...
    return { ok: true, data: { id: Utilities.getUuid() } };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
```

### 2) Client wrapper (`google.script.run`)
```javascript
function callServer(fnName, payload, onOk) {
  google.script.run
    .withSuccessHandler((res) => {
      if (!res?.ok) return alert(res?.error || 'Server error');
      onOk?.(res.data || res);
    })
    .withFailureHandler((err) => alert(err?.message || 'Network error'))
    [fnName](payload);
}
```

### 3) Sheet bootstrap helper
```javascript
function getOrCreateSheet_(ssId, name, headers) {
  const ss = SpreadsheetApp.openById(ssId);
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
  }
  return sh;
}
```

### 4) Trigger-safe batch runner
```javascript
function dailyJob() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    // batch work
  } finally {
    lock.releaseLock();
  }
}
```

---

## Security / Auth / Deployment Checklist
- [ ] Use least-privilege OAuth scopes
- [ ] Keep secrets in Script Properties (not hardcoded)
- [ ] Validate all user inputs on server
- [ ] Add per-action logging (who/what/when)
- [ ] Add approval gates for sensitive operations
- [ ] Verify web app access level (`ANYONE`, domain, or restricted)
- [ ] Use versioned deployments with clear descriptions
- [ ] Add failure alerts (email/Telegram) for critical jobs
- [ ] Review triggers quarterly
- [ ] Maintain rollback point (previous deployment version)

---

## Suggested “Kru Bank Style” Starter Template
1. **UI:** Tailwind + jQuery + SweetAlert + LoadingOverlay + ApexCharts + Lucide + FA
2. **Layout:** form card + analytics aside card (your saved pattern)
3. **Data:** Spreadsheet with ID, timestamp, status, owner
4. **Workflow:** submit → validate → save → notify → chart refresh
5. **Ops:** transparent logs for all binding/spending-related actions
6. **Deploy:** clasp push/version/redeploy with clear messages

---

## 10 Project Ideas (Ranked by Impact)
1. Lead Intake + Auto Assignment + SLA Reminder
2. Approval Hub (multi-step form approvals + audit trail)
3. Gmail Follow-up Intelligence (unreplied thread tracker)
4. Project Health Dashboard (sheets + chart KPIs)
5. Invoice Prep Assistant (draft only, no payment action)
6. Meeting Action Extractor (Calendar/Gmail summary to tasks)
7. Training Enrollment + Certificate Flow
8. Internal Request Desk (IT/ops/service tickets)
9. Google Form UX Booster Framework
10. Telegram Ops Bot for status/report commands

---

## Next Step to Complete Full Report
I still need to ingest the PDF fully. Once the PDF parser is fixed, I’ll merge those findings into this report and produce a final v2 with source-linked concepts.
