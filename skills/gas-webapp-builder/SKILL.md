---
name: gas-webapp-builder
description: Build Google Apps Script web apps with class-based architecture. Use when user requests GAS web app, Google Apps Script form, or automation with Sheets/HtmlService. Follows GAS085-GAS093 patterns with App+Utils classes.
---

# GAS WebApp Builder

Build Google Apps Script web apps following class-based architecture patterns.

## When to Use

- "สร้าง Google Apps Script"
- "ทำ web app ด้วย GAS"
- "สร้างฟอร์มด้วย Apps Script"
- "เขียน Google Sheet automation"

## Architecture Pattern

### 1. File Structure
```
project/
├── .clasp.json
├── appsscript.json
├── app.js (or Code.js)
└── html/
    ├── dialog.html
    └── css.html
```

### 2. Utils Class (reusable)
```javascript
class Utils {
  constructor(name = APP.NAME) {
    this.name = name;
    this.ss = SpreadsheetApp.getActive();
  }
  
  toCamelCase(text) { /* implementation */ }
  toPascalCase(text) { /* implementation */ }
  
  toast(message, timeoutSeconds = 15) {
    return this.ss.toast(message, this.name, timeoutSeconds);
  }
  
  getDataFromSheetByName(name) {
    const ws = this.ss.getSheetByName(name);
    if (!ws) return;
    const [headers, ...records] = ws.getDataRange().getValues();
    const keys = this.createKeys(headers);
    return records.map((record, i) => {
      const item = this.createItemObject(keys, record);
      item.rowIndex = i + 2;
      return item;
    });
  }
}
```

### 3. App Class
```javascript
class App {
  constructor() {
    this.ss = SpreadsheetApp.getActive();
    this.name = APP.NAME;
    this.user = Session.getActiveUser().getEmail();
  }
  
  onOpen(e) {
    SpreadsheetApp.getUi()
      .createMenu(APP.NAME)
      .addItem("Run", "run")
      .addToUi();
  }
  
  createHtmlContent() {
    const template = HtmlService.createTemplateFromFile("html/dialog");
    template.data = /* pass data */;
    return template.evaluate()
      .setTitle(APP.NAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  run() {
    SpreadsheetApp.getUi().showSidebar(this.createHtmlContent());
  }
  
  doGet() {
    return this.createHtmlContent();
  }
}

// Global exports
this._utils = new Utils();
this._app = new App();
const onOpen = (e) => _app.onOpen(e);
const run = () => _app.run();
const doGet = (e) => _app.doGet(e);
```

## HtmlService Template

```html
<!-- html/dialog.html -->
<?!= HtmlService.createHtmlOutputFromFile('html/css').getContent(); ?>

<div id="app">
  <? var items = formData; ?>
  <? items.forEach(item => { ?>
    <div><?= item.label ?></div>
  <? }); ?>
</div>

<script>
google.script.run
  .withSuccessHandler(onSuccess)
  .withFailureHandler(onError)
  .submit(JSON.stringify(payload));
</script>
```

## appsscript.json Config

```json
{
  "timeZone": "Asia/Bangkok",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.container.ui"
  ]
}
```

## UI Style (from USER.md)

- Layout: `max-w-5xl`, 3-col grid, `md:col-span-2`, `rounded-2xl`, `shadow-soft`
- Inputs: `bg-gray-50 border-gray-200 rounded-lg font-mono focus:ring-2 focus:ring-gray-900`
- Submit: `bg-brand-500 hover:bg-brand-700`
- Charts: ApexCharts with legend CSS fixes

## Key APIs

- `SpreadsheetApp.getActive()`
- `HtmlService.createTemplateFromFile()`
- `DriveApp.getFolderById()` / `createFile()`
- `Session.getActiveUser().getEmail()`
- `Utilities.getUuid()`

## Constraints

- ✅ Always class-based structure
- ✅ Always check `if (!ws) return;` for sheets
- ✅ Always use `JSON.stringify/parse` for client→server
- ✅ Always global function exports for GAS entry points
- ❌ No spaghetti global code
- ❌ No hardcoded sheet names without constants
