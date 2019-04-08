import {mergeDeepRight} from 'ramda'

import {PATH_COMPONENT_TYPE} from '../core/constants'
import {getComponentType} from '../core/lenses'
import {FileNotToggledForMerge} from '../core/messages'
import async from '../utilities/async'
import {throwError} from '../utilities/sync'
import {
  checkIfShouldGitPublish,
  checkIfShouldMergeFiles,
  checkIfShouldMergeJson,
  resolveToggles
} from './toggles-check'
import {Params} from '../core/types2'

/**
 * Add To Ignore Files
 */

// [How to exclude file only from root folder in Git](https://stackoverflow.com/a/3637678)
const addSlashForGitIgnore = relativePath => `/${relativePath}`

export const updateIgnoreFile = ignoreFilename => filesystem => destination => copyManifest => {
  const ignoreFile = filesystem.path.join(destination, ignoreFilename)
  if (filesystem.existsSync(ignoreFile)) {
    const ignorePaths = copyManifest
      .map(({relativePath}) => relativePath)
      .map(addSlashForGitIgnore)
      .join('\n')

    const startLine = '### ESOPS AUTO GENERATED BEGIN ###'
    const endLine = '### ESOPS AUTO GENERATED END ###'
    filesystem.updateGeneratedTextFs(
      startLine,
      endLine,
      ignorePaths,
      ignoreFile
    )
    return true
  } else return false
}

export const updateGitIgnore = updateIgnoreFile('.gitignore')

export const updateNpmIgnore = updateIgnoreFile('.npmignore')

const getSpacing = (tab: number): string => new Array(tab).fill('    ').join('')

/**
 * ### listFileTreeSync
 * Get a list of files that ignore directories and toggle files
 *
 * TODO: Explore need/use case for folder path support.
 * TODO: Explore need/use case for allowing esops toggle files to be copies.
 */
type ListFiles = (params: Params) => (cwd: string) => string[]
const listFileTreeSync: ListFiles = ({effects: {filesystem}}) => (
  cwd: string
) =>
  filesystem
    .listTreeSync(cwd)
    .filter(filePath => !filesystem.isDirectory.sync(filePath))

const renderPathComponent = async (params, component) => {
  const {
    effects: {ui, filesystem}
  } = params
  const {path} = filesystem

  const tab = getSpacing(params.treeDepth)
  const [localComponentPath, variables, options] = component
  ui.info(`${tab}  rendering`)

  const filesInComponent = listFileTreeSync(params)(localComponentPath)

  const {filesWithoutToggles, toggles} = await resolveToggles(params)(
    filesInComponent
  )

  const renderPrepPath = await filesystem.appCache.getRenderPrepFolder()

  type Actions = {from: string; to: string; relativePath: string}
  const actions: Actions[] = await async.seriesPromise(
    async.mapToAsync(async from => {
      const relativePath = path.relative(localComponentPath, from)
      return {
        ...{
          from,
          to: path.join(renderPrepPath, relativePath),
          relativePath
        },
        ...checkIfShouldMergeJson(toggles, relativePath),
        ...checkIfShouldMergeFiles(toggles, relativePath),
        ...checkIfShouldGitPublish(toggles, relativePath)
      }
    })(filesWithoutToggles)
  )

  const mergeJSON = async manifest => {
    const {filesystem} = params.effects

    const prevJson = filesystem.existsSync(manifest.to)
    if (prevJson) {
      const prev = JSON.parse(filesystem.readFileSync(manifest.to, 'utf-8'))
      const next = JSON.parse(filesystem.readFileSync(manifest.from, 'utf-8'))
      const merged = mergeDeepRight(prev, next)
      const newFile = JSON.stringify(merged, null, 2)
      filesystem.writeFileSync(manifest.to, newFile)
    } else {
      filesystem.forceCopy(manifest.from, manifest.to)
    }
  }

  const mergeFile = async manifest => {
    const {filesystem} = params.effects

    const prevFile = filesystem.existsSync(manifest.to)
    if (prevFile) {
      const prev = filesystem.readFileSync(manifest.to, 'utf-8')
      const next = filesystem.readFileSync(manifest.from, 'utf-8')
      const merged = prev + '\n' + next
      const newFile = merged
      filesystem.writeFileSync(manifest.to, newFile)
    } else {
      filesystem.forceCopy(manifest.from, manifest.to)
    }
  }

  const overrideFile = async manifest => {
    try {
      const fileAlreadyRendered = filesystem.existsSync(manifest.to)
      if (fileAlreadyRendered) {
        throw new Error(FileNotToggledForMerge(manifest))
      } else {
        filesystem.forceCopy(manifest.from, manifest.to)
      }
    } catch (e) {
      throw e
    }
  }

  const renderManifest = async manifest => {
    // TODO: Need to detect if first file doesn't allow merge
    if (manifest.shouldMergeJson) await mergeJSON(manifest)
    else if (manifest.shouldMergeFile) await mergeFile(manifest)
    else await overrideFile(manifest)
  }

  const renderReport = await async
    .seriesPromise(
      actions.map(manifest => async () => {
        try {
          await renderManifest(manifest)
          return {
            success: true
          }
        } catch (e) {
          throw e
        }
      })
    )
    .catch(throwError)

  return renderReport
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
      response = await async.result(
        renderPathComponent(params, sanitizedComponent)
      )
  }

  const [err, result] = response
  if (err) throw err

  ui.info(`${tab}  rendered`)

  return result
}

export const copyToDestination = async.extend(async params => {
  const {effects, destination} = params
  const {filesystem} = effects
  const renderPrepFolder = await filesystem.appCache.getRenderPrepFolder()
  const filesToCopy = await filesystem
    .listTreeSync(renderPrepFolder)
    .filter(filePath => !filesystem.isDirectory.sync(filePath))

  const copyManifest = filesToCopy.map(filePath => {
    const relativePath = filesystem.path.relative(renderPrepFolder, filePath)
    return {
      relativePath,
      fromPath: filePath,
      toPath: filesystem.path.join(destination, relativePath)
    }
  })

  const copyManifestForIgnore = copyManifest.filter(({relativePath}) => {
    const pathName = filesystem.path.basename(relativePath)
    return pathName !== '.gitignore' && pathName !== '.npmignore'
  })

  updateGitIgnore(filesystem)(renderPrepFolder)(copyManifestForIgnore)
  updateNpmIgnore(filesystem)(renderPrepFolder)(copyManifestForIgnore)

  copyManifest.forEach(({fromPath, toPath}) => {
    filesystem.forceCopy(fromPath, toPath)
  })

  return {copyManifest}
})
