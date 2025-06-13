const fs = require("fs-extra");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "..", "config.json");
let config = require(CONFIG_PATH);

module.exports = {
  config: {
    name: "admin",
    version: "1.0",
    author: "AV YOGESH (Adapted for Telegram by ChatGPT)",
    role: 2,
    shortDescription: "Manage admin permissions",
    category: "utility",
    guide: {
      en: "admin [add | -a] <user_id>\nadmin [remove | -r] <user_id>\nadmin [list | -l]"
    }
  },

  onStart: async function ({ message, args }) {
    const senderId = message.from.id.toString();
    const adminUID = "6800909814"; // Only this ID can remove admins

    switch (args[0]) {
      case "add":
      case "-a": {
        const uids = args.slice(1).filter(arg => /^\d+$/.test(arg));
        if (uids.length === 0) {
          return message.reply("⚠️ Please provide valid user ID(s) to add as admin.");
        }

        const alreadyAdmins = uids.filter(uid => config.adminBot.includes(uid));
        const newAdmins = uids.filter(uid => !config.adminBot.includes(uid));

        config.adminBot.push(...newAdmins);
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

        let reply = "";
        if (newAdmins.length > 0) {
          reply += `✅ Added ${newAdmins.length} admin(s):\n${newAdmins.map(uid => `• ${uid}`).join("\n")}\n`;
        }
        if (alreadyAdmins.length > 0) {
          reply += `⚠ Already admins:\n${alreadyAdmins.map(uid => `• ${uid}`).join("\n")}`;
        }
        return message.reply(reply);
      }

      case "remove":
      case "-r": {
        if (senderId !== adminUID) {
          return message.reply("⚠ | তোর মারে চুদতে দে তাহলে রিমুভ করতে দিব 😏🤣");
        }

        const uids = args.slice(1).filter(arg => /^\d+$/.test(arg));
        if (uids.length === 0) {
          return message.reply("⚠️ Please provide valid user ID(s) to remove from admin.");
        }

        const removed = [];
        const notFound = [];

        for (const uid of uids) {
          if (config.adminBot.includes(uid)) {
            config.adminBot = config.adminBot.filter(id => id !== uid);
            removed.push(uid);
          } else {
            notFound.push(uid);
          }
        }

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

        let reply = "";
        if (removed.length > 0) {
          reply += `✅ Removed ${removed.length} admin(s):\n${removed.map(uid => `• ${uid}`).join("\n")}\n`;
        }
        if (notFound.length > 0) {
          reply += `⚠ Not admins:\n${notFound.map(uid => `• ${uid}`).join("\n")}`;
        }
        return message.reply(reply);
      }

      case "list":
      case "-l": {
        if (config.adminBot.length === 0) {
          return message.reply("👑 No admins currently configured.");
        }
        return message.reply(`👑 Current Admins:\n${config.adminBot.map(uid => `• ${uid}`).join("\n")}`);
      }

      default:
        return message.reply("⚠ Invalid command. Use:\n" + module.exports.config.guide.en);
    }
  }
};
