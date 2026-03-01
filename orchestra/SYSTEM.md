# Orchestra System Architecture

## 🎯 Concept
Kimi เป็น Conductor ควบคุม agents เสมือน โดยแบ่งบทบาทในการตอบ

## 🏗️ System Components

### 1. Roles (บทบาท)
```
CONDUCTOR    → วิเคราะห์ แบ่งงาน ประสานงาน
RESEARCHER   → หาข้อมูล รวบรวม facts
ANALYST      → วิเคราะห์ หา insights
CODER        → เขียนโค้ด scripts
WRITER       → เขียนเอกสาร content
```

### 2. Workflow
```
User Request
    ↓
[CONDUCTOR] วิเคราะห์
    ↓
สร้าง Tasks → แบ่งให้ Agents
    ↓
[RESEARCHER] → [ANALYST] → [WRITER]
    ↓
[CONDUCTOR] รวมผล
    ↓
Final Output
```

### 3. File Structure
```
orchestra/
├── roles/          # คำอธิบายบทบาท
├── tasks/          # งานที่ต้องทำ (optional)
├── results/        # ผลลัพธ์ (optional)
└── *.md           # คู่มือ
```

## 🔄 Execution Modes

### Mode 1: In-Memory (Recommended)
ทำทั้งหมดใน conversation เดียว โดยระบุ role ก่อนตอบ:

```
🎼 [CONDUCTOR]: วิเคราะห์...
🔍 [RESEARCHER]: หาข้อมูล...
📊 [ANALYST]: วิเคราะห์...
```

### Mode 2: File-Based (Complex Tasks)
สร้างไฟล์ task แยก แล้วอ่านทีละไฟล์:

```
tasks/task_001_researcher.md
tasks/task_001_analyst.md
tasks/task_001_writer.md
```

## 📝 Prompt Template

```
🎼 [CONDUCTOR] วิเคราะห์งาน:
━━━━━━━━━━━━━━━━━━━━
📋 งาน: [รายละเอียด]
🔧 Agents ที่ใช้: [list]
⏱️  ลำดับ: [steps]
━━━━━━━━━━━━━━━━━━━━

[AGENT 1]: [ทำตามหน้าที่]
[AGENT 2]: [ทำตามหน้าที่]
...

🎼 [CONDUCTOR] สรุปผล:
[รวม output]
```

## ⚡ When to Use

| สถานการณ์ | ใช้ Orchestra? |
|-----------|---------------|
| งานเดี่ยวง่ายๆ | ❌ ไม่ต้อง |
| ต้อง code + analysis | ✅ ใช้ |
| หลายขั้นตอนซับซ้อน | ✅ ใช้ |
| ต้องการ traceability | ✅ ใช้ |
| Research + Report | ✅ ใช้ |

## 🎭 Kimi ทำได้อย่างไร?

Kimi (K2.5) มีความสามารถ:
- ✅ Context window 256K (จำได้เยอะ)
- ✅ Role prompting (สลับบทบาทได้)
- ✅ Multi-step reasoning (คิดหลายขั้นตอน)
- ✅ Code execution (เขียน+รันโค้ด)

จึงสามารถ simulate orchestra ได้โดยไม่ต้องมีหลาย models
