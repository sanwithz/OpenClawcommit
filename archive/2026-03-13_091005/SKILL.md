---
name: trading-analysis
description: Analyze TradingView charts and generate actionable 30m trade plans with exact Entry/SL/TP levels. Use when user says "Trade หาค่า API" or requests trading analysis, chart screenshot, or trade plan generation. Supports BTCUSDT and other pairs with indicator panel reading.
---

# Trading Analysis

Generate actionable 30m trade plans from TradingView charts with precise Entry/SL/TP levels.

## When to Use

Trigger phrases:
- "Trade หาค่า API"
- "Trade เพื่อหาค่า API"
- "วิเคราะห์ chart"
- "ดูราคา BTC"
- "เทรดอะไรดี"

## Workflow

1. **Open TradingView**: Navigate to provided chart URL (default: BTCUSDT 30m Binance)
2. **Screenshot**: Capture chart + indicator status panel via CDP clip
3. **Read Indicators**: Extract values from panel:
   - ADX (trend strength)
   - TrendHMA (direction)
   - HTF Trend (higher timeframe bias)
   - Signal (Strong Buy/Buy/Neutral/Sell/Strong Sell)
4. **Analyze**: Determine trend bias, key levels, momentum
5. **Generate Plan**: Output Plan A (trend-follow) + Plan B (reclaim/reversal)
6. **Send**: One chart image + one concise bubble with levels

## Response Format (1 bubble only)

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

## Screenshot Method

Use CDP `Page.captureScreenshot` with clip:
```javascript
{
  clip: {
    x: 30,      // adjust per screen
    y: 35,
    width: 860,
    height: 620,
    scale: 2    // DPR=2 for retina
  }
}
```

## Key Levels Logic

- **Entry zone**: Near EMA cluster or recent swing high/low
- **SL**: Above/below recent structure or 1.5x ATR
- **TP1/2/3**: 1:2.5 RR, then 2x, then 3x
- **Plan B trigger**: Break and close above/below key structure

## Constraints

- ❌ Never send multiple bubbles
- ❌ Never explain at length
- ❌ Never send without chart image
- ✅ Always include exact numbers
- ✅ Always state clear bias
