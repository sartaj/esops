function stringReplaceOrConcat(
  startString,
  endString,
  newContents,
  fullString
) {
  // TODO: Force append lines as new lines
  const startLine = `\n${startString}\n`;
  const endLine = `\n${endString}\n`;

  const oldStringSearch = `${startLine}(.*)${endLine}`;
  const searchRegex = new RegExp(oldStringSearch, `s`, `S`);

  const newText = `${startLine}${newContents}${endLine}`;
  const results =
    fullString.search(searchRegex) > -1
      ? fullString.replace(searchRegex, newText)
      : fullString.concat(newText);
  return results;
}

module.exports = stringReplaceOrConcat;
