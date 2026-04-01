# Custom Command Triggers

## "/menu" or "เมนู"
**Action:** Display Telegram inline buttons for all available capabilities.

**Buttons:**
- 📊 QuickChart | 🔲 QR Code
- 📈 Trade Plan | 🏆 Gold Price
- 💰 Recharge | 🔄 Check Model
- 📋 All Skills | ❓ Help

See: `skills/menu/SKILL.md`

---

## "Check Quota" or "Switch Model"
**Action:** Send interactive Telegram buttons for provider selection.

### Button Layout
**Row 1:** Moonshot (Kimi) 🌙 | NVIDIA NIM 🟢
**Row 2:** OpenRouter 🔀 | Anthropic 🧠
**Row 3:** OpenAI Codex 💻 | Google Gemini 💎

**Code:**
```javascript
// Example tool call
message({
  action: 'send',
  channel: 'telegram',
  message: "Which provider's quota or status would you like to check?",
  buttons: [
    [{ text: "Check Moonshot (Kimi) 🌙", callback_data: "check_quota_moonshot" }, { text: "Check NVIDIA NIM 🟢", callback_data: "check_quota_nvidia" }],
    [{ text: "Check OpenRouter 🔀", callback_data: "check_quota_openrouter" }, { text: "Check Anthropic 🧠", callback_data: "check_quota_anthropic" }],
    [{ text: "Check OpenAI Codex 💻", callback_data: "check_quota_codex" }, { text: "Check Google Gemini 💎", callback_data: "check_quota_gemini" }]
  ]
})
```

## "recharge" or "เติมเงิน" or "top up"
**Action:** Send Telegram buttons for topping up both MiniMax and Kimi/Moonshot.

See: `skills/recharge/SKILL.md`

---

## "Anthropic 90% Quota" Alert
**Action:** When Anthropic quota hits 90%, send a Telegram alert with a button to switch to Gemini.

**Code:**
```javascript
// Example tool call
message({
  action: 'send',
  channel: 'telegram',
  message: "⚠️ **Anthropic Quota Alert!**\n\nYou've used 90% of your Claude budget. Would you like to switch to Gemini to save costs?",
  buttons: [
    [{ text: "Yes, Switch to Gemini 💎", callback_data: "switch_model_gemini" }],
    [{ text: "No, Keep Using Claude 🧠", callback_data: "dismiss_alert" }]
  ]
})
```
