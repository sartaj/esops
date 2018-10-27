const fs = require("fs-plus");
const jetpack = require("fs-jetpack");
const path = require("path");
const isDirectory = require("is-directory");
const { pipe } = require("ramda");

const capabilities = {
  updateGeneratedTextFs: require("update-generated-text-fs")
  // copyTemplateFiles
  // extendJSON
  // mapPropsToTemplate
  // setupTeardownTempFolder
};

const features = {
  findEsopsFile: capabilities => {},
  convertEsopsFileToManifest: () => {},
  getPathsFromEsopsManifest: () => {},
  checkForDuplicatePaths: modulePath => {},
  renderTemplates: () => {},
  concatPackageJson: () => {},
  updateGitIgnore: (paths, gitIgnorePath) => {
    const startLine = "### ESOPS AUTO GENERATED BEGIN ###";
    const endLine = "### ESOPS AUTO GENERATED END ###";
    capabilities.updateGeneratedTextFs(
      startLine,
      endLine,
      newContent,
      gitIgnorePath
    );
  }
};

const getInfrastructurePath = infrastructurePath => {
  const paths = fs.listTreeSync(infrastructurePath);
  return paths;
};

const renderProps = (input, props) => {
  if (path.extname(input) === "template") renderTemplate(input, props);
  if (path.basename(input) === "package.json") renderPackageJson(output);
};

const renderFile = (input, inputRoot, output, props) => {
  const outputFile = output + input.replace(inputRoot, "");
  const renderedFile = renderTempFile(input, props);
  jetpack.copy(renderedFile, output, { overwrite: true });
};

const renderPaths = (inputs, inputRoot, output, props) => {
  inputs.forEach(input => {
    renderFile(input, inputRoot, output, props);
  });
};

const render = (input, output, props) => {
  const inputs = fs.listTreeSync(input);
  renderPaths(inputs, input, output, props);
};

const parseStack = stackPath => {};

// {
//   inputFile: ''
//   inputRoot: '',
//   outputFile: '',
//   props: {},
// }

const getListFromManifest = (cwd, pkg, props) => {
  const resolvePkg = require("resolve-pkg");
  const stackDirectory = resolvePkg(pkg, { cwd });
  const defaultProps = {
    cwd,
    name: pkg
  };
  // { ...props }
};

const createGenerationManifest = (cwd, esopsManifest) => {
  let generationManifest = [];
  esopsManifest.forEach(stack => {
    let results = [];
    if (typeof stack === "string") {
      results = getListFromManifest(cwd, stack);
    } else if (Array.isArray(stack)) {
      results = getListFromManifest(cwd, stack[0], stack[1]);
    } else {
      throw new Error("Error parsing manifest");
    }
    generationManifest = generationManifest.concat(results);
  });
  return generationManifest;
};

function resolveStackManifest(cwd) {
  const possibleConfigPath = path.join(cwd, "esops.json");
  try {
    const stackManifest = fs.readFileSync(possibleConfigPath, "utf-8");
    return JSON.parse(stackManifest);
  } catch (e) {
    return [];
  }
}
module.exports.resolveStackManifest = resolveStackManifest;

const run = (cwd, manifestOpts) => {
  const infrastructureList = createGenerationManifest(cwd, manifestOpts);
  features.checkForDuplicatePaths(filesManifest);
};

const runBin = () => {
  const cwd = process.cwd();
  const manifestOpts = require(path.join(cwd, "esops.json"));
  run(cwd, manifestOpts);
};

module.exports.getInfrastructurePath = getInfrastructurePath;
module.exports.render = render;
