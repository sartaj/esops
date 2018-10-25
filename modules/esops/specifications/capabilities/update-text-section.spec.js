const test = require("tape");
const fs = require("fs");
const rimraf = require("rimraf");

const updateGitignore = require("../../source/features/update-gitignore.node");

const tmpDir = __dirname + "/tmp/";

function before() {
  // create tmp directory
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
}

function after() {
  // delete tmp directory
  rimraf.sync(tmpDir, fs);
}

test("file append generator", t => {
  before();

  t.plan(7);

  const fakeGitIgnore = tmpDir + ".gitignore";
  fs.openSync(fakeGitIgnore, "w");

  var gitIgnoreContents = fs.readFileSync(fakeGitIgnore, "utf-8");
  t.equals(gitIgnoreContents, "");

  const startLine = "\n### BEGIN ESOPS ###\n";
  const endLine = "\n### END ESOPS ###\n";

  var newContents = "newText";
  var updatedExpected = `${startLine}${newContents}${endLine}`;
  updateGitignore(startLine, endLine, newContents, fakeGitIgnore);
  var gitIgnoreContents = fs.readFileSync(fakeGitIgnore, "utf-8");
  t.equals(gitIgnoreContents, updatedExpected);

  var newContents = "another new oneanother new one";
  var updatedExpected = `${startLine}${newContents}${endLine}`;
  updateGitignore(startLine, endLine, newContents, fakeGitIgnore);
  var gitIgnoreContents = fs.readFileSync(fakeGitIgnore, "utf-8");
  t.equals(gitIgnoreContents, updatedExpected);

  var newContents = "😋";
  var updatedExpected = `${startLine}${newContents}${endLine}`;
  updateGitignore(startLine, endLine, newContents, fakeGitIgnore);
  var gitIgnoreContents = fs.readFileSync(fakeGitIgnore, "utf-8");
  t.equals(gitIgnoreContents, updatedExpected);

  var newContents = "\nadsfasdfadsfs/sdfsdfs/sdfsfdsf\n";
  var updatedExpected = `${startLine}${newContents}${endLine}`;
  updateGitignore(startLine, endLine, newContents, fakeGitIgnore);
  var gitIgnoreContents = fs.readFileSync(fakeGitIgnore, "utf-8");
  t.equals(gitIgnoreContents, updatedExpected);

  var newContents = "\nbarfood/sdfds/sdfsfdsf\n";
  var updatedExpected = `${startLine}${newContents}${endLine}`;
  updateGitignore(startLine, endLine, newContents, fakeGitIgnore);
  var gitIgnoreContents = fs.readFileSync(fakeGitIgnore, "utf-8");
  t.equals(gitIgnoreContents, updatedExpected);

  var newContents = "\nfoo/foobar/foobarfoo\n";
  var updatedExpected = `${startLine}${newContents}${endLine}`;
  updateGitignore(startLine, endLine, newContents, fakeGitIgnore);
  var gitIgnoreContents = fs.readFileSync(fakeGitIgnore, "utf-8");
  t.equals(gitIgnoreContents, updatedExpected);

  after();
});
