const fs = require("fs");
const path = require("path");

const logger = require("../utils/logger");

const DATA_DIR = path.join(__dirname, "..", "data copy");

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.name.endsWith(".json")) {
      files.push(full);
    }
  }

  return files;
}

function search(subject, query) {
  const root = path.join(DATA_DIR, "content", subject);

  if (!fs.existsSync(root)) {
    throw new Error("Subject not found");
  }

  const files = walk(root);

  const results = [];

  const needle = query.toLowerCase();

  for (const file of files) {
    let json;

    try {
      json = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
      logger.warn("Skipping unparseable content file during search", {
        file,
        message: err.message,
      });
      continue;
    }

    const text = JSON.stringify(json).toLowerCase();

    if (text.includes(needle)) {
      results.push({
        title: json.title || path.basename(file, ".json"),
        path: file.replace(root, ""),
      });
    }
  }

  return results;
}

module.exports = {
  search,
};
