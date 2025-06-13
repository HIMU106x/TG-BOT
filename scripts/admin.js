const fs = require('fs'); const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../config.json'); // Adjust path as needed

module.exports = { config: { name: "admin", version: "1.0", author: "AV YOGESH (Adapted for Telegram by ChatGPT)", role: 2, shortDescription: "Manage admin permissions", category: "utility", guide: { en: admin [add | -a] <user_id>\nadmin [remove | -r] <user_id>\nadmin [list | -l] } },

annieStart: async function ({ bot, msg }) { const input = msg.text.trim().split(/\s+/); const [command, subCommand, ...args] = input;

let config;
try {
  config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
} catch (err) {
  return bot.sendMessage(msg.chat.id, '❌ Failed to read config.json');
}

const isOwner = msg.from.id.toString() === '6800909814';

switch (subCommand) {
  case "add":
  case "-a": {
    if (args.length === 0)
      return bot.sendMessage(msg.chat.id, `⚠️ Please provide user ID(s).`);

    const newAdmins = args.filter(id => !config.adminBot.includes(id));
    const alreadyAdmins = args.filter(id => config.adminBot.includes(id));

    config.adminBot.push(...newAdmins);
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

    let messageText = '';
    if (newAdmins.length > 0) messageText += `✅ Added Admin(s):\n${newAdmins.join("\n")}`;
    if (alreadyAdmins.length > 0) messageText += `\n⚠️ Already Admin(s):\n${alreadyAdmins.join("\n")}`;
    return bot.sendMessage(msg.chat.id, messageText);
  }

  case "remove":
  case "-r": {
    if (!isOwner) {
      return bot.sendMessage(msg.chat.id, "⚠️ তোর মারে চুদতে দে তাহলে রিমুভ করতে দিব 😏🤣");
    }

    if (args.length === 0)
      return bot.sendMessage(msg.chat.id, `⚠️ Please provide user ID(s).`);

    const removed = args.filter(id => config.adminBot.includes(id));
    config.adminBot = config.adminBot.filter(id => !removed.includes(id));
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

    const notAdmin = args.filter(id => !removed.includes(id));

    let messageText = '';
    if (removed.length > 0) messageText += `✅ Removed Admin(s):\n${removed.join("\n")}`;
    if (notAdmin.length > 0) messageText += `\n⚠️ Not Admin(s):\n${notAdmin.join("\n")}`;
    return bot.sendMessage(msg.chat.id, messageText);
  }

  case "list":
  case "-l": {
    if (config.adminBot.length === 0)
      return bot.sendMessage(msg.chat.id, "👑 No admins configured.");
    return bot.sendMessage(msg.chat.id, `👑 Admin List:\n${config.adminBot.join("\n")}`);
  }

  default:
    return bot.sendMessage(msg.chat.id, "❌ Invalid usage. Try: admin [add|remove|list] <user_id>");
}

} };

