import chalk from 'chalk'

import {CWDNotDefined, InvalidOptsError} from './messages'
import {EsopsConfig} from './types'
import async from '../utilities/async'
import {parseJSON} from '../utilities/sync'
import {
  getComposeDefinitionFromEsopsConfig,
  sanitizeComponent,
  getCommandFromSanitized
} from './lenses'

/**
 * ## Resolvers
 */
export const resolveSanitizedComponent = params => async sanitizedComponent => {
  try {
    const {
      effects: {ui},
      parent
    } = params
    const componentString: string = getCommandFromSanitized(sanitizedComponent)
    const parentPath = getCommandFromSanitized(parent)
    const tab = ui.getTabs(params.treeDepth)

    if (!parentPath) throw new TypeError(CWDNotDefined())

    ui.info(`${tab}${chalk.bold(componentString)}`)
    ui.info(`${tab}  resolving`)

    const resolvedComponentString = await async.result(
      params.effects.resolve(params, sanitizedComponent),
      true
    )

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

export const resolveComponent = params => composeDefinition =>
  async.result(
    async.pipe(
      sanitizeComponent,
      resolveSanitizedComponent(params)
    )(composeDefinition)
  )

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
    const esopsConfig = filesystem.existsSync(esopsConfigPath)
      ? filesystem.readFileSync(esopsConfigPath, {encoding: 'utf-8'})
      : '{}'

    const parsed = (() => {
      try {
        return parseJSON(esopsConfig)
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
