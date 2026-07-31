const fs = require("fs");
const path = require("path");

const { Op, literal } = require("sequelize");

const logger = require("../utils/logger");
const StudyMaterial = require("../models/StudyMaterial");
const { isDbUp } = require("../config/db");

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

function searchFiles(subject, query) {
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

async function searchDb(subject, query) {
  const needle = String(query || "").toLowerCase().trim();
  const escaped = needle.replace(/'/g, "''");

  const or = [{ title: { [Op.iLike]: `%${needle}%` } }];

  if (needle) {
    or.push(literal(`data->>'summary' ILIKE '%${escaped}%'`));
    or.push(
      literal(
        `EXISTS (SELECT 1 FROM jsonb_array_elements_text(data->'notes') AS n WHERE n ILIKE '%${escaped}%')`
      )
    );
  }

  const docs = await StudyMaterial.findAll({
    where: { subject, [Op.or]: or },
    attributes: ["title", "chapter", "topic"],
    limit: 50,
    raw: true,
  });

  return docs.map((doc) => ({
    title: doc.title || doc.topic,
    chapter: doc.chapter,
    topic: doc.topic,
    path: `${doc.chapter}/${doc.topic}.json`,
  }));
}

async function search(subject, query) {
  if (isDbUp()) {
    try {
      return await searchDb(subject, query);
    } catch (err) {
      logger.warn("Database search failed, using file fallback", {
        subject,
        message: err.message,
      });
    }
  }

  return searchFiles(subject, query);
}

module.exports = {
  search,
};
