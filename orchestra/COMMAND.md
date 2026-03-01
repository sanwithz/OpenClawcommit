# Orchestra Command Handler for Telegram

## วิธีใช้งาน

### 1. พิมพ์ "/orchestra"
บอทจะแสดง inline buttons ให้เลือก:
- 🧠 **In-Memory** (เร็ว) - ทำทั้งหมดในข้อความเดียว
- 📁 **File-Based** (ละเอียด) - สร้างไฟล์งานแยก

### 2. เลือกโหมด

**In-Memory:** บอกงานที่ต้องการ + agents ที่ใช้
```
วิเคราะห์ราคาทองและเขียนรายงาน ใช้ Researcher + Analyst + Writer
```

**File-Based:** บอกงาน ระบบจะสร้างไฟล์:
- `orchestra/tasks/task_XXX_conductor.md`
- `orchestra/tasks/task_XXX_researcher.md`
- `orchestra/tasks/task_XXX_analyst.md`
- `orchestra/results/result_XXX.md`

### 3. Agents ที่มี
| Agent | Emoji | หน้าที่ |
|-------|-------|--------|
| CONDUCTOR | 🎼 | วิเคราะห์ แบ่งงาน ประสาน |
| RESEARCHER | 🔍 | หาข้อมูล รวบรวม facts |
| ANALYST | 📊 | วิเคราะห์ หา insights |
| CODER | 💻 | เขียนโค้ด scripts |
| WRITER | 📝 | เขียนเอกสาร content |

## ตัวอย่างคำสั่ง

```
/orchestra
→ เลือก: 🧠 In-Memory
→ พิมพ์: "วิเคราะห์ trend ราคา Bitcoin แล้วสรุปรายงาน"
→ ผล: 🎼 [CONDUCTOR] → 🔍 [RESEARCHER] → 📊 [ANALYST] → 📝 [WRITER] → 🎼 [CONDUCTOR สรุป]
```

## ไฟล์ที่เกี่ยวข้อง
- `command/orchestra-cmd.js` - Handler module
- `scripts/orchestra.sh` - CLI wrapper
