# Google Apps Script Skill Base
_Learned from: github.com/sanwithz/google-apps-script-projects (GAS085–GAS093)_
_Updated: 2026-02-25_

---

## 1. Project Structure (clasp-ready)

Every GAS project in the repo follows this structure:
```
GAS0xx/
├── .clasp.json        ← script ID + rootDir
├── appsscript.json    ← runtime config (oauthScopes, timeZone, runtimeVersion)
├── app.js / Code.js   ← main backend logic
├── html/              ← HtmlService templates (dialog.html, index.html, etc.)
└── README.md
```

**appsscript.json minimum config:**
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

---

## 2. Code Architecture Pattern (Class-based)

All projects use a clean **class-based OOP** pattern with a `Utils` helper and main `App` class.

### Utils Class (reusable across projects)
```javascript
class Utils {
  constructor(name = APP.NAME) {
    this.name = name;
    this.ss = SpreadsheetApp.getActive();
  }

  toPascalCase(text) { /* header → HeaderName */ }
  toCamelCase(text)  { /* header → headerName */ }

  toast(message, timeoutSeconds = 15) {
    return this.ss.toast(message, this.name, timeoutSeconds);
  }

  alert(message, type = "warning") {
    const ui = SpreadsheetApp.getUi();
    return ui.alert(`${this.name} [${type}]`, message, ui.ButtonSet.OK);
  }

  confirm(message) {
    const ui = SpreadsheetApp.getUi();
    return ui.alert(`${this.name} [confirm]`, message, ui.ButtonSet.YES_NO);
  }

  // Convert sheet headers → object keys
  createKeys(headers, useCamelCase = true) {
    return headers.map(h => useCamelCase ? this.toCamelCase(h) : this.toPascalCase(h));
  }

  // Row values + keys → object
  createItemObject(keys, values) {
    const item = {};
    keys.forEach((key, i) => (item[key] = values[i]));
    return item;
  }

  // Read sheet → array of objects (with rowIndex)
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

  getCurrentFolder() {
    const id = this.ss.getId();
    const parents = DriveApp.getFileById(id).getParents();
    return parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  }

  getFolderByName(parentFolder, name, createIfNotFound = true) {
    const folders = parentFolder.getFoldersByName(name);
    if (folders.hasNext()) return folders.next();
    if (createIfNotFound) return parentFolder.createFolder(name);
  }
}
```

### App Class Entry Points
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

  run()   { SpreadsheetApp.getUi().showSidebar(this.createHtmlContent()); }
  doGet() { return this.createHtmlContent(); }
}

// Global singletons
this._utils = new Utils();
this._app  = new App();

// GAS entry points (must be global functions)
const onOpen  = (e) => _app.onOpen(e);
const run     = ()  => _app.run();
const doGet   = (e) => _app.doGet(e);
```

---

## 3. HtmlService Patterns

### Template with data injection
```javascript
// Backend
const template = HtmlService.createTemplateFromFile("html/dialog");
template.formData = formData;  // pass any JS object
template.user = this.user;
return template.evaluate().setTitle(APP.NAME);

// Frontend (dialog.html)
<? var items = formData; ?>
<? items.forEach(item => { ?>
  <div><?= item.label ?></div>
<? }); ?>
```

### Include CSS/JS files
```html
<!-- index.html -->
<?!= HtmlService.createHtmlOutputFromFile('css').getContent(); ?>
<?!= HtmlService.createHtmlOutputFromFile('js').getContent(); ?>
```

### Client → Server communication
```javascript
// Frontend → Backend
google.script.run
  .withSuccessHandler(onSuccess)
  .withFailureHandler(onError)
  .submit(JSON.stringify(payload));

// Backend function
const submit = (payload) => _app.submit(JSON.parse(payload));
```

---

## 4. Sheets API Patterns

```javascript
// Read all data as objects
const [headers, ...records] = ws.getDataRange().getValues();

// Write a new row
ws.appendRow([new Date(), uuid, value1, value2]);

// Write to specific range
ws.getRange(lastRow + 1, 1, 1, values.length).setValues([values]);

// Set headers (row 1)
ws.getRange(1, 1, 1, headers.length).setValues([headers]);

// Get or create sheet
const ws = ss.getSheetByName("Response") || ss.insertSheet("Response");

// Read with display values (formatted)
ws.getDataRange().getDisplayValues();

// Read background colors
ws.getDataRange().getBackgrounds();
```

---

## 5. Drive API Patterns

```javascript
// Get current spreadsheet's folder
const parents = DriveApp.getFileById(ss.getId()).getParents();
const folder = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();

// Create subfolder
const subfolder = folder.createFolder("Reports");

