# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

### Chart & QR Generation (QuickChart.io)
See: `skills/quickchart/SKILL.md`

**Charts:**
```
https://quickchart.io/chart?c={type:'bar',data:{labels:['A','B'],datasets:[{data:[10,20]}]}}
```

**QR Codes:**
```
https://quickchart.io/qr?text=Hello%20World&size=300
```

- Returns PNG image directly — perfect for Telegram!
- Docs: https://quickchart.io/documentation

### Model Policy
- ใช้ Anthropic API token เท่านั้น (`sk-ant-...`)
- ❌ ห้ามใช้ `google-antigravity/*` — Antigravity แยกใช้งานต่างหาก ไม่ integrate กัน

### HTML -> Markdown (fast)

- Installed CLI: `$HOME/go/bin/html2markdown`
- Install/upgrade:
  - `go install github.com/JohannesKaufmann/html-to-markdown/v2/cli/html2markdown@latest`
- One-command helper scripts:
  - `scripts/url2md.sh "https://example.com" output.md`
  - `scripts/url2obsidian.sh "https://example.com" "Optional Title"` (auto-save to `Orange Second Brain/Web Clips`)

### Summarize CLI

- Installed: `brew install steipete/tap/summarize`
- Usage: `summarize "https://..."` or `summarize file.pdf`
- Great for YouTube, URLs, PDFs

### Gemini Image Generation (Nano Banana Pro)

- Script: `~/.codex/skills/nano-banana-pro/scripts/generate_image.py`
- API: Gemini 2.0 Flash Image Generation
- **Bug note:** Use `inlineData` (camelCase) not `inline_data`
- Workflow: Draft (1K) → Iterate → Final (4K)

### Trade หาค่า API — Response Format (1 bubble only)
```
📍 BTCUSDT 30m | Price: XX,XXX

📊 Indicators
ADX XX | TrendHMA 🟢/🔴 | HTF 🟢/🔴 | Signal 🟢/🔴

📋 Plan A — Short/Long
Entry: XX,XXX | SL: XX,XXX | TP1: XX,XXX TP2: XX,XXX TP3: XX,XXX

📋 Plan B — Long/Short (reclaim)
Entry: XX,XXX | SL: XX,XXX | TP1: XX,XXX TP2: XX,XXX

⚠️ Bias: Short/Long — [one-line reason]
```
- ส่งรูปแยก 1 รูป (chart)
- ตามด้วยข้อความ 1 bubble สั้น ตามรูปแบบข้างบน
- ❌ ห้าม: หลาย bubble, อธิบายยาว, ตารางใหญ่

### Gold Price Capture Workflow (อยากรู้ราคาทองคำ)

- Source: `https://xn--42cah7d0cxcvbbb9x.com/`
- Element: `div.divgta.goldshopf`
- Method: CDP `Page.captureScreenshot` clip via `getBoundingClientRect()` + `scale: 2` (DPR=2)
- Send: รูปอย่างเดียว ไม่ต้อง caption ยาว ไม่ต้องส่งข้อความอื่น
- ❌ ห้าม: crop เดา, ffmpeg vstack, ส่งหลายรูป, ส่ง full-page screenshot

### Custom Skills (Agent Skills format)
Location: `~/.openclaw/workspace/skills/`

| Skill | Trigger | Description |
|---|---|---|
| `trading-analysis` | "Trade หาค่า API" | TradingView chart → 30m trade plan |
| `gold-price` | "อยากรู้ราคาทองคำ" | Screenshot goldtraders.or.th price table |
| `gas-webapp-builder` | "สร้าง Google Apps Script" | Build GAS web apps with class pattern |

Package: `cd skills && ./package.sh`

### Google Apps Script Skill Base
- Full doc: `docs/GAS_SKILL_BASE.md`
- Learned from: github.com/sanwithz/google-apps-script-projects (GAS085–GAS093)
- Key patterns: class-based App+Utils, HtmlService templates, Sheets API, Drive API, SlidesApp, CalendarApp
- Ref projects: Slide automation, Approval workflow, Product entry form, Calendar watcher

### Trading Tools

- Simulator: `/Users/sanwithz/Documents/Zzz/workspace/Trading Simulator/index.html`
- Alert bridge: `/Users/sanwithz/Documents/Zzz/workspace/scripts/sim-alert-bridge.mjs`
- Trade logger: `/Users/sanwithz/Documents/Zzz/workspace/kanban-board/trading-logger.html`
- Stats CSV: `/Users/sanwithz/Documents/Zzz/workspace/memory/trading-stats.csv`
- Telegram group for alerts: "Minion | Shromp world"

### Telegram Bot Token
- **Token:** `8020047301:AAGfwz4L--nD6DWCZoN9u9JEVJnsH3c-B8o`
- **Usage:** ใช้สำหรับส่งข้อความ/รายงานอัตโนมัติ
- **Scripts:** `/Users/harvey/.openclaw/workspace/scripts/daily-schedule-report.sh`

---

## 🤖 Model Switching Workflow

**Concept:** Kimi = Boss (ควบคุมหลัก) | Claude Opus = Coder (เขียนโค้ดซับซ้อน)

### ข้อจำกัด
- OpenClaw รันได้ **1 model ต่อ session**
- ต้อง **สลับไปมา** ไม่สามารถใช้พร้อมกันได้

