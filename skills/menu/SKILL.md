# Menu Skill

Trigger: User types `/menu` or `เมนู` or `menu`

Action: Display Telegram inline buttons for all available capabilities.

## Button Layout

```
Row 1: 📊 QuickChart | 🔲 QR Code
Row 2: 📈 Trade Plan | 🏆 Gold Price
Row 3: 💰 Recharge | 🔄 Check Model
Row 4: 📋 All Skills | ❓ Help
```

## Implementation

```javascript
message({
  action: 'send',
  channel: 'telegram',
  message: '🎯 เลือกฟังก์ชันที่ต้องการ:',
  buttons: [
    [
      { text: '📊 QuickChart', callback_data: 'menu:quickchart' },
      { text: '🔲 QR Code', callback_data: 'menu:qrcode' }
    ],
    [
      { text: '📈 Trade Plan', callback_data: 'menu:trade' },
      { text: '🏆 Gold Price', callback_data: 'menu:gold' }
    ],
    [
      { text: '💰 Recharge', callback_data: 'menu:recharge' },
      { text: '🔄 Check Model', callback_data: 'menu:model' }
    ],
    [
      { text: '📋 All Skills', callback_data: 'menu:skills' },
      { text: '❓ Help', callback_data: 'menu:help' }
    ]
  ]
})
```

## Button Actions

| Button | Action |
|--------|--------|
| 📊 QuickChart | Show QuickChart examples |
| 🔲 QR Code | Show QR code generator |
| 📈 Trade Plan | Run trading analysis (Trade หาค่า API) |
| 🏆 Gold Price | Get gold price (อยากรู้ราคาทองคำ) |
| 💰 Recharge | Show recharge links |
| 🔄 Check Model | Show current model & fallbacks |
| 📋 All Skills | List all available skills |
| ❓ Help | Show help text |

## Related Skills
- `skills/quickchart/SKILL.md` - Chart & QR generation
- `skills/recharge/SKILL.md` - Top up links
- `skills/trading-analysis/SKILL.md` - Trading analysis
- `skills/gold-price/SKILL.md` - Gold price capture
