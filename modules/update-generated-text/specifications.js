const test = require("tape");
const stringReplaceOrConcat = require("./index");

test("should replace string if already exists", t => {
  const boundaryPairs = [
    ["\n### START BOUNDARY ###\n\n", "\n\n\n### END BOUNDARY ###\n\n"],
    ["### START BOUNDARY ###", "### END BOUNDARY ###"],
    ["\n### START\n", "\n### END\n"]
  ];

  const contentSections = [
    [`before boundary`, "after boundary", "old content", "new content"],
    [
      `\n### START PATH LIST\n`,
      "\nEND END PATH LIST ###\n",
      "\n/home/foo/bar\n/a/b\n/a/c\n./c/\no\n../n\n/t\n/e\nn\nt\n",
      "\n/bar/home/foo\n/b/a\n/c/a\n/x/\n./o\n../n\n/**\n/e\nn\nt\n"
    ]
  ];

  // as many tests as there are sections
  t.plan(boundaryPairs.length * contentSections.length);

  boundaryPairs.forEach((boundaryPair, boundaryIndex) => {
    contentSections.forEach((contentArray, contentIndex) => {
      const startBoundaryString = boundaryPair[0];
      const startBoundaryLine = `\n${startBoundaryString}\n`;
      const endBoundaryString = boundaryPair[1];
      const endBoundaryLine = `\n${endBoundaryString}\n`;
      const beforeBoundaryContent = contentArray[0];
      const afterBoundaryContent = contentArray[1];
      const oldContent = contentArray[2];
      const newContent = contentArray[3];

      const fullOldContent =
        beforeBoundaryContent +
        startBoundaryLine +
        oldContent +
        endBoundaryLine +
        afterBoundaryContent;

      const fullNewContent =
        beforeBoundaryContent +
        startBoundaryLine +
        newContent +
        endBoundaryLine +
        afterBoundaryContent;

      const results = stringReplaceOrConcat(
        startBoundaryString,
        endBoundaryString,
        newContent,
        fullOldContent
      );

      t.equal(
        fullNewContent,
        results,
        `test combo: ${boundaryIndex}/${contentIndex}`
      );
    });
  });
});
