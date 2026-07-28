const fs = require("fs");
const path = require("path");

function getNavigation(subject) {
  const filePath = path.join(
  __dirname,
  "..",
  "data copy",
  "navigation",
  `${subject}.json`
);

  console.log("Looking for:", filePath);

  console.log("Exists:", fs.existsSync(filePath));

  if (!fs.existsSync(filePath)) {
    throw new Error("Subject not found");
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = {
  getNavigation,
};
