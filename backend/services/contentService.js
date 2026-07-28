const fs = require("fs");
const path = require("path");

function getContent(subject, chapter, topic) {
  const filePath = path.join(
    __dirname,
    "..",
    "data copy",
    "content",
    subject,
    chapter,
    `${topic}.json`
  );

  console.log("Looking for:", filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error("Content not found");
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = {
  getContent,
};