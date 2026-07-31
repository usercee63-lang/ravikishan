const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");

const logger = require("../utils/logger");
const Subject = require("../models/Subject");

const DATA_DIR = path.join(__dirname, "..", "data copy");

function readNavigationFile(subject) {
  const filePath = path.join(DATA_DIR, "navigation", `${subject}.json`);

  if (!fs.existsSync(filePath)) {
    logger.debug("Navigation file not found", { filePath });
    throw new Error("Subject not found");
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function getNavigationFromDb(subject) {
  const doc = await Subject.findOne(
    { id: subject },
    { _id: 0, name: 1, chapters: 1 }
  ).lean();

  if (!doc) {
    return null;
  }

  return {
    name: doc.name,
    chapters: doc.chapters,
  };
}

async function getNavigation(subject) {
  if (mongoose.connection.readyState === 1) {
    try {
      const fromDb = await getNavigationFromDb(subject);

      if (fromDb) {
        return fromDb;
      }
    } catch (err) {
      logger.warn("Database navigation lookup failed, using file fallback", {
        subject,
        message: err.message,
      });
    }
  }

  return readNavigationFile(subject);
}

module.exports = {
  getNavigation,
};
