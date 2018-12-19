import fs from '../drivers/fs'
import {GeneratorManifest} from '../core/types'
// /**
//  * ## Render
//  */
// const renderProps = (input, props) => {
//   if (path.extname(input) === 'template') renderTemplate(input, props)
//   if (path.basename(input) === 'package.json') renderPackageJson(output)
// }

// const renderFile = (input, inputRoot, output, props) => {
//   const outputFile = output + input.replace(inputRoot, '')
//   const renderedFile = renderTempFile(input, props)
//   jetpack.copy(renderedFile, output, {overwrite: true})
// }

// const renderPaths = (inputs, inputRoot, output, props) => {
//   inputs.forEach(input => {
//     renderFile(input, inputRoot, output, props)
//   })
// }

// const render = (input, output, props) => {
//   const inputs = getTemplatePaths(input)
//   renderPaths(inputs, input, output, props)
// }

// module.exports.render = render

// const updateGitIgnore = (paths, gitIgnorePath) => {
//   const startLine = '### ESOPS GITIGNORE AUTO GENERATED BEGIN ###'
//   const endLine = '### ESOPS GITIGNORE AUTO GENERATED END ###'
//   capabilities.updateGeneratedTextFs(
//     startLine,
//     endLine,
//     newContent,
//     gitIgnorePath
//   )
// }

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

const forceCopy = (generatorManifest: GeneratorManifest) => {
  generatorManifest.forEach(manifest => {
    const from = manifest.templateDir + manifest.relativePath
    const to = manifest.outputDir
    fs.forceCopy(from, to)
  })
}

const updateGitIgnore = generatorManifest => {
  const cwd = generatorManifest[0].outputDir
  const ignoreFiles = generatorManifest
    .map(({relativePath}) => relativePath)
    .join('\n')
  const startLine = '### ESOPS GITIGNORE AUTO GENERATED BEGIN ###'
  const endLine = '### ESOPS GITIGNORE AUTO GENERATED END ###'
  fs.updateGeneratedTextFs(startLine, endLine, ignoreFiles, cwd)
}

export default (generatorManifest: GeneratorManifest): void => {
  console.log('generator', JSON.stringify(generatorManifest, null, 2))
  // forceCopy(generatorManifest)
  // updateGitIgnore(generatorManifest)
}
