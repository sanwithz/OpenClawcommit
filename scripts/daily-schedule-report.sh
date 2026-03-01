#!/bin/bash
# Daily class schedule report - runs at 06:00 AM

API_URL="https://script.google.com/macros/s/AKfycbySazd_jEy_iaJzoVyuA9R5vBWRWXYtXxswAerhP4Y-retCqjSNqwLb92JYdVRU7Gk2EQ/exec"
TELEGRAM_BOT_TOKEN="8020047301:AAGfwz4L--nD6DWCZoN9u9JEVJnsH3c-B8o"
TELEGRAM_CHAT_ID="6796212791"

# Fetch calendar data
DATA=$(curl -s "$API_URL")

# Check if API returned data
if [ -z "$DATA" ]; then
    MSG="❌ ไม่สามารถดึงข้อมูลตารางสอนได้"
else
    # Parse and format message using Python
    MSG=$(python3 << EOF
import json
import sys
from datetime import datetime

try:
    data = json.loads('''$DATA''')
    
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
    
    print("\\n".join(lines))
    
except Exception as e:
    print(f"❌ Error parsing data: {e}")
    sys.exit(0)
EOF
)
fi

# Send to Telegram
curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    -d "text=${MSG}" \
    -d "parse_mode=HTML" > /dev/null
