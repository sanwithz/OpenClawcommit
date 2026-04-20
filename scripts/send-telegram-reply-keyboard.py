#!/usr/bin/env python3
import json
import sys
import urllib.request

BOT_TOKEN = "8020047301:AAGfwz4L--nD6DWCZoN9u9JEVJnsH3c-B8o"
CHAT_ID = "6796212791"

payload = {
    "chat_id": CHAT_ID,
    "text": "เลือกงานได้เลย 👇",
    "reply_markup": {
        "keyboard": [
            [{"text": "📈 Trade API"}, {"text": "🥇 ราคาทอง"}],
            [{"text": "📝 Update journal"}, {"text": "📓 Journal"}],
            [{"text": "📊 /tinystatus"}, {"text": "🎮 /lifeOS"}, {"text": "🎼 /orchestra"}]
        ],
        "resize_keyboard": True,
        "is_persistent": True,
        "input_field_placeholder": "แตะปุ่มหรือพิมพ์คำสั่งได้เลย"
    }
}

req = urllib.request.Request(
    f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"},
    method="POST",
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode("utf-8")
        print(body)
except Exception as e:
    print(str(e), file=sys.stderr)
    sys.exit(1)
