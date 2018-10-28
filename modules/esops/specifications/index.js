const test = require("tape");
const fs = require("fs-plus");
const path = require("path");
const rimraf = require("rimraf");

const esops = require("../source");

const MOCK_INFRASTRUCTURES = {
  basic: path.join(__dirname, "mocks/templates", "basic"),
  "pipe-me": path.join(__dirname, "mocks/templates", "pipe-me"),
  "target-web": path.join(__dirname, "mocks/templates", "target-web")
};

const MOCK_STACKS = {
  basic: path.join(__dirname, "mocks/stacks", "basic")
};

withTempFolder = callback => t => {
  const dirname = __dirname + "/.tmp/";
  if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);
  callback({ t, dirname });
  rimraf.sync(dirname, fs);
};

test("resolve stack manifest", t => {
  t.plan(1);
  const actual = esops.resolveStackManifest(MOCK_STACKS.basic);
  const expected = [
    "../../templates/basic",
    "../../templates/basic-with-package"
  ];
  t.deepEquals(actual, expected);
});

test("create template list from stack manifest", t => {
  t.plan(1);
  const stackConfig = esops.resolveStackManifest(MOCK_STACKS.basic);
  esops.convertStackConfigToPatchList(stackConfig, MOCK_STACKS.basic);
  t.true(true);
});

// test('compose infrastructures')

test("get list of paths from infrastructure directory", t => {
  t.plan(1);
  const infrastructureDirectory = MOCK_INFRASTRUCTURES.basic;
  const actual = esops.getInfrastructurePath(infrastructureDirectory);
  const expected = [
    path.join(infrastructureDirectory, ".vscode"),
    path.join(infrastructureDirectory, ".vscode/settings.json"),
    path.join(infrastructureDirectory, "src"),
    path.join(infrastructureDirectory, "src/stores"),
    path.join(infrastructureDirectory, "src/stores/stores-architecture.md"),
    path.join(infrastructureDirectory, "tsconfig.json")
  ];
  t.deepEqual(actual, expected);
});

// test(
//   "test render",
//   withTempFolder(({ t, dirname }) => {
//     t.plan(1);
//     const infrastructureDirectory = MOCK_INFRASTRUCTURES.basic;
//     fs.copySync(infrastructureDirectory, dirname);
//     const props = {};
//     // const actual = esops.render(dirname, infrastructureDirectory, props);
//     t.equal(true, true);
//   })
// );
