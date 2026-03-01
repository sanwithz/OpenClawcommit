#!/usr/bin/env node
/**
 * /orchestra Command Handler
 * 
 * Usage: Send "/orchestra" in Telegram to trigger multi-agent workflow
 * Features: Inline buttons for mode selection, guided workflow
 */

const ORCHESTRA_INTRO = `🎼 **Orchestra Multi-Agent System**

เลือกโหมดการทำงาน:`;

const MODE_BUTTONS = {
  inline_keyboard: [
    [
      { text: "🧠 In-Memory (เร็ว)", callback_data: "orchestra_mode_memory" },
      { text: "📁 File-Based (ละเอียด)", callback_data: "orchestra_mode_file" }
    ],
    [
      { text: "❌ ยกเลิก", callback_data: "orchestra_cancel" }
    ]
  ]
};

const ROLE_EMOJIS = {
  conductor: "🎼",
  researcher: "🔍",
  analyst: "📊",
  coder: "💻",
  writer: "📝"
};

const WORKFLOW_TEMPLATES = {
  memory: `
🎼 **[CONDUCTOR]** วิเคราะห์งาน:
━━━━━━━━━━━━━━━━━━━━
📋 งาน: {task}
🔧 Agents ที่ใช้: {agents}
⏱️ ลำดับ: {steps}
━━━━━━━━━━━━━━━━━━━━

{execution}

🎼 **[CONDUCTOR]** สรุปผล:
{result}
`,
  file: `
📁 **File-Based Workflow**

สร้างไฟล์งาน:
1. <code>orchestra/tasks/task_{id}_conductor.md</code>
2. <code>orchestra/tasks/task_{id}_{agent}.md</code>
3. <code>orchestra/results/result_{id}.md</code>

เริ่มทำงานตามลำดับ...
`
};

// Export for OpenClaw integration
module.exports = {
  name: "orchestra",
  description: "Trigger multi-agent workflow with mode selection",
  
  // Main entry point
  async onCommand({ message, args, bot }) {
    await bot.sendMessage(message.chat.id, ORCHESTRA_INTRO, {
      parse_mode: "Markdown",
      reply_markup: MODE_BUTTONS
    });
  },

  // Handle callback queries from inline buttons
  async onCallback({ query, bot }) {
    const data = query.data;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    // Answer the callback to stop loading state
    await bot.answerCallbackQuery(query.id);

    if (data === "orchestra_cancel") {
      await bot.editMessageText("❌ ยกเลิก Orchestra", {
        chat_id: chatId,
        message_id: messageId
      });
      return;
    }

    if (data === "orchestra_mode_memory") {
      await bot.editMessageText(
        `🧠 **In-Memory Mode**\n\n` +
        `บอกงานที่ต้องการให้ทำ พร้อมระบุว่าต้องการ agents ไหน:\n\n` +
        `ตัวอย่าง:\n` +
        `<code>วิเคราะห์ราคาทอง + เขียนรายงาน ใช้ Researcher + Analyst + Writer</code>`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: "HTML"
        }
      );
      return;
    }

    if (data === "orchestra_mode_file") {
      await bot.editMessageText(
        `📁 **File-Based Mode**\n\n` +
        `บอกงานที่ต้องการ ผมจะสร้างไฟล์ task แยกตาม agents:\n\n` +
        `ตัวอย่าง:\n` +
        `<code>สร้างงานวิเคราะห์ข้อมูลขายสินค้า Q1 แบบ file-based</code>`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: "HTML"
        }
      );
      return;
    }
  },

  // Helper to format multi-agent response
  formatMultiAgentResponse(agents, task) {
    const agentList = agents.map(a => `${ROLE_EMOJIS[a.toLowerCase()]} ${a}`).join(" → ");
    
    return {
      conductor_analysis: `
🎼 **[CONDUCTOR]** วิเคราะห์งาน:
━━━━━━━━━━━━━━━━━━━━
📋 งาน: ${task}
🔧 Agents: ${agentList}
⏱️ ลำดับ: ${agents.length} ขั้นตอน
━━━━━━━━━━━━━━━━━━━━`,
      
      execution_header: (agent) => 
        `\n${ROLE_EMOJIS[agent.toLowerCase()] || "🔹"} **[${agent.toUpperCase()}]:**`,
      
      final_header: "\n🎼 **[CONDUCTOR]** สรุปผล:
━━━━━━━━━━━━━━━━━━━━"
    };
  }
};

// CLI test mode
if (require.main === module) {
  console.log("🎼 Orchestra Command Module");
  console.log("Export and integrate with your Telegram bot handler");
}
