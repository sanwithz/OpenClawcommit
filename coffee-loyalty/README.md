# ☕ Coffee Shop Loyalty System

ระบบสะสมคะแนนร้านกาแฟ - ออกแบบโดย **Claude Opus** + ดำเนินการโดย **Kimi (Boss)**

## 🎯 Features

### 💳 ระบบคะแนน
- 1 บาท = 1 คะแนน (Bronze)
- Tier multiplier: Bronze (x1) → Silver (x1.2) → Gold (x1.5) → Platinum (x2)
- แลกคะแนน: 100 points = 10 บาท

### 👥 Tier System
| Tier | ยอดซื้อสะสม | Multiplier |
|------|------------|-----------|
| Bronze | เริ่มต้น | x1 |
| Silver | 1,000+ | x1.2 |
| Gold | 5,000+ | x1.5 |
| Platinum | 10,000+ | x2 |

### 📱 Staff Dashboard
- ค้นหาลูกค้าด้วยเบอร์โทร
- สร้างออเดอร์ + คำนวณคะแนนอัตโนมัติ
- แสดง tier และประวัติ

## 🏗️ Architecture (by Claude Opus)

```
┌─────────────────┐
│  PostgreSQL     │
│  - customers    │
│  - orders       │
│  - points_tx    │
│  - rewards      │
└────────┬────────┘
         │
┌────────▼────────┐
│  Express API    │
│  /customers     │
│  /orders        │
│  /rewards       │
└────────┬────────┘
         │
┌────────▼────────┐
│  HTML Dashboard │
└─────────────────┘
```

## 🚀 Getting Started

### 1. Setup Database
```bash
cd coffee-loyalty/database
psql -U postgres -f schema.sql
```

### 2. Start Backend
```bash
cd coffee-loyalty/backend
npm install
cp .env.example .env
# แก้ไข DATABASE_URL ใน .env
npm run dev
```

### 3. Open Dashboard
เปิดไฟล์ `frontend/staff-dashboard.html` ใน browser

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customers/register` | ลงทะเบียนลูกค้า |
| GET | `/api/customers/:phone` | ดูข้อมูลลูกค้า |
| POST | `/api/orders` | สร้างออเดอร์ |
| GET | `/api/rewards` | ดูรางวัล |

## 🎭 Model Switching Workflow ที่ใช้

1. **Kimi (Boss)** วิเคราะห์งาน → ตัดสินใจใช้ Claude Opus
2. **Claude Opus** ออกแบบ architecture + เขียนโค้ดหลัก
3. **Kimi (Boss)** รับผล → สร้างไฟล์ + จัดการระบบ

**Result:** ได้ระบบที่มี architecture ดีจาก Claude + บริหารจัดการโดย Kimi

## 📝 TODO

- [ ] Customer PWA (ดูคะแนนของตัวเอง)
- [ ] QR Code สำหรับแลกรางวัล
- [ ] แจ้งเตือนโปรโมชั่น
- [ ] Admin dashboard

---
**Created:** 2026-02-26  
**By:** Claude Opus + Kimi Boss System
