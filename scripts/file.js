const fs = require('fs');
const path = require('path');

// Replace these with your actual admin Telegram user IDs
const ADMIN_IDS = ['6800909814', '']; // Himu + someone else

module.exports = {
  config: {
    name: "file",
    version: "1.0",
    author: "Himu Mals",
    shortDescription: "Send file content from bot",
    category: "Admin",
    role: 0,
    guide: {
      en: "{pn} filename.js"
    }
  },

  annieStart: async function ({ bot, msg }) {
    const userId = msg.from.id.toString();

    if (!ADMIN_IDS.includes(userId)) {
      return bot.sendMessage(msg.chat.id, `⛔ Only bot admins can use this command.\nMy Sensei Himu can do this.`);
    }

    const args = msg.text?.split(/\s+/).slice(1);
    if (!args.length) {
      return bot.sendMessage(msg.chat.id, `⚠️ Provide the file name.\nUsage: file <file_name>`);
    }

    let fileName = args[0];
    if (!fileName.endsWith('.js')) {
      fileName += '.js';
    }

    const filePath = path.join(__dirname, fileName);

    if (!fs.existsSync(filePath)) {
      return bot.sendMessage(msg.chat.id, `❌ File \`${fileName}\` not found. Are you sure it's correct?`, { parse_mode: "Markdown" });
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // If content is too long, send as file instead of text
      if (content.length > 4000) {
        return bot.sendDocument(msg.chat.id, filePath, {}, {
          filename: fileName,
          contentType: "text/javascript"
        });
      } else {
        return bot.sendMessage(msg.chat.id, `📄 *${fileName}*\n\n\`\`\`js\n${content}\n\`\`\``, {
          parse_mode: "Markdown"
        });
      }
    } catch (err) {
      console.error(err);
      return bot.sendMessage(msg.chat.id, `❌ Error reading the file. Check logs.`);
    }
  }
};
