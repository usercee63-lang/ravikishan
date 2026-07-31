const fs = require("fs");
const path = require("path");

const logger = require("../utils/logger");
const StudyMaterial = require("../models/StudyMaterial");
const { isDbUp } = require("../config/db");

const DATA_DIR = path.join(__dirname, "..", "data copy");

function readContentFile(subject, chapter, topic) {
  const filePath = path.join(
    DATA_DIR,
    "content",
    subject,
    chapter,
    `${topic}.json`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error("Content not found");
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function getContentFromDb(subject, chapter, topic) {
  const doc = await StudyMaterial.findOne({
    where: { subject, chapter, topic },
    attributes: ["data"],
    raw: true,
  });

  return doc ? doc.data : null;
}

async function getContent(subject, chapter, topic) {
  if (isDbUp()) {
    try {
      const fromDb = await getContentFromDb(subject, chapter, topic);

      if (fromDb) {
        return fromDb;
      }
    } catch (err) {
      logger.warn("Database content lookup failed, using file fallback", {
        subject,
        chapter,
        topic,
        message: err.message,
      });
    }
  }

  return readContentFile(subject, chapter, topic);
}

module.exports = {
  getContent,
};
