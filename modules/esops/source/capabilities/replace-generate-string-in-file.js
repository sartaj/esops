const fs = require("fs");
const touch = require("touch");
const replaceGeneratedText = require("string-replace-or-concat");

function replaceGeneratedStringInFile(
  startLine,
  endLine,
  newContents,
  filePath
) {
  touch.sync(filePath);
  const file = fs.readFileSync(filePath, "utf-8");
  const updated = replaceGeneratedText(startLine, endLine, newContents, file);
  fs.writeFileSync(filePath, updated);
}

module.exports = replaceGeneratedStringInFile;
