const os = require("os");
const process = require("process");

module.exports = {
    config: {
        name: "system",
        version: "2.0",
        author: "Himu Mals",
        category: "UTILITY",
        role: 1
    },

    annieStart: async function({ bot, msg }) {
        try {
            const loadingMsg = await bot.sendMessage(msg.chat.id, "Gathering system information");

            const animationSteps = [
                "Gathering system information",
                "Gathering system information please wait",
                "Almost done retrieving system status"
            ];

            for (let step of animationSteps) {
                await new Promise(res => setTimeout(res, 500));
                await bot.editMessageText(step, {
                    chat_id: msg.chat.id,
                    message_id: loadingMsg.message_id
                });
            }

            const uptime = os.uptime();
            const formatUptime = (seconds) => {
                const d = Math.floor(seconds / (3600 * 24));
                const h = Math.floor((seconds % (3600 * 24)) / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                const s = Math.floor(seconds % 60);
                return `${d}d ${h}h ${m}m ${s}s`;
            };

            const totalMem = os.totalmem() / (1024 ** 3);
            const freeMem = os.freemem() / (1024 ** 3);
            const usedMem = totalMem - freeMem;

            const cpuModel = os.cpus()[0].model;
            const cpuCount = os.cpus().length;
            const loadAvg = os.loadavg().map(n => n.toFixed(2)).join(" | ");

            const finalOutput =
`🖥️ System Status Panel

🔧 CPU: ${cpuModel}
🧠 Cores: ${cpuCount}
📊 Load Average: ${loadAvg}

💾 Memory Usage: ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB
🕒 Uptime: ${formatUptime(uptime)}

🗂️ OS: ${os.type()} ${os.release()}
💻 Platform: ${os.platform()} - ${os.arch()}
🧪 Node.js Version: ${process.version}

👑 Powered by Himu Mals`;

            await new Promise(res => setTimeout(res, 800));
            await bot.editMessageText(finalOutput, {
                chat_id: msg.chat.id,
                message_id: loadingMsg.message_id
            });

        } catch (error) {
            console.error("System Info Error:", error);
            await bot.sendMessage(msg.chat.id, "An error occurred while retrieving system info.");
        }
    }
};
