import * as path from 'path'
const {flatten} = require('ramda')
const multimatch = require('multimatch')
import * as isDirectory from 'is-directory'
import fs from '../drivers/fs'
import {Path, GeneratorManifest, LocalOption} from '../core/types'

const getStackFilePaths = (templatePath: Path): Path[] => {
  const paths = fs.listTreeSync(templatePath)
  // For now, only files are supported
  // TODO: Explore need/use case for folder path support
  const filePaths = paths.filter(filePath => !isDirectory.sync(filePath))
  return filePaths
}

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

const convertStackToPatchList = ({
  paths: {outputDir, stackDir, stackPaths}
}) => {
  return stackPaths.map(filePath => ({
    outputDir,
    stackDir,
    relativePath: filePath.replace(stackDir, ''),
    method: getMethodType(filePath)
  }))
}

// module.exports.convertStackToPatchList = convertStackToPatchList

// export async function convertStackComposeToPatchList(stackConfig, {cwd}) {
//   try {
//     let patchList = []
//     for (let i = 0; i < stackConfig.length; i++) {
//       const stack = stackConfig[i]
//       newList = convertStackToPatchList(stack, cwd)
//       patchList = patchList.concat(newList)
//     }
//     return patchList
//   } catch (e) {
//     console.error(e)
//     throw new Error('convertStackComposeToPatchList failed')
//   }
// }

// module.exports.convertStackComposeToPatchList = convertStackComposeToPatchList
export default (opts, {cwd}): GeneratorManifest => {
  const manifest = opts
    .map((opt: LocalOption) => ({
      stackDir: opt[0],
      opts: opt[1],
      paths: getStackFilePaths(opt[0])
    }))
    .reduce(
      (manifest, optWithPaths): GeneratorManifest => [
        ...manifest,
        ...optWithPaths.paths.map(fromPath => {
          const relativePath = path.relative(optWithPaths.stackDir, fromPath)
          const toPath = path.join(
            cwd,
            fromPath.replace(optWithPaths.stackDir, '')
          )
          return {
            cwd,
            stackDir: optWithPaths.stackDir,
            relativePath,
            fromPath,
            toDir: path.dirname(toPath),
            toPath,
            opts: optWithPaths.opts
          }
        })
      ],
      []
    )

  return manifest
}