### Architecture
```
[User Request]
    ↓
🎭 [Kimi - Boss] วิเคราะห์งาน
    ↓
ถ้าต้องเขียนโค้ดซับซ้อน:
    ↓
🔄 /model anthropic/claude-opus-4
    ↓
💻 [Claude Opus] เขียนโค้ด
    ↓
🔄 /model moonshot/kimi-k2.5
    ↓
🎭 [Kimi - Boss] รวมผล → ส่งให้ User
```

### Available Models

| Model | Role | Strengths |
|-------|------|-----------|
| **Kimi K2.5** | Boss (หลัก) | Orchestration, tools, ภาษาไทย, ราคาถูก |
| **Claude Opus 4** | Coder | โค้ดซับซ้อน, architecture, refactoring |
| **Claude Sonnet 4** | Balanced | ทั่วไป เร็วกว่า Opus |
| **Gemini 2.5 Flash Lite** | High-volume | เร็วสุด, ถูกสุด, unlimited RPD |

### When to Switch

| สถานการณ์ | Model | เหตุผล |
|-----------|-------|--------|
| **จัดการระบบ, ใช้ tools** | Kimi | เข้าใจ OpenClaw ดี |
| **เขียนโค้ดซับซ้อน** | Claude Opus | Architecture ดีกว่า |
| **Refactor ใหญ่** | Claude Opus | มองภาพรวมได้ดี |
| **Debug ยาก** | Claude Opus | หา root cause เก่ง |
| **งานซ้ำๆ หลายรอบ** | Gemini Flash Lite | เร็ว ไม่แพง |

### Commands

```bash
# Check current model
/model

# Switch to Claude Opus (coding)
/model anthropic/claude-opus-4

# Switch back to Kimi (boss)
/model moonshot/kimi-k2.5

# Or use alias (if configured)
/model claude-opus
/model kimi
```

### Example Workflow

**1. User ขอ:** "สร้างระบบ authentication ซับซ้อน"

**2. Kimi (Boss) ตอบ:**
```
🎭 [Kimi - Boss]: งานนี้ต้องเขียนโค้ดซับซ้อน 
→ สลับไป Claude Opus ก่อน
```

**3. สลับ Model:**
```
/model anthropic/claude-opus-4
```

**4. Claude Opus เขียนโค้ด:**
```
💻 [Claude Opus]: เขียน auth system...
[โค้ดเต็มรูปแบบ]
```

**5. สลับกลับ:**
```
/model moonshot/kimi-k2.5
```

**6. Kimi (Boss) สรุป:**
```
🎭 [Kimi - Boss]: รวมผลจาก Claude Opus
→ สร้างไฟล์แล้ว
→ ทดสอบแล้ว
✅ พร้อมใช้งาน
```

### ข้อควรระวัง
- ⚠️ Context จะ reset เมื่อสลับ model (ไม่จำ conversation เดิม)
- ⚠️ ต้อง copy ข้อมูลสำคัญไว้ก่อนสลับ
- ⚠️ Cost: Claude Opus แพงกว่า Kimi 5-10 เท่า

### Best Practice
1. Kimi วิเคราะห์ก่อน → ตัดสินใจว่าต้องสลับมั้ย
2. ถ้าสลับ → ส่ง context สำคัญให้ครบ
3. Claude ทำเสร็จ → สรุปผลสั้นๆ ให้ Kimi
4. สลับกลับ Kimi → ดำเนินการต่อ

### 🚨 Error Handling & Fallback

**กฎเหล็ก:** ถ้า Claude Opus error → **Kimi รับงานต่อทันที**

#### สถานการณ์ที่เกิดขึ้นได้

| Error จาก Claude | การตอบสนอง |
|------------------|------------|
| Model not available | สลับกลับ Kimi → ทำงานต่อ |
| Rate limit | สลับกลับ Kimi → รอ retry |
| Context too long | สลับกลับ Kimi → แบ่งงานใหม่ |
| Timeout | สลับกลับ Kimi → ทำแบบง่ายกว่า |
| API error | สลับกลับ Kimi → ใช้ tool แทน |

#### Fallback Workflow

```
[Claude Opus Error]
        ↓
🚨 [System] แจ้ง error
        ↓
🔄 /model moonshot/kimi-k2.5
        ↓
🎭 [Kimi - Boss] รับงานต่อ
   "Claude error → ผมทำต่อเอง"
        ↓
💡 Kimi แก้ไขปัญหา หรือ ทำแบบ alternative
        ↓
✅ ส่งงานให้ User
```

#### ตัวอย่างการตอบเมื่อ Fallback

```
🎭 [Kimi - Boss] Fallback Mode:
━━━━━━━━━━━━━━━━━━━━
⚠️ Claude Opus error: [reason]
🔄 กลับมาใช้ Kimi แทน

💡 แนวทางแก้ไข:
[วิธีแก้ หรือ ทำแบบง่ายกว่า]

✅ ดำเนินการต่อ...
━━━━━━━━━━━━━━━━━━━━
```

#### Prevention

ก่อนสลับไป Claude:
- ✅ Kimi ตรวจสอบว่างานจำเป็นใช้ Claude จริงๆ
- ✅ Copy context สำคัญไว้
- ✅ มีแผน B ว่าถ้า Claude ไม่ได้ จะทำยังไง

**Claude ดีแต่ไม่จำเป็นต้องพึ่งตลอด — Kimi ทำได้เกือบทุกอย่างเหมือนกัน** 💪
