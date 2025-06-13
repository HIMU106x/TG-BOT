const fs = require("fs-extra");
const path = require("path");
const config = require("../config.json");

module.exports = {
  config: {
    name: "save",
    version: "1.0",
    author: "Himu & ChatGPT",
    description: "Save a code snippet to a file",
    usage: ".save <filename> {code}",
    role: 2,
    category: "utility"
  },

  onStart: async function ({ args, message, event }) {
    const userId = event.sender?.id?.toString();
    if (!config.adminBot.includes(userId)) {
      return message.reply("❌ Only bot admins can use this command.");
    }

    const input = args.join(" ");
    const match = input.match(/^(\S+)\s+\{([\s\S]+)\}$/);

    if (!match) {
      return message.reply("❗ Invalid format. Use: `.save <filename> {code}`\nExample: `.save test.js {const a = 5;}`");
    }

    const filename = match[1];
    const code = match[2];

    const saveDir = path.join(__dirname, "..", "saved");
    const filePath = path.join(saveDir, filename);

    try {
      await fs.ensureDir(saveDir);
      await fs.writeFile(filePath, code);
      return message.reply(`✅ File \`${filename}\` saved successfully in /saved`);
    } catch (err) {
      console.error(err);
      return message.reply("⚠️ Error saving the file.");
    }
  }
};
