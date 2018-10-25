const test = require("tape");
const fs = require("fs-plus");
const path = require("path");

const esops = require("../source");

test("test basic", t => {
  t.plan(1);
  const mockDir1 = path.join(__dirname, "mocks", "basic");
  const actual = esops.getInfrastructurePath(mockDir1);
  const expected = [__dirname + "/mocks/basic/foo.md"];
  t.deepEqual(actual, expected);
});

// test("test render", t => {
//   t.plan(1);
//   const mockDir1 = path.join(__dirname, "mocks", "basic");
//   const actual = esops.render(mockDir1);
//   const expected = [__dirname + "/mocks/basic/foo.md"];
//   t.deepEqual(actual, expected);
// });
