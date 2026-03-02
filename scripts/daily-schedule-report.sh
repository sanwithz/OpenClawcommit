#!/bin/bash
# Daily class schedule report - runs at 06:00 AM

API_URL="https://script.google.com/macros/s/AKfycbySazd_jEy_iaJzoVyuA9R5vBWRWXYtXxswAerhP4Y-retCqjSNqwLb92JYdVRU7Gk2EQ/exec"
TELEGRAM_BOT_TOKEN="8020047301:AAGfwz4L--nD6DWCZoN9u9JEVJnsH3c-B8o"
TELEGRAM_CHAT_ID="6796212791"

# Fetch calendar data (capture body even on HTTP errors)
DATA=$(curl -sS "$API_URL" 2>&1)
CURL_EXIT=$?

if [ $CURL_EXIT -ne 0 ] || [ -z "$DATA" ]; then
    MSG="❌ ไม่สามารถดึงข้อมูลตารางสอนได้"
else
    DATA_B64=$(printf '%s' "$DATA" | base64)

    # Parse and format message using Python (safe: read payload from env, not heredoc interpolation)
    MSG=$(DATA_B64="$DATA_B64" python3 << 'PY'
import base64
import json
import os
import sys
from datetime import datetime

raw = base64.b64decode(os.environ.get("DATA_B64", "")).decode("utf-8", errors="replace")

try:
    data = json.loads(raw)

    if not data.get('ok'):
        print("❌ API Error")
        sys.exit(0)

    # Get today's date in Thai format
    today = datetime.now().strftime('%d/%m/%Y')

    # Count events
    total_events = data.get('summary', {}).get('totalEvents', 0)
    calendars = data.get('calendars', [])

    # Build message
    lines = [f"📅 ตารางสอนวันที่ {today}", ""]

    if total_events == 0:
        lines.append("🎉 วันนี้ไม่มีคลาสเรียน")
    else:
        lines.append(f"📚 มี {total_events} คลาสเรียนวันนี้")
        lines.append("")

        for cal in calendars:
            if cal.get('count', 0) > 0:
                lines.append(f"📖 {cal['name']}: {cal['count']} คลาส")
                for event in cal.get('events', []):
                    start = event.get('start', {}).get('formatted', 'N/A')
                    end = event.get('end', {}).get('formatted', 'N/A')
                    summary = event.get('summary', 'No title')
                    lines.append(f"   🕐 {start}-{end}: {summary}")
                lines.append("")

    lines.append("")
    lines.append("—")
    lines.append("⏰ รายงานประจำวัน 06:00 น.")

    print("\n".join(lines))

except Exception as e:
    sample = raw[:160].replace("\n", " ")
    if raw.lstrip().startswith("<"):
        print("❌ API returned HTML instead of JSON")
    elif not raw.strip():
        print("❌ API returned empty response")
    else:
        print(f"❌ Error parsing data: {e} | sample: {sample}")
    sys.exit(0)
PY
)
fi

# Send to Telegram
curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    -d "text=${MSG}" \
    -d "parse_mode=HTML" > /dev/null
