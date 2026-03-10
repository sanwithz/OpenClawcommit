---
name: sanwithz-gas
description: Generate complete Google Apps Script SPA app blueprints and full implementation output (database structure, features, fixed stack, full OOP Code.gs, full index.html, deployment guide) with Thai UI text and fixed CDN/tooling requirements. Use when user asks for GAS web app generation, CRUD system scaffolding, dashboard/reporting app setup, or complete Apps Script + Google Sheets solution.
---

# sanwithz-GAS

Generate a full Google Apps Script SPA implementation using the exact structure and constraints below.

## Output Contract (Always)

Produce output in this exact order:

1. Database Structure section
2. Features Required section
3. Technology Stack section
4. Full `Code.gs`
5. Full `index.html`
6. Setup & Deployment Instructions

---

## 1) Title Section Rules

Start with exactly:

1. `APP generate`
2. `Act as an Expert Google Apps Script & Full Stack Developer.`

Then add one paragraph summarizing the app, using the specific app name and app description from the user.

---

## 2) Database Structure (Google Sheets)

Always design a Google Sheets database that matches the requested app.

Rules:
- Define each sheet name.
- Under each sheet, list columns in parentheses.
- Use exactly this line format:

`'SheetName': (ColumnA, ColumnB, ColumnC)`

- Make IDs and key fields explicit and clearly named.
- Adapt schema to the user’s app domain.

---

## 3) Features Required (SPA Structure)

Design as a Single Page Application.

Must include:
- A **Dashboard** with key summary metrics and ApexCharts where relevant.
- At least one **Search / Filter** section with real-time filtering.
- Relevant **create / update / delete** forms.
- Any special workflow the user requests (approval, check-in/out, registration, etc.).

For each section/tab:
- Use bullets.
- Explain what it does.
- Include validation behavior (required fields, ID checks, stock/status checks, etc.).

---

## 4) Technology Stack (Fixed)

Always state exactly:
- Backend: Google Apps Script (`Code.gs`)
- Database: Google Sheets
- Frontend: HTML5, CSS3, JavaScript
- UI Framework: Tailwind CSS (via CDN)
- Alerts: SweetAlert2
- Charts: ApexCharts
- Icons: Lucide
- Extras: jQuery, Canvas Confetti, jQuery LoadingOverlay

Always include these CDNs in HTML:

```html
<!-- JQuery -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

<!-- Bootstrap 5 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
<!-- FontAwesome 6 -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />
<!-- Google Font: Prompt -->
<link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<!-- SweetAlert2 -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<!-- Canvas Confetti -->
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>

<!-- Loading Overlay -->
<script src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>

<!-- Sweet Alert -->
<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<!-- ApexCharts -->
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- Sarabun Font -->
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap" rel="stylesheet">
```

Also apply globally:

```html
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
 body {
  font-family: 'Sarabun', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
 }
</style>
```

---

## 5) UI Language and Design Rules

Hard requirements:
- All UI text must be Thai (labels, headings, buttons, alerts, messages).
- Variable names, function names, and code comments remain English.
- Responsive for mobile/tablet/desktop.
- Use clean modern layout:
  - Top navbar
  - Sidebar/tab navigation on larger screens
  - Stacked layout on mobile
- Use Lucide icons for major actions (add/edit/delete/search/dashboard).
- Visual style: elegant, **no gradient**.

---

## 6) Code Requirements

### 6.1 Full `Code.gs`

Must be complete and runnable.

Must include:
- `doGet(e)` serving HTML
- CRUD functions for Sheets data
- Utility functions (ID generation, validation, logging as needed)
- Proper Apps Script response handling with `HtmlService` / `ContentService.createTextOutput` as appropriate
- JSON-style responses for frontend calls (`google.script.run` compatible)

Architecture:
- Use OOP (Class-based structure)
- Keep code modular and readable
- Add comments and basic `try/catch` error handling with friendly messages

Performance constraints:
- Optimize for larger datasets
- Prefer array methods (`find`, `filter`, `map`, `reduce`) over explicit loops
- Use `createTextFinder().findNext()` instead of for-loops whenever applicable for row lookup

### 6.2 Full `index.html`

Must be complete and runnable, including:
- `<head>` with title, fonts, Tailwind, and required CDNs
- `<body>` SPA layout
- Small custom `<style>` only; rely mainly on Tailwind
- `<script>` with:
  - Initialization
  - Event listeners
  - `google.script.run` calls
  - LoadingOverlay helpers
  - SweetAlert2 notifications
  - Confetti on important success events
  - ApexCharts dashboard setup
  - Lucide initialization
- All UI strings in Thai
- Responsive Tailwind layout (grid/flex + breakpoints)

---

## 7) Setup & Deployment Instructions

Always provide clear step-by-step setup:
- Create Google Sheet + tabs
- Add exact column headers
- Open linked Apps Script project
- Paste full `Code.gs`
- Create `index.html`
- Deploy Web App with:
  - Execute as: **Me (the developer)**
  - Who has access: **Anyone with the link** (or user-requested alternative)
- Mention any initial seed/config data needed

---

## 8) Error Handling & UX

Always include examples of:
- Required field validation
- Blocking operations when record not found / stock = 0 / invalid status
- Thai SweetAlert2 error feedback without app crash
- LoadingOverlay during long operations
- Canvas Confetti on important successful actions

---

## 9) Explanation Style

- Be concise and clear.
- Never skip required sections.
- Always adapt schema and features to the app request.
- Keep stack/CDNs/Thai UI requirements fixed.
