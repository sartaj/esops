import pipe from 'promised-pipe'

import installDrivers from '../drivers'
import resolve from '../resolver'
// import parse from './parser'
// TODO: import validate from './validator'
// import generate from './generator'

const esops = pipe(
  installDrivers,
  resolve
  // parse,
  // TODO: validate,
  // generate,
)

export default esops

// forceCopy
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
