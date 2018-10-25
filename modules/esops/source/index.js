const fs = require("fs-plus");
const path = require("path");

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

module.exports.getInfrastructurePath = getInfrastructurePath;
