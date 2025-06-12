const fs = require("fs");
const path = require("path");
const axios = require("axios");

const GITHUB_TOKEN = "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";
const OWNER = "HIMU106x";
const REPO = "stuffs";
const BRANCH = "main";
const ALLOWED_UID = 6800909814; // Only this Telegram user can use the command

module.exports = {
  config: {
    name: "save",
    aliases: ["ghsave"],
    version: "1.0",
    author: "Himu Mals",
    role: 0,
    shortDescription: "Upload local file to GitHub",
    category: "utility",
    guide: {
      en: "{pn} filename.ext",
    },
  },

  annieStart: async function ({ message, args, msg }) {
    if (msg.from.id !== ALLOWED_UID) {
      return message.reply("❌ You are not authorized to use this command.");
    }

    if (!args[0]) return message.reply("⚠️ Provide a filename to upload (e.g., `code.py`)");

    const fileName = args[0];
    const localPath = path.join("scripts", "cmds", fileName);

    if (!fs.existsSync(localPath)) return message.reply("❌ File not found in scripts/cmds.");

    const content = fs.readFileSync(localPath, "utf-8");
    const repoPath = `telegram_uploads/${fileName}`;

    try {
      let sha = null;
      try {
        const res = await axios.get(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${repoPath}`, {
          headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        sha = res.data.sha;
      } catch (_) {}

      const res = await axios.put(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${repoPath}`, {
        message: `Upload via Telegram bot: ${fileName}`,
        content: Buffer.from(content).toString("base64"),
        branch: BRANCH,
        ...(sha && { sha })
      }, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json"
        }
      });

      const htmlUrl = res.data.content.html_url;
      const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${repoPath}`;

      message.reply(`✅ Uploaded successfully!\n\n🔗 GitHub: ${htmlUrl}\n🧾 Raw: ${rawUrl}`);

    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      message.reply("❌ Failed to upload to GitHub.");
    }
  }
};
