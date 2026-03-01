---
name: gold-price
description: Capture gold price from goldtraders.or.th and send as single image. Use when user says "อยากรู้ราคาทองคำ" or asks about gold prices. Returns clean price table image without extra text.
---

# Gold Price Capture

Capture and send gold price from Thai Gold Traders Association.

## When to Use

Trigger phrase:
- "อยากรู้ราคาทองคำ"
- "ราคาทองเท่าไร"
- "ทองคำวันนี้"

## Workflow

1. **Navigate**: Open `https://xn--42cah7d0cxcvbbb9x.com/`
2. **Locate Element**: Find `div.divgta.goldshopf`
3. **Screenshot**: CDP clip with exact coordinates from `getBoundingClientRect()`
4. **Scale**: Use `scale: 2` for DPR=2 (Retina)
5. **Send**: One image only, no caption or minimal caption

## CDP Screenshot Code

```javascript
const el = document.querySelector('div.divgta.goldshopf');
const r = el.getBoundingClientRect();
// Returns: {x: ~896, y: ~78, width: 418, height: 254}

Page.captureScreenshot({
  format: "png",
  clip: {
    x: Math.round(r.x),
    y: Math.round(r.y),
    width: Math.round(r.width),
    height: Math.round(r.height),
    scale: window.devicePixelRatio  // 2
  }
});
```

## Constraints

- ✅ One image only
- ✅ No caption text (or very short)
- ✅ No full-page screenshots
- ✅ No manual crop/merge with ffmpeg
- ❌ No redesign/reformat
- ❌ No multiple images
