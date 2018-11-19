import R from 'ramda'
import pipe from 'promised-pipe'
import fs from 'fs'
import {resolve} from './resolvers'

const deepMerge = R.curry(R.deepMergeLeft)

const installDrivers = deepMerge({
  drivers: {
    fs,
    logger: console.log
  }
})

const esops = pipe(
  installDrivers,
  resolve
  // parse,
  // validate,
  // generate,
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
)

export default esops
