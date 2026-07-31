const fs = require("fs");
const path = require("path");

const logger = require("../utils/logger");
const Subject = require("../models/Subject");
const { isDbUp } = require("../config/db");

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
  const doc = await Subject.findOne({
    where: { id: subject },
    attributes: ["name", "chapters"],
    raw: true,
  });

  if (!doc) {
    return null;
  }

  return {
    name: doc.name,
    chapters: doc.chapters,
  };
}

async function getNavigation(subject) {
  if (isDbUp()) {
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
