const fs = require("fs-plus");
const jetpack = require("fs-jetpack");
const path = require("path");
const isDirectory = require("is-directory");
const { pipe, flatten } = require("ramda");
const resolvePkg = require("resolve-pkg");

const capabilities = {
  updateGeneratedTextFs: require("update-generated-text-fs")
};

/**
 * ## Resolvers
 */
const getTemplatePaths = templatePath => {
  const paths = fs.listTreeSync(templatePath);
  // For now, only files are supported
  // TODO: Explore need/use case for folder path support
  const filePaths = paths.filter(filePath => !isDirectory.sync(filePath));
  return filePaths;
};

module.exports.getTemplatePaths = getTemplatePaths;

function resolveStackCompose(cwd) {
  const possibleConfigPath = path.join(cwd, "esops.json");
  try {
    const stackManifest = fs.readFileSync(possibleConfigPath, "utf-8");
    return JSON.parse(stackManifest);
  } catch (e) {
    return [];
  }
}
module.exports.resolveStackCompose = resolveStackCompose;

const tryRelativePath = (pkg, cwd) => {
  const potentialPath = path.join(cwd, pkg);
  return fs.existsSync(potentialPath) ? potentialPath : null;
};

const resolveStackPackage = (pkg, { cwd }) => {
  let modulePath = "";
  if (!modulePath) modulePath = tryRelativePath(pkg, cwd);
  // if(!modulePath) modulePath = tryNodeModulePath(pkg, { cwd })
  // if(!modulePath) modulePath = tryGitUrl(pkg)
  // if(!modulePath) modulePath = tryArchiveUrl(pkg)
  return modulePath + "/";
};

/**
 * ## Converters
 */
const convertStackToPatchList = (stack, outputRoot) => {
  const inputRoot = resolveStackPackage(stack, { cwd: outputRoot });
  const stackPathList = getTemplatePaths(inputRoot);
  return stackPathList.map(fullPath => ({
    outputRoot,
    inputRoot,
    relativePath: fullPath.replace(inputRoot, "")
  }));
};

function convertStackComposeToPatchList(stackConfig, cwd) {
  return stackConfig.reduce((acc, stack) => {
    const patchList = convertStackToPatchList(stack, cwd);
    return acc.concat(patchList);
  }, []);
}
module.exports.convertStackComposeToPatchList = convertStackComposeToPatchList;

/**
 * ## Render
 */
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
  const inputs = getTemplatePaths(input);
  renderPaths(inputs, input, output, props);
};

module.exports.render = render;

const updateGitIgnore = (paths, gitIgnorePath) => {
  const startLine = "### ESOPS AUTO GENERATED BEGIN ###";
  const endLine = "### ESOPS AUTO GENERATED END ###";
  capabilities.updateGeneratedTextFs(
    startLine,
    endLine,
    newContent,
    gitIgnorePath
  );
};

/**
 * Interfaces
 */
const runBin = () => {
  const cwd = process.cwd();
  const manifestOpts = require(path.join(cwd, "esops.json"));
  run(cwd, manifestOpts);
};
