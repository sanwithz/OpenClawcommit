# 🤖 Orchestra Model System

ระบบจัดการงานแบบ Multi-Agent โดย Kimi เป็นผู้ควบคุม (Conductor)

## โครงสร้าง

```
orchestra/
├── README.md                  # คู่มือการใช้งาน
├── SYSTEM.md                  # ระบบและกฎ
├── roles/                     # บทบาทต่างๆ
│   ├── CONDUCTOR.md          # ผู้ควบคุม
│   ├── CODER.md              # เขียนโค้ด
│   ├── ANALYST.md            # วิเคราะห์ข้อมูล
│   ├── WRITER.md             # เขียนเอกสาร
│   └── RESEARCHER.md         # ค้นหาข้อมูล
├── tasks/                     # งานที่ต้องทำ
│   ├── task_001_conductor.md
│   ├── task_001_coder.md
│   ├── task_001_analyst.md
│   └── task_001_final.md
└── results/                   # ผลลัพธ์
    └── result_001.md
```

## วิธีใช้งาน

### 1. สร้างงานใหม่

สร้างไฟล์ใน `tasks/task_XXX_conductor.md` โดย Kimi จะอ่านแล้วแบ่งงาน

### 2. ตัวอย่างการทำงาน

**Input:** ผู้ใช้ขอ "วิเคราะห์ราคาทองคำแล้วสรุปรายงาน"

**Step 1 - Conductor วิเคราะห์:**
- ต้องการข้อมูล → ส่งให้ RESEARCHER
- ต้องการวิเคราะห์ → ส่งให้ ANALYST  
- ต้องการรายงาน → ส่งให้ WRITER

**Step 2 - ทำงานขั้นตอน:**
1. `task_001_researcher.md` → หาข้อมูลราคาทอง
2. `task_001_analyst.md` → วิเคราะห์ trend
3. `task_001_writer.md` → เขียนรายงาน
4. `task_001_final.md` → รวมผล

**Step 3 - Conductor ตรวจสอบ:**
- อ่านผลจากแต่ละ agent
- รวมเป็น output สุดท้าย
- ส่งให้ผู้ใช้

## การเรียกใช้

```bash
# Mode 1: Role-based (ใน conversation เดียว)
[Conductor]: วิเคราะห์งานนี้ให้หน่อย
[Researcher]: หาข้อมูลมา...
[Analyst]: วิเคราะห์ผล...
[Final]: รายงานสรุป...

# Mode 2: File-based
# สร้างไฟล์ task → อ่าน → ประมวลผล → ส่งต่อ
```
