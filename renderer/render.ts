/**
 * Add To Ignore Files
 */

// [How to exclude file only from root folder in Git](https://stackoverflow.com/a/3637678)
// const addSlashForGitIgnore = relativePath => `/${relativePath}`

// export const updateIgnoreFile = file => generatorManifest => {
//   const cwd = generatorManifest[0].cwd
//   const ignoreFile = path.join(cwd, file)
//   if (fs.existsSync(ignoreFile)) {
//     const ignorePaths = generatorManifest
//       .map(({relativePath}) => relativePath)
//       .map(addSlashForGitIgnore)
//       .join('\n')
//     const startLine = '### ESOPS AUTO GENERATED BEGIN ###'
//     const endLine = '### ESOPS AUTO GENERATED END ###'
//     fs.updateGeneratedTextFs(startLine, endLine, ignorePaths, ignoreFile)
//     return true
//   } else return false
// }

// export const updateGitIgnore = updateIgnoreFile('.gitignore')

// export const updateNpmIgnore = updateIgnoreFile('.npmignore')
import async from '../helpers/async'
import {getComponentType} from '../parser/parser2'

const URL_COMPONENT_TYPE = 'URL'
const PATH_COMPONENT_TYPE = 'PATH'

const NODE_PREFIX = 'node:'
const GITHUB_PREFIX = 'github:'

const getSpacing = (tab: number): string => new Array(tab).fill('    ').join('')

const renderPath = async (params, component) => {
  const {
    effects: {ui, filesystem}
  } = params

  const tab = getSpacing(params.treeDepth)
  const [localComponentPath, variables, options] = component
  ui.info(`${tab}  rendering`)
  const filesInComponent = filesystem.listTreeSync(localComponentPath)
  const renderPrepPath = await filesystem.appCache.getRenderPrepFolder()

  filesInComponent.forEach(from => {
    const fromRelativePath = filesystem.path.relative(localComponentPath, from)
    const to = filesystem.path.join(renderPrepPath, fromRelativePath)
    // console.log(fromRelativePath)
    filesystem.forceCopy(from, to)
    // copy file to renderPrep directory
  })
  // ListTreeSync
  // Loop Through Each
  //   Copy | CopyAndRender | CopyAndMerge

  return ' '
}

export const renderComponent = async (params, sanitizedComponent) => {
  const {
    effects: {ui}
  } = params

  const tab = getSpacing(params.treeDepth)
  const [componentString, variables, options] = sanitizedComponent

  const componentType = getComponentType(componentString)

  let response
  switch (componentType) {
    case PATH_COMPONENT_TYPE:
    default:
      response = await async.result(renderPath(params, sanitizedComponent))
  }

  const [err, result] = response
  if (err) throw err

  ui.info(`${tab}  rendered`)

  return result
}

export const copyToDestination = async.extend(async params => {
  const {effects, destination} = params
  const {filesystem} = effects
  const fromFolder = await filesystem.appCache.getRenderPrepFolder()
  const filesToCopy = await filesystem.listTreeSync(fromFolder)
  filesToCopy.forEach(from => {
    const fromRelativePath = filesystem.path.relative(fromFolder, from)
    const to = filesystem.path.join(destination, fromRelativePath)
    filesystem.forceCopy(from, to)
  })
})
