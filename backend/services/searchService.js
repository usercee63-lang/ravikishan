const fs = require("fs");
const path = require("path");

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
  const root = path.join(__dirname, "..", "data", subject);

  if (!fs.existsSync(root)) {
    throw new Error("Subject not found");
  }

  const files = walk(root);

  const results = [];

  for (const file of files) {
    const json = JSON.parse(fs.readFileSync(file, "utf8"));

    const text = JSON.stringify(json).toLowerCase();

    if (text.includes(query.toLowerCase())) {
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
