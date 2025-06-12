const os = require("os");
const process = require("process");

module.exports = {
  config: {
    name: "system",
    version: "2.1",
    author: "Himu Mals",
    category: "UTILITY",
    role: 1
  },

  annieStart: async function ({ bot, msg }) {
    try {
      const loadingMsg = await bot.sendMessage(msg.chat.id, "🤖 Mals_Ai: Gathering system information...");

      const steps = [
        "🤖 Mals_Ai: Gathering system information.",
        "🤖 Mals_Ai: Gathering system information..",
        "🤖 Mals_Ai: Gathering system information...",
        "🤖 Mals_Ai: Almost done!"
      ];

      for (const step of steps) {
        await new Promise(res => setTimeout(res, 600));
        await bot.editMessageText(step, {
          chat_id: msg.chat.id,
          message_id: loadingMsg.message_id
        });
      }

      const formatUptime = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${d}d ${h}h ${m}m ${s}s`;
      };

      const uptime = os.uptime();
      const totalMem = os.totalmem() / 1024 / 1024 / 1024;
      const freeMem = os.freemem() / 1024 / 1024 / 1024;
      const usedMem = totalMem - freeMem;
      const cpuInfo = os.cpus();
      const cpuModel = cpuInfo[0]?.model || "Unknown CPU";
      const cpuCount = cpuInfo.length;
      const loadAvg = os.loadavg().map(n => n.toFixed(2)).join(" | ");

      const finalOutput = 
`🖥️ *Mals_Ai System Status*

🔧 *CPU:* ${cpuModel}
🧠 *Cores:* ${cpuCount}
📊 *Load Average:* ${loadAvg}

💾 *Memory:* ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB
🕒 *Uptime:* ${formatUptime(uptime)}

🗂️ *OS:* ${os.type()} ${os.release()}
💻 *Platform:* ${os.platform()} - ${os.arch()}
🧪 *Node.js:* ${process.version}

👑 *Powered by:* Himu Mals`;

      await bot.editMessageText(finalOutput, {
        chat_id: msg.chat.id,
        message_id: loadingMsg.message_id,
        parse_mode: "Markdown"
      });

    } catch (error) {
      console.error("❌ System Info Error:", error);
      await bot.sendMessage(msg.chat.id, "❌ Mals_Ai: Failed to fetch system info.\n\n" + error.message);
    }
  }
};
