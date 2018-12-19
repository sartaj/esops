const test = require("tape");
const fs = require("fs");
const rimraf = require("rimraf");

const updateGitignore = require("./index.node");

const tmpDir = __dirname + "/tmp/";
const fakeGitIgnore = tmpDir + ".gitignore";

function before() {
  // create tmp directory
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
  fs.openSync(fakeGitIgnore, "w");
}

function after() {
  // delete tmp directory
  rimraf.sync(tmpDir, fs);
}

test("file append generator", t => {
  before();

  const startLine = "### BEGIN ESOPS ###";
  const endLine = "### END ESOPS ###";

  const contentsToTest = [
    "newText",
    "another new oneanother new one",
    "😋",
    "\nadsfasdfadsfs/sdfsdfs/sdfsfdsf\n",
    "\nbarfood/sdfds/sdfsfdsf\n",
    "\nfoo/foobar/foobarfoo\n"
  ];

  t.plan(contentsToTest.length);

  contentsToTest.forEach(newContents => {
    var updatedExpected = `\n${startLine}\n${newContents}\n${endLine}\n`;
    updateGitignore(startLine, endLine, newContents, fakeGitIgnore);
    var gitIgnoreContents = fs.readFileSync(fakeGitIgnore, "utf-8");
    t.equals(gitIgnoreContents, updatedExpected);
  });

  after();
});
