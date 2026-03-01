# Recharge Skill

Trigger: User says "recharge" or "เติมเงิน" or "top up"

Action: Send Telegram buttons for topping up both MiniMax and Kimi/Moonshot.

## Button Layout

**Row 1:**
- MiniMax Coding Plan
- Kimi/Moonshot Console

## Implementation

```javascript
message({
  action: 'send',
  channel: 'telegram',
  message: 'เลือกที่จะเติมเงิน:',
  buttons: [
    [
      { text: 'MiniMax Coding Plan', url: 'https://platform.minimax.io/subscribe/coding-plan' },
      { text: 'Kimi/Moonshot Console', url: 'https://platform.moonshot.ai/console/account' }
    ]
  ]
})
```

## URLs
- MiniMax: https://platform.minimax.io/subscribe/coding-plan
- Moonshot: https://platform.moonshot.ai/console/account
