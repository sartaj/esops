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

const resolveStackPackage = async (pkg, { cwd }) => {
  try {
    let modulePath = "";
    if (!modulePath) modulePath = tryRelativePath(pkg, cwd);
    // TODO: Node Module Paths
    // if(!modulePath) modulePath = tryNodeModulePath(pkg, { cwd })
    // TODO: Git URLS
    // if(!modulePath) modulePath = tryGitUrl(pkg)
    // TODO: Tarball/Zip paths
    // if(!modulePath) modulePath = tryArchiveUrl(pkg)
    return modulePath + "/";
  } catch (e) {
    console.error(e);
    throw new Error("path resolution failed");
  }
};

/**
 * ## Converters
 */
const getMethodType = filePath => {
  const patch = [
    [".json.template", "RENDER_THEN_MERGE_JSON"],
    [".json", "MERGE_JSON"],
    [".gitignore", "MERGE_FILE"],
    [".gitignore.template", "RENDER_THEN_MERGE_FILE"],
    [".npmignore", "MERGE_FILE"],
    [".npmignore.template", "RENDER_THEN_MERGE_FILE"],
    [".template", "RENDER_TEMPLATE"],
    ["", "COPY_AND_OVERRIDE"]
  ];
};

const multimatch = require("multimatch");

const overridesAreValid = patchList => {
  const MERGEABLES = [
    ".gitignore",
    ".npmignore",
    ".eslintrc",
    ".prettierrc",
    "**/*.json",
    "*.json",
    ".json"
  ];
  let isValid = true;
  const duplicates = new Set();
  const seen = new Set();
  patchList.forEach(({ relativePath }) => {
    if (seen.has(relativePath)) duplicates.add(relativePath);
    else seen.add(relativePath);
  });
  if (duplicates.size) {
    const check = Array.from(duplicates);
    const allowed = multimatch(check, MERGEABLES, {
      dot: true
    });
    isValid = allowed.length === duplicates.size;
  }
  return isValid;
};

const mergeablesAreValid = patchList => {
  patchList.filter(({ relativePath }) => minimatch("", { dot: true }));
};

const validatePatchList = patchList => {
  // mergablesAreValid
  // forcedCopiesAreValid
  return overridesAreValid(patchList);
};
module.exports.validatePatchList = validatePatchList;

const convertStackToPatchList = async (stack, outputRoot) => {
  try {
    const inputRoot = await resolveStackPackage(stack, { cwd: outputRoot });
    const stackPathList = getTemplatePaths(inputRoot);
    return stackPathList.map(fullPath => ({
      outputRoot,
      inputRoot,
      relativePath: fullPath.replace(inputRoot, ""),
      method: getMethodType(fullPath)
    }));
  } catch (e) {
    console.error(e);
    throw new Error("fatal error at convertStackToPatchList");
  }
};

async function convertStackComposeToPatchList(stackConfig, cwd) {
  try {
    let patchList = [];
    for (let i = 0; i < stackConfig.length; i++) {
      const stack = stackConfig[i];
      newList = await convertStackToPatchList(stack, cwd);
      patchList = patchList.concat(newList);
    }
    return patchList;
  } catch (e) {
    console.error(e);
    throw new Error("convertStackComposeToPatchList failed");
  }
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
// const esops = pipe(
//   parseOpts Parse opts
//   parseFSToPatchList
//    scanFixturesFS Read filesystem info of templates
//    addFixturesFSToPatchList to Convert filesystem info to a patch list
//    scanSourceFSAndFilterMergeable Read filesystem of src and filter by mergeable
//    addMergableSourceFilesToPatchList Add mergeable source files to patch list
//  generateToTmp
//    generateESTemplateFiles
//      renderTemplateFiles Render props in .template to /tmp/ folder
//    generateOverrideable
//      validateOveridealbe
//      Duplicate overrideables to /tmp/ folder
//    generateMergeableJSON
//      validateMergeableJSON
//      mergeMergeableDuplicatesIn duplicate mergeables to /tmp/ folder
//    generateMergeableText
//      validateMergeableText
//    Generate gitignore list from tmp folder
//      Add gitignore list to /tmp/.gitignore
//  CopyTmpGeneratedToSourceFolder
// )
const runBin = () => {
  const cwd = process.cwd();

  const options = (() => {
    if (process.argv.slice(2)[1]) {
      return process.argv.slice(2)[1];
    } else if (require.resolve()) {
      return JSON.parse(require(path.join(cwd, "package.json")));
    }
  })();

  esops({
    cwd,
    options
  });
};
