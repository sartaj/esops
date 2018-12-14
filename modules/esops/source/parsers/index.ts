// import path from 'path'
const {flatten} = require('ramda')
const multimatch = require('multimatch')

// const getStackFilePaths = templatePath => {
//   const paths = fs.listTreeSync(templatePath)
//   // For now, only files are supported
//   // TODO: Explore need/use case for folder path support
//   const filePaths = paths.filter(filePath => !isDirectory.sync(filePath))
//   return filePaths
// }

/**
 * ## Converters
 */
const getMethodType = filePath => {
  // const patch = [
  //   ['.json.template', 'RENDER_THEN_MERGE_JSON'],
  //   ['.json', 'MERGE_JSON'],
  //   ['.gitignore', 'MERGE_FILE'],
  //   ['.gitignore.template', 'RENDER_THEN_MERGE_FILE'],
  //   ['.npmignore', 'MERGE_FILE'],
  //   ['.npmignore.template', 'RENDER_THEN_MERGE_FILE'],
  //   ['.template', 'RENDER_TEMPLATE'],
  //   ['', 'COPY_AND_OVERRIDE']
  // ]
}

const overridesAreValid = patchList => {
  const MERGEABLES = [
    '.gitignore',
    '.npmignore',
    '.eslintrc',
    '.prettierrc',
    '**/*.json',
    '*.json',
    '.json'
  ]
  let isValid = true
  const duplicates = new Set()
  const seen = new Set()
  patchList.forEach(({relativePath}) => {
    if (seen.has(relativePath)) duplicates.add(relativePath)
    else seen.add(relativePath)
  })
  if (duplicates.size) {
    const check = Array.from(duplicates)
    const allowed = multimatch(check, MERGEABLES, {
      dot: true
    })
    isValid = allowed.length === duplicates.size
  }
  return isValid
}

const mergeablesAreValid = patchList => {
  patchList.filter(({relativePath}) => multimatch('', {dot: true}))
}

const validatePatchList = patchList => {
  // mergablesAreValid
  // forcedCopiesAreValid
  return overridesAreValid(patchList)
}

module.exports.validatePatchList = validatePatchList

// const convertStackToPatchList = ({paths: {outputDir, stackDir, stackPaths}}) => {
//   return stackPaths.map(filePath => ({
//     outputDir,
//     stackDir,
//     relativePath: filePath.replace(stackDir, ''),
//     method: getMethodType(filePath)
//   }))
// }

// module.exports.convertStackToPatchList = convertStackToPatchList

// async function convertStackComposeToPatchList(stackConfig, cwd) {
//   try {
//     let patchList = []
//     for (let i = 0; i < stackConfig.length; i++) {
//       const stack = stackConfig[i]
//       newList = await convertStackToPatchList(stack, cwd)
//       patchList = patchList.concat(newList)
//     }
//     return patchList
//   } catch (e) {
//     console.error(e)
//     throw new Error('convertStackComposeToPatchList failed')
//   }
// }

// module.exports.convertStackComposeToPatchList = convertStackComposeToPatchList
