import {pipe} from 'ramda'
import chalk from 'chalk'

import {
  GITHUB_PREFIX,
  NODE_PREFIX,
  LOCAL_PATH_COMPONENT_TYPE,
  GITHUB_COMPONENT_TYPE,
  EFFECT_COMPONENT_TYPE,
  NODE_COMPONENT_TYPE
} from './constants'
import {
  CWDNotDefined,
  NoPathError,
  GitFetchFailed,
  InvalidOptsError
} from './messages'
import {Params, EsopsConfig} from './types'
import async from '../utilities/async'
import {
  getComposeDefinitionFromEsopsConfig,
  getComponentType,
  sanitizeComponent,
  getCommand,
  getCommandFromSanitized
} from './lenses'
import {resolveEffectComponent} from '../extensions/resolvers/effects/resolve-effect'

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

export const resolveGithub = async (
  sanitizedComponent,
  {
    effects: {
      filesystem: {appCache},
      resolver: {tryGitPath}
    }
  }
) => {
  const pathString = sanitizedComponent[0]

  try {
    const destination = await appCache.createNewCacheFolder()
    const {gitUrl, branch} = getGitInfoFromGithubPath(pathString)
    const modulePath = await tryGitPath({gitUrl, destination, branch})

    return modulePath
  } catch (e) {
    throw new TypeError(GitFetchFailed({pathString, message: e.message}))
  }
}

export const resolveFS = async (params, sanitizedComponent) => {
  try {
    const {
      parent,
      effects: {
        resolver: {tryFSPath}
      }
    } = params
    const componentString = getCommandFromSanitized(sanitizedComponent)
    const parentPath = getCommand(parent)

    const resolvedPath = await tryFSPath(componentString, {cwd: parentPath})

    if (!resolvedPath) {
      throw new TypeError(
        NoPathError({pathString: componentString, cwd: parentPath})
      )
    } else return resolvedPath
  } catch (e) {
    throw e
  }
}

/**
 * ## Resolvers
 */
export const resolveSanitizedComponent = params => async sanitizedComponent => {
  try {
    const {
      effects: {
        ui,
        resolver: {tryNodePath}
      },
      parent
    } = params
    const componentString: string = getCommandFromSanitized(sanitizedComponent)
    const parentPath = getCommand(parent)
    const tab = ui.getTabs(params.treeDepth)
    if (!parentPath) throw new TypeError(CWDNotDefined())

    ui.info(`${tab}${chalk.bold(componentString)}`)
    ui.info(`${tab}  resolving`)

    const componentType = getComponentType(componentString)

    const resolvedComponentString = await (async () => {
      try {
        switch (componentType) {
          case LOCAL_PATH_COMPONENT_TYPE:
            return async.result(resolveFS(params, sanitizedComponent), true)
          case NODE_COMPONENT_TYPE:
            return async.result(tryNodePath(componentType, {cwd: parentPath}))
          case GITHUB_COMPONENT_TYPE:
            return async.result(resolveGithub(sanitizedComponent, params), true)
          case EFFECT_COMPONENT_TYPE:
            return async.result(
              resolveEffectComponent(params, sanitizedComponent),
              true
            )
          default:
            throw new TypeError(NoPathError({componentString, cwd: parentPath}))
        }
      } catch (e) {
        throw e
      }
    })()

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
type ListFiles = (params) => (cwd: string) => string[]
export const listFileTreeSync: ListFiles = ({effects: {filesystem}}) => (
  cwd: string
) =>
  filesystem
    .listTreeSync(cwd)
    .filter(filePath => !filesystem.isDirectory.sync(filePath))

export const resolveComponent = params => composeDefinition =>
  async.result(
    async.pipe(
      sanitizeComponent,
      resolveSanitizedComponent(params)
    )(composeDefinition)
  )
