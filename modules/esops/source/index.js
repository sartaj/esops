const R = require('ramda')
const pipe = require('promised-pipe')

const fs = require('require("./drivers/file-system")')

const deepMerge = R.curry(R.deepMergeLeft)

const installDrivers = deepMerge({
  drivers: {
    fs
  }
})

const esops = pipe(
  installDrivers,
  parseManifest
  // parseFS,
  // scanFixturesFS // Read filesystem info of templates
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
  //    generateGitignoreList from tmp folder
  //      Add gitignore list to /tmp/.gitignore
  //  copyTmpGeneratedToSourceFolder
)
