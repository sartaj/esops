import {Params} from '../core/types2'
import {CWDNotDefined, NoPathError} from '../core/messages'
import {pipe} from 'ramda'
import async from '../helpers/async'
import {isString, throwError} from '../helpers/sync'

import {
  findEsopsConfig,
  getComposeDefinitionFromEsopsConfig
} from '../parser/parse'

const URL_COMPONENT_TYPE = 'URL'
const PATH_COMPONENT_TYPE = 'PATH'

const NODE_PREFIX = 'node:'
const GITHUB_PREFIX = 'github:'

export const getComponentType = (componentString: string) => {
  return (
    (componentString.startsWith('github:') && URL_COMPONENT_TYPE) ||
    PATH_COMPONENT_TYPE
  )
}

const getGitInfoFromGithubPath = pipe(
  str => str.substr(GITHUB_PREFIX.length, str.length - 1),
  str => str.split('#'),
  ([githubPath, branch]) => ({
    gitUrl: `https://github.com/${githubPath}.git`,
    branch
  })
)

export const parseComponent = async (
  sanitizedComponent,
  {
    parent,
    effects: {
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

    if (!modulePath && pathString.startsWith(GITHUB_PREFIX)) {
      const destination = await appCache.createNewCacheFolder()
      const {gitUrl, branch} = getGitInfoFromGithubPath(pathString)
      modulePath = await tryGitPath({gitUrl, destination, branch})
    }

    if (!modulePath) throw new TypeError(NoPathError({pathString, cwd: parent}))
    return modulePath
  } catch (e) {
    throw e
  }
}

export const getSpacing = (tab: number): string =>
  new Array(tab).fill('    ').join('')

export const hasEsopsCompose = async resolvedComponent => {
  const [resolvedComponentString, variables, options] = resolvedComponent
  const nextEsopsConfig = await async.result(
    findEsopsConfig(resolvedComponentString),
    true
  )
  const nextEsopsComposeDefinition =
    nextEsopsConfig && getComposeDefinitionFromEsopsConfig(nextEsopsConfig)
  const isDirectoryWithComposeDefinition =
    nextEsopsConfig && nextEsopsComposeDefinition ? true : false

  return isDirectoryWithComposeDefinition
}

export const sanitizeComponent = async component => {
  return isString(component) ? [component] : component
}

export const resolveComponent = params => async sanitizedComponent => {
  try {
    const {effects} = params
    const componentString = sanitizedComponent[0]
    const tab = getSpacing(params.treeDepth)
    effects.ui.info(`${tab}${componentString}`)
    effects.ui.info(`${tab}  resolving`)

    const componentType = getComponentType(componentString)

    const resolvedComponentString =
      componentType === URL_COMPONENT_TYPE ||
      componentType === PATH_COMPONENT_TYPE
        ? await async.result(parseComponent(sanitizedComponent, params), true)
        : componentString

    effects.ui.info(`${tab}  resolved`)

    return [
      resolvedComponentString,
      sanitizedComponent[1],
      sanitizedComponent[2]
    ]
  } catch (e) {
    throw params.effects.error.crash()
  }
}
