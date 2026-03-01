# Orchestra System - Quick Start Guide

## 🚀 เริ่มใช้งาน

### Mode 1: Role-based (เร็วที่สุด)

พิมพ์ใน chat โดยตรง:

```
🎼 [CONDUCTOR]: วิเคราะห์งานนี้ → แบ่งให้ agents

[RESEARCHER]: หาข้อมูล...
[ANALYST]: วิเคราะห์...
[WRITER]: เขียนรายงาน...
```

### Mode 2: File-based (สำหรับงานซับซ้อน)

1. สร้าง task file ใน `tasks/`
2. ระบุ `[AGENT]` ที่ต้องการ
3. อ่านผลลัพธ์จาก `results/`

## 📋 ตัวอย่างการใช้งาน

### ตัวอย่าง 1: วิเคราะห์หุ้น
```
🎼 [CONDUCTOR]: วิเคราะห์ AAPL วันนี้

🔍 [RESEARCHER]: หาราคา AAPL, ข่าวล่าสุด
📊 [ANALYST]: วิเคราะห์ trend จากข้อมูล
💻 [CODER]: คำนวณ EMA, RSI
✍️ [WRITER]: สรุปรายงานการลงทุน
```

### ตัวอย่าง 2: เขียนโปรแกรม
```
🎼 [CONDUCTOR]: สร้าง script ดึงข้อมูล

💻 [CODER]: เขียน Python script
🔍 [RESEARCHER]: หา API documentation
✍️ [WRITER]: เขียน README
```

### ตัวอย่าง 3: รายงานประจำสัปดาห์
```
🎼 [CONDUCTOR]: สร้าง weekly report

🔍 [RESEARCHER]: รวบรวมข้อมูลสัปดาห์
📊 [ANALYST]: วิเคราะห์ความคืบหน้า
✍️ [WRITER]: เขียนรายงาน
```

## 🎯 Best Practices

1. **เริ่มด้วย Conductor** — ให้ Kimi วิเคราะห์ก่อนเสมอ
2. **ระบุ Agent ชัดเจน** — ใช้ `[AGENT]:` นำหน้า
3. **ส่งต่อข้อมูล** — ผลจาก agent ก่อนหน้าเป็น input ของ agent ถัดไป
4. **ตรวจสอบผล** — Conductor ตรวจก่อนส่งให้ user

## 🆘 ถ้างานเดี่ยวใช้ Agent เดียว

ไม่ต้องใช้ Orchestra ก็ได้ — Kimi ทำได้เลย

ใช้ Orchestra เมื่อ:
- ต้องหลายทักษะ (code + analysis + writing)
- งานซับซ้อนหลายขั้นตอน
- ต้องการ workflow ที่ traceable
