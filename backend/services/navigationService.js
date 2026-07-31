const fs = require("fs");
const path = require("path");

const logger = require("../utils/logger");

const DATA_DIR = path.join(__dirname, "..", "data copy");

function getNavigation(subject) {
  const filePath = path.join(DATA_DIR, "navigation", `${subject}.json`);

  if (!fs.existsSync(filePath)) {
    logger.debug("Navigation file not found", { filePath });
    throw new Error("Subject not found");
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = {
  getNavigation,
};
