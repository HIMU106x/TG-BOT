const fs = require("fs");
const path = require("path");
const axios = require("axios");

const GITHUB_TOKEN = "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";
const OWNER = "Tanvir0999";
const REPO = "stuffs";
const BRANCH = "main";

module.exports = {
  config: {
    name: "save",
    aliases: ["ghsave"],
    version: "1.0",
    author: "Himu Mals",
    role: 2,
    shortDescription: "Upload local file to GitHub",
    category: "utility",
    guide: {
      en: "{pn} filename.ext",
    },
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("⚠️ Provide a filename to upload (e.g., `hello.py`)");

    const fileName = args[0];
    const localPath = path.join("scripts", "cmds", fileName);

    if (!fs.existsSync(localPath)) return message.reply("❌ File not found in scripts/cmds.");

    const content = fs.readFileSync(localPath, "utf-8");
    const repoPath = `telegram_uploads/${fileName}`; // target folder inside GitHub repo

    try {
      // Check if the file exists in the repo to get its SHA
      let sha = null;
      try {
        const existing = await axios.get(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${repoPath}`, {
          headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        sha = existing.data.sha;
      } catch (_) {
        // File doesn't exist, sha stays null
      }

      const upload = await axios.put(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${repoPath}`, {
        message: `Uploaded via Telegram bot: ${fileName}`,
        content: Buffer.from(content).toString("base64"),
        branch: BRANCH,
        ...(sha && { sha })
      }, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json"
        }
      });

      const htmlURL = upload.data.content.html_url;
      const rawURL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${repoPath}`;

      message.reply(`✅ File uploaded successfully!\n\n🌐 GitHub Page: ${htmlURL}\n📄 Raw File: ${rawURL}`);

    } catch (error) {
      console.error("GitHub Upload Error:", error.response?.data || error.message);
      message.reply("❌ Upload failed. Check console/log for details.");
    }
  }
};