// Copy a file (template → report)
const copy = DriveApp.getFileById(templateId).makeCopy(name, targetFolder);

// Upload file from base64 (file upload from HtmlService)
const decodedData = Utilities.base64Decode(data.split("base64,")[1]);
const blob = Utilities.newBlob(decodedData);
blob.setName(name).setContentType(type);
folder.createFile(blob);

// Get file URL
DriveApp.getFileById(id).getUrl();
```

---

## 6. SlidesApp Automation (GAS085 - SlidePro)

Pattern for batch slide generation from a template:
```javascript
// Open template → make copy → replace placeholders
const copy = templateFile.makeCopy(reportName, reportFolder);
const presentation = SlidesApp.openById(copy.getId());

// Replace text placeholders {{ key }} with values
SlidePro.replaceTextPlaceholders(presentation, textPlaceholders);

// Replace image placeholders
SlidePro.replaceImagePlaceholders(presentation, imagePlaceholders);

// Replace table content
SlidePro.replaceTablePlaceholders(presentation, tablePlaceholders);

presentation.saveAndClose();
```

**Placeholder data from sheet:**
- Text: sheet "Text" → `{ "{{name}}": "John" }`
- Image: sheet "Image" → `{ "{{logo}}": { id, url, crop, link } }`
- Table: sheets named `{{TableName}}` → 2D array of `{ value, color, bgColor }`

---

## 7. Approval Workflow (GAS086)

Multi-step approval with email notifications:
- Frontend: Vue.js embedded in HtmlService
- Backend: `backend.js` with status machine (pending → approved/rejected)
- Email: `GmailApp.sendEmail()` at each transition
- Storage: Google Sheet as database

```javascript
// Send approval email
GmailApp.sendEmail(approverEmail, subject, "", {
  htmlBody: htmlContent,
  name: APP.NAME
});
```

---

## 8. Calendar API (GAS093)

```javascript
// Get events in range
const calendar = CalendarApp.getDefaultCalendar();
const events = calendar.getEvents(startDate, endDate);

// Event properties
events.forEach(event => {
  event.getTitle();
  event.getStartTime();
  event.getEndTime();
  event.getDescription();
  event.getCreators();
});

// Create trigger for calendar changes
ScriptApp.newTrigger("onCalendarChange")
  .forUserCalendar(Session.getActiveUser().getEmail())
  .onEventUpdated()
  .create();
```

---

## 9. Utilities

```javascript
// Generate UUID
const uuid = Utilities.getUuid();

// Format date
Utilities.formatDate(new Date(), "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss");

// Base64 encode/decode
const encoded = Utilities.base64Encode(blob.getBytes());
const decoded = Utilities.base64Decode(encodedString);

// Pause execution
Utilities.sleep(1000); // ms
```

---

## 10. Web App Deployment Checklist

1. `appsscript.json` → set correct `oauthScopes`
2. `doGet(e)` → must return `HtmlOutput` or `ContentService` output
3. Deploy → "New Deployment" → Type: Web App
   - Execute as: **Me** (for sheet access)
   - Who has access: **Anyone** (for public form) or **Anyone with Google account**
4. Republish after code changes → "Manage Deployments" → Edit → New version

---

## 11. Key Do's and Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| Use class-based structure | Write spaghetti global functions |
| Pass data via `template.propName` | Use `PropertiesService` for large data |
| Use `getDisplayValues()` for formatted text | Use `getValues()` when you need formatted output |
| `appendRow()` for simple inserts | Manual row counting unless you need range control |
| Use `Utilities.getUuid()` for record IDs | Use random Math functions |
| `JSON.stringify/parse` for client↔server | Pass complex objects directly |
| Always check `if (!ws) return;` | Assume sheet exists |
| Use `ss.toast()` for progress feedback | Leave users guessing on long operations |

---

## 12. Project Reference (GAS085–GAS093)

| # | Project | Key Services | Pattern |
|---|---|---|---|
| GAS085 | Slide Automation (SlidePro) | SlidesApp, DriveApp | Template → copy → replace placeholders |
| GAS086 | Approval Application | HtmlService, GmailApp, VueJS | Multi-step form + email workflow |
| GAS087 | Custom Form with Signature | HtmlService | Canvas signature capture |
| GAS088 | Gmail Downloader | GmailApp, DriveApp | Attachment → Drive |
| GAS089 | Gmail Tracker | GmailApp | Label + tracking sheet |
| GAS090 | Product Entry Form | HtmlService, DriveApp | Sidebar form + file upload |
| GAS091 | File Share Automation | DriveApp | Batch permission management |
| GAS092 | Send Google Tasks | TasksService | Tasks API integration |
| GAS093 | Calendar Watcher | CalendarApp, ScriptApp | Event trigger + notification |
