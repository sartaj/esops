const readPkg = require("read-pkg");
const esops = require("../app");

// const getNpmModule =
const fetchOptions = async () => {
  try {
    // if (process.argv.slice(2)[1]) {
    //   return getNpmModule(process.argv.slice(2)[1]);
    // }

    const pkg = await readPkg();
    if (pkg && pkg.esops) {
      return pkg.esops;
    }
    throw new Error("");
  } catch (e) {
    throw new Error("failed fetching options");
  }
};

const fetchCwd = params => ({ ...params, cwd: process.cwd() });

const bin = pipe(
  fetchCwd,
  fetchOptions,
  esops
);
