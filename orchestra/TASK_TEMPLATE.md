# Orchestra Task Template

## วิธีสร้างงานใหม่

### Step 1: Conductor วิเคราะห์

สร้างไฟล์: `tasks/task_XXX_conductor.md`

```markdown
# Task XXX - Conductor Analysis

## งานที่ได้รับ
[รายละเอียดงานจากผู้ใช้]

## การวิเคราะห์
- ต้องใช้ Agents: [RESEARCHER, ANALYST, WRITER]
- ลำดับ: RESEARCHER → ANALYST → WRITER

## Task Files ที่ต้องสร้าง
1. task_XXX_researcher.md
2. task_XXX_analyst.md
3. task_XXX_writer.md
4. task_XXX_final.md
```

### Step 2: สร้าง Task แต่ละ Agent

#### task_XXX_researcher.md
```markdown
🔍 [RESEARCHER TASK]
━━━━━━━━━━━━━━━━━━━━
หัวข้อ: [topic]
แหล่งข้อมูล: web search
ขอบเขต: [scope]
━━━━━━━━━━━━━━━━━━━━
```

#### task_XXX_analyst.md
```markdown
📊 [ANALYST TASK]
━━━━━━━━━━━━━━━━━━━━
ข้อมูล: [จาก researcher]
ประเภท: [analysis type]
วัตถุประสงค์: [goal]
━━━━━━━━━━━━━━━━━━━━
```

#### task_XXX_writer.md
```markdown
✍️ [WRITER TASK]
━━━━━━━━━━━━━━━━━━━━
ประเภท: [document type]
หัวข้อ: [title]
ข้อมูล: [จาก analyst]
รูปแบบ: [style]
━━━━━━━━━━━━━━━━━━━━
```

#### task_XXX_final.md
```markdown
# Task XXX - Final Output

## ผลงานจากแต่ละ Agent
- [Researcher]: [สรุปผล]
- [Analyst]: [สรุปผล]
- [Writer]: [สรุปผล]

## Output สุดท้าย
[Conductor รวมผล]
```

### Step 3: บันทึกผล

บันทึกใน: `results/result_XXX.md`
