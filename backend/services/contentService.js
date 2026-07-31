const fs = require("fs");
const path = require("path");

const logger = require("../utils/logger");

const DATA_DIR = path.join(__dirname, "..", "data copy");

function getContent(subject, chapter, topic) {
  const filePath = path.join(
    DATA_DIR,
    "content",
    subject,
    chapter,
    `${topic}.json`
  );

  if (!fs.existsSync(filePath)) {
    logger.debug("Content file not found", { filePath });
    throw new Error("Content not found");
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = {
  getContent,
};
