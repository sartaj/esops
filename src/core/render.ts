import * as stringify from 'json-stable-stringify'
import {mergeDeepRight} from 'ramda'
import async from '../utilities/async'
import {throwError, parseJSON} from '../utilities/sync'
import {FileNotToggledForMerge} from './messages'
import {listFileTreeSync} from './resolver'
import {
  checkIfShouldGitPublish,
  checkIfShouldMergeFile,
  checkIfShouldMergeJson,
  resolveToggles
} from './toggles-check'
import {Params, SanitizedComponent, Report, Manifest} from './types'

/**
 * Render Path
 */

const mergeJSON = ({effects: {filesystem}}: Params) => async (
  manifest: Manifest
) => {
  const prevJson = filesystem.existsSync(manifest.to)
  if (prevJson) {
    const prev = parseJSON(filesystem.readFileSync(manifest.to, 'utf-8'))
    const next = parseJSON(filesystem.readFileSync(manifest.from, 'utf-8'))
    const merged = mergeDeepRight(prev, next)
    const newFile = stringify(merged, {space: 2})
    filesystem.writeFileSync(manifest.to, newFile)
  } else {
    filesystem.forceCopy(manifest.from, manifest.to)
  }
}

const mergeFile = (params: Params) => async (manifest: Manifest) => {
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

const overrideFile = ({effects: {filesystem}}: Params) => async (
  manifest: Manifest
) => {
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

const renderManifest = (params: Params) => async (manifest: Manifest) => {
  // TODO: Need to detect if first file doesn't allow merge
  if (manifest.shouldMergeJson) await mergeJSON(params)(manifest)
  else if (manifest.shouldMergeFile) await mergeFile(params)(manifest)
  else await overrideFile(params)(manifest)
  return {
    ...manifest,
    success: true
  }
}

export const renderComponent = async (
  params,
  component: SanitizedComponent
): Promise<Report> =>
  params.effects.filesystem.isDirectory.sync(component[0])
    ? renderDirectory(params, component)
    : renderFile(params, component)

export const renderDirectory = async (
  params,
  component: SanitizedComponent
): Promise<Report> => {
  const {
    effects: {ui, filesystem}
  } = params
  const {path} = filesystem

  const tab = ui.getTabs(params.treeDepth)
  const [localComponentPath, variables, options] = component
  ui.info(`${tab}  rendering`)

  const filesInComponent = listFileTreeSync(params)(localComponentPath)

  const {filesWithoutToggles, toggles} = await resolveToggles(params)(
    filesInComponent
  )

  const renderPrepPath = await filesystem.appCache.getRenderPrepFolder()

  const actions: Manifest[] = await async.seriesPromise(
    async.mapToAsync(async from => {
      const relativePath = path.relative(localComponentPath, from)
      const manifest = {
        ...{
          from,
          to: path.join(renderPrepPath, relativePath),
          relativePath
        },
        ...checkIfShouldMergeJson(toggles, relativePath),
        ...checkIfShouldMergeFile(toggles, relativePath),
        ...checkIfShouldGitPublish(toggles, relativePath)
      }
      return manifest
    })(filesWithoutToggles)
  )

  const reportFromRender: Manifest[] = await async
    .seriesPromise(
      actions.map((manifest: Manifest) => async () => {
        try {
          return await renderManifest(params)(manifest)
        } catch (e) {
          throw e
        }
      })
    )
    .catch(throwError)

  ui.info(`${tab}  rendered`)
  return reportFromRender
}

const isFileJSON = ({effects: {filesystem}}: Params) => file => {
  try {
    JSON.parse(filesystem.readFileSync(file))
    return true
  } catch {
    return false
  }
}

export const renderFile = async (
  params: Params,
  component: SanitizedComponent
): Promise<Report> => {
  const {
    effects: {ui, filesystem}
  } = params
  const {path} = filesystem

  const tab = ui.getTabs(params.treeDepth)
  const [localComponentPath, variables, options] = component
  ui.info(`${tab}  file found, rendering...`)
  const from = localComponentPath
  ui.trace(`from ${from}`)
  ui.trace(`parent ${params.parent[0]}`)
  const parentRoot = params.parent[0]
  const relativePath = path.relative(parentRoot, from)
  ui.trace(`relative path ${relativePath}`)
  const renderPrepPath = await filesystem.appCache.getRenderPrepFolder()
  ui.trace(`renderPrepPath ${renderPrepPath}`)
  ui.trace(
    `options.o || options.out ${options.o || options.out ? true : false}`
  )
  const to = path.join(renderPrepPath, options.o || options.out || relativePath)
  ui.trace(`to ${to}`)
  const fileIsJSON = isFileJSON(params)(from)
  const manifest = {
    from,
    to,
    relativePath,
    shouldMergeJson: (options.merge && fileIsJSON) || false,
    mergeJsonArrays: [],
    shouldMergeFile: (options.merge && !fileIsJSON) || false,
    shouldGitPublish: options.publish || false
  }

  const renderReport = await renderManifest(params)(manifest)

  ui.info(`${tab}  rendered`)
  return [renderReport]
}
