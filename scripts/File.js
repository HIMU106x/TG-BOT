const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "files",
    version: "1.0",
    author: "Himu Mals",
    role: 2,
    shortDescription: "Create a .js file in the bot cmds folder",
    category: "admin",
    guide: {
      en: "{pn} filename.js <code>\nExample: {pn} hi.js console.log('hello')"
    }
  },

  annieStart: async function ({ bot, msg }) {
    const input = msg.text?.split(" ") || [];
    const [command, fileName, ...rest] = input;

    const code = rest.join(" ").trim();

    if (!fileName || !fileName.endsWith('.js') || !code) {
      return bot.sendMessage(msg.chat.id,
        `❌ Usage:\n\`files filename.js <code>\`\nExample:\n\`files hi.js console.log("hello")\``,
        { parse_mode: "Markdown" }
      );
    }

    const filePath = path.join(__dirname, '..', 'cmds', fileName);

    fs.writeFile(filePath, code, (err) => {
      if (err) {
        console.error(err);
        return bot.sendMessage(msg.chat.id, `❌ Failed to write file.`);
      }
      return bot.sendMessage(msg.chat.id, `✅ File \`${fileName}\` created successfully.\nRestart or reload to use it.`, {
        parse_mode: "Markdown"
      });
    });
  }
};
