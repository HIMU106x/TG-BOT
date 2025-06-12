const axios = require("axios");
const path = require("path");

const GITHUB_TOKEN = "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";
const OWNER = "HIMU106x";
const REPO = "TG-BOT";
const BRANCH = "main";

module.exports = {
  config: {
    name: "save",
    version: "1.0",
    author: "Himu Mals",
    role: 2,
    shortDescription: "Add new file to GitHub",
    category: "utility",
    guide: {
      en: "{pn} filename.js <code | url>"
    }
  },

  annieStart: async function ({ bot, msg }) {
    try {
      const input = msg.text?.split(" ") || [];
      const [command, fileName, ...rest] = input;

      if (!fileName || rest.length === 0) {
        return bot.sendMessage(msg.chat.id, "❌ Usage:\n`gitadd filename.js <code | url>`", {
          parse_mode: "Markdown"
        });
      }

      if (!fileName.endsWith(".js")) {
        return bot.sendMessage(msg.chat.id, "❌ File name must end with `.js`");
      }

      const codeSource = rest.join(" ");
      const filePath = `scripts/cmds/${fileName}`;
      let code;

      if (codeSource.startsWith("http://") || codeSource.startsWith("https://")) {
        const response = await axios.get(codeSource);
        code = response.data;
      } else {
        code = codeSource;
      }

      // Step 1: Get latest commit SHA
      const refRes = await axios.get(`https://api.github.com/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });
      const latestCommitSha = refRes.data.object.sha;

      // Step 2: Get base tree
      const commitRes = await axios.get(`https://api.github.com/repos/${OWNER}/${REPO}/git/commits/${latestCommitSha}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });
      const baseTreeSha = commitRes.data.tree.sha;

      // Step 3: Create blob
      const blobRes = await axios.post(`https://api.github.com/repos/${OWNER}/${REPO}/git/blobs`, {
        content: code,
        encoding: "utf-8"
      }, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });

      // Step 4: Create tree
      const treeRes = await axios.post(`https://api.github.com/repos/${OWNER}/${REPO}/git/trees`, {
        base_tree: baseTreeSha,
        tree: [{
          path: filePath,
          mode: "100644",
          type: "blob",
          sha: blobRes.data.sha
        }]
      }, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });

      // Step 5: Create commit
      const commitCreateRes = await axios.post(`https://api.github.com/repos/${OWNER}/${REPO}/git/commits`, {
        message: `Added ${fileName}`,
        tree: treeRes.data.sha,
        parents: [latestCommitSha]
      }, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });

      // Step 6: Update branch ref
      await axios.patch(`https://api.github.com/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
        sha: commitCreateRes.data.sha
      }, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });

      return bot.sendMessage(msg.chat.id, `✅ \`${fileName}\` has been added to [${REPO}](https://github.com/${OWNER}/${REPO}/tree/${BRANCH}/scripts/cmds/)`, {
        parse_mode: "Markdown"
      });

    } catch (error) {
      console.error("GitHub Upload Error:", error.response?.data || error.message);
      return bot.sendMessage(msg.chat.id, "❌ Failed to add file. Check logs or try again.");
    }
  }
};
