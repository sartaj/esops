const fs = require("fs");
const touch = require("touch");
const updateGeneratedString = require("update-generated-text");

function replaceGeneratedStringInFile(
  startLine,
  endLine,
  newContents,
  filePath
) {
  touch.sync(filePath);
  const file = fs.readFileSync(filePath, "utf-8");
  const updated = updateGeneratedString(startLine, endLine, newContents, file);
  fs.writeFileSync(filePath, updated);
}

module.exports = replaceGeneratedStringInFile;
