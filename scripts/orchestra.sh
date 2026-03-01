#!/bin/bash
# /orchestra Command Integration for OpenClaw
# 
# This script provides the /orchestra command handler
# Place in: ~/.openclaw/workspace/scripts/

WORKSPACE="/Users/harvey/.openclaw/workspace"
ORCHESTRA_DIR="$WORKSPACE/orchestra"

case "$1" in
  "init")
    echo "🎼 Orchestra System"
    echo ""
    echo "เลือกโหมดการทำงาน:"
    echo ""
    echo "1) 🧠 In-Memory (เร็ว) - ทำทั้งหมดในข้อความเดียว"
    echo "2) 📁 File-Based (ละเอียด) - สร้างไฟล์งานแยก"
    echo ""
    ;;
  
  "mode-memory")
    echo "🧠 In-Memory Mode Activated"
    echo ""
    echo "รูปแบบการใช้งาน:"
    echo '/orchestra memory "<คำอธิบายงาน>" [agents]'
    echo ""
    echo "ตัวอย่าง:"
    echo '/orchestra memory "วิเคราะห์ราคาทองและเขียนรายงาน" researcher,analyst,writer'
    ;;
  
  "mode-file")
    echo "📁 File-Based Mode Activated"
    echo ""
    echo "รูปแบบการใช้งาน:"
    echo '/orchestra file "<คำอธิบายงาน>" [agents]'
    echo ""
    echo "ตัวอย่าง:"
    echo '/orchestra file "วิเคราะห์ข้อมูลขาย Q1" conductor,researcher,analyst,writer'
    ;;
  
  "help")
    cat "$ORCHESTRA_DIR/README.md" | head -50
    ;;
  
  *)
    echo "🎼 Orchestra Multi-Agent System"
    echo ""
    echo "คำสั่ง:"
    echo "  /orchestra init     - แสดงตัวเลือกโหมด"
    echo "  /orchestra memory   - โหมด In-Memory"
    echo "  /orchestra file     - โหมด File-Based"  
    echo "  /orchestra help     - อ่านคู่มือ"
    echo ""
    ;;
esac
