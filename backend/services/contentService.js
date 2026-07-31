const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");

const logger = require("../utils/logger");
const StudyMaterial = require("../models/StudyMaterial");

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
  const doc = await StudyMaterial.findOne(
    { subject, chapter, topic },
    { _id: 0, data: 1 }
  ).lean();

  return doc ? doc.data : null;
}

async function getContent(subject, chapter, topic) {
  if (mongoose.connection.readyState === 1) {
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
