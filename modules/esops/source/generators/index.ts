// import jetpack from 'fs-jetpack'

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
