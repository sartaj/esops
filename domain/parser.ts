import {pipe} from 'ramda'
import chalk from 'chalk'

import {
  GITHUB_PREFIX,
  NODE_PREFIX,
  PATH_COMPONENT_TYPE,
  URL_COMPONENT_TYPE
} from './constants'
import {
  CWDNotDefined,
  NoPathError,
  GitFetchFailed,
  InvalidOptsError
} from './messages'
import {Params, EsopsConfig} from './types'
import async from '../utilities/async'
import {getComposeDefinitionFromEsopsConfig, getComponentType} from './lenses'

/**
 * ## Utilities
 */

const getGitInfoFromGithubPath = pipe(
  str => str.substr(GITHUB_PREFIX.length, str.length - 1),
  str => str.split('#'),
  ([githubPath, branch]) => ({
    gitUrl: `https://github.com/${githubPath}.git`,
    branch
  })
)

/**
 * ## Resolvers
 */

export const fetchComponent = async (
  sanitizedComponent,
  {
    parent,
    effects: {
      error,
      filesystem: {appCache},
      resolver: {tryNodePath, tryGitPath, tryFSPath}
    }
  }: Params
) => {
  try {
    const pathString = sanitizedComponent[0]
    if (!parent) throw new TypeError(CWDNotDefined())
    let modulePath

    if (!modulePath) modulePath = await tryFSPath(pathString, {cwd: parent})
    if (!modulePath && pathString.startsWith(NODE_PREFIX)) {
      const nodePath = pathString.substr(NODE_PREFIX.length)

      modulePath = await tryNodePath(nodePath, {cwd: parent})
    }

    try {
      if (!modulePath && pathString.startsWith(GITHUB_PREFIX)) {
        const destination = await appCache.createNewCacheFolder()
        const {gitUrl, branch} = getGitInfoFromGithubPath(pathString)
        modulePath = await tryGitPath({gitUrl, destination, branch})
      }
    } catch (e) {
      throw new TypeError(GitFetchFailed({pathString, message: e.message}))
    }

    if (!modulePath) throw new TypeError(NoPathError({pathString, cwd: parent}))
    return modulePath
  } catch (e) {
    throw e
  }
}

/**
 * ## Resolvers
 */
export const resolveComponent = params => async sanitizedComponent => {
  try {
    const {
      effects: {ui}
    } = params
    const componentString = sanitizedComponent[0]
    const tab = ui.getTabs(params.treeDepth)
    ui.info(`${tab}${chalk.bold(componentString)}`)
    ui.info(`${tab}  resolving`)

    const componentType = getComponentType(componentString)

    const resolvedComponentString =
      componentType === URL_COMPONENT_TYPE ||
      componentType === PATH_COMPONENT_TYPE
        ? await async.result(fetchComponent(sanitizedComponent, params), true)
        : componentString

    ui.info(`${tab}  resolved`)

    return [
      resolvedComponentString,
      sanitizedComponent[1],
      sanitizedComponent[2]
    ]
  } catch (e) {
    throw e
  }
}

/**
 * ### hasEsopsCompose
 * Check if resolved component has an esops compose definition.
 */
export const hasEsopsCompose = params => async (
  resolvedComponent
): Promise<boolean> => {
  try {
    const [resolvedComponentString, variables, options] = resolvedComponent
    const nextEsopsConfig = await findEsopsConfig(params)(
      resolvedComponentString
    )

    const nextEsopsComposeDefinition =
      nextEsopsConfig && getComposeDefinitionFromEsopsConfig(nextEsopsConfig)
    const isDirectoryWithComposeDefinition =
      nextEsopsConfig && nextEsopsComposeDefinition ? true : false

    return isDirectoryWithComposeDefinition
  } catch (e) {
    throw e
  }
}

/**
 * ### findEsopsConfig
 * Read and parse esops config file from `esops.json` or `package.json`.
 */
export const findEsopsConfig = params => async (
  directory
): Promise<EsopsConfig> => {
  const {
    effects: {filesystem}
  } = params
  try {
    const esopsConfigPath = filesystem.path.join(directory, 'esops.json')
    const esopsConfig =
      filesystem.existsSync(esopsConfigPath) &&
      filesystem.readFileSync(esopsConfigPath, {encoding: 'utf-8'})

    const parsed = (() => {
      try {
        return JSON.parse(esopsConfig)
      } catch {
        throw new TypeError(InvalidOptsError())
      }
    })()

    return parsed || null
  } catch (e) {
    throw e
  }
}

/**
 * ### listFileTreeSync
 * Get a list of files that ignore directories and toggle files
 *
 * TODO: Explore need/use case for folder path support.
 * TODO: Explore need/use case for allowing esops toggle files to be copies.
 */
type ListFiles = (params: Params) => (cwd: string) => string[]
export const listFileTreeSync: ListFiles = ({effects: {filesystem}}) => (
  cwd: string
) =>
  filesystem
    .listTreeSync(cwd)
    .filter(filePath => !filesystem.isDirectory.sync(filePath))
