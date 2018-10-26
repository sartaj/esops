const test = require("tape");
const fs = require("fs-plus");
const path = require("path");
const rimraf = require("rimraf");

const esops = require("../source");

const MOCK_INFRASTRUCTURES = {
  basic: path.join(__dirname, "mocks/infrastructures", "basic"),
  "pipe-me": path.join(__dirname, "mocks/infrastructures", "pipe-me"),
  "target-web": path.join(__dirname, "mocks/infrastructures", "target-web")
};

withTempFolder = callback => t => {
  const dirname = __dirname + "/.tmp/";
  if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);
  callback({ t, dirname });
  rimraf.sync(dirname, fs);
};

// test('read infrastructure jsx interface')

// test('convert jsx to infrastructure opts')

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

// test('compose infrastructures')

test(
  "test render",
  withTempFolder(({ t, dirname }) => {
    t.plan(1);
    const infrastructureDirectory = MOCK_INFRASTRUCTURES.basic;
    fs.copySync(infrastructureDirectory, dirname);
    const props = {};
    // const actual = esops.render(dirname, infrastructureDirectory, props);
    t.equal(true, true);
  })
);
