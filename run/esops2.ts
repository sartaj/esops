import {
  getComposeDefinitionFromEsopsConfig,
  sanitizeComponent,
  sanitizeCompose,
  configIsObject
} from '../core/lenses'
import {findEsopsConfig} from '../modules/parse'
import {
  hasEsopsCompose,
  resolveComponent,
  findEsopsConfig2
} from '../modules/parser2'
import {copyToDestination, renderComponent} from '../modules/render'
import async from '../utilities/async'
import {throwError, isObject} from '../utilities/sync'

export const walk = async.extend(async params => {
  const {ui, error} = params.effects
  try {
    const renderOrRunRecursive = async composeDefinition => {
      const [resolutionError, resolvedComponent] = await async.result(
        async.pipe(
          sanitizeComponent,
          resolveComponent(params)
        )(composeDefinition)
      )
      if (resolutionError) throw resolutionError
      const componentIsALocalPathWithEsopsCompose = await hasEsopsCompose(
        resolvedComponent
      )

      if (componentIsALocalPathWithEsopsCompose) {
        ui.info(`${ui.getTabs(params.treeDepth)}  compose definition found`)
        ui.info(` `)
        await walk({
          ...params,
          parent: resolvedComponent[0],
          treeDepth: params.treeDepth + 1
        })
      } else {
        await renderComponent(params, resolvedComponent)
        ui.info(` `)
      }
    }

    const runSeries = async.pipe(
      findEsopsConfig,
      getComposeDefinitionFromEsopsConfig,
      sanitizeCompose,
      async.mapToAsync(renderOrRunRecursive),
      async.series,
      results => ({...params, results})
    )

    return runSeries(params.parent).catch(throwError)
  } catch (e) {
    throw e
  }
})

const withDefaultParams = async params => {
  try {
    const {
      effects: {
        filesystem: {path}
      }
    } = params
    const root = params.root || params.cwd

    if (!root) throw new TypeError('no root defined.')

    const rootConfig = await findEsopsConfig2(params)(root)

    const destinationFromConfig =
      configIsObject(rootConfig) &&
      rootConfig.destination &&
      path.join(root, rootConfig.destination)

    const destination = params.destination || destinationFromConfig || root

    const paths = {
      root,
      parent: root,
      destination
    }
    return {
      ...params,
      treeDepth: 0,
      ...paths
    }
  } catch (e) {
    throw e
  }
}

const createReport = async params => {
  const {
    destination,
    logLevel,
    effects: {filesystem, ui}
  } = params
  const files = filesystem.listTreeSync(destination)
  const filesList = files
    .map(file => filesystem.path.relative(destination, file))
    .join('\n')

  ui.md(filesList, logLevel)
}

const withErrorLog = async.extend(async () => {
  // Error.stackTraceLimit = 100
  // process.on('unhandledRejection', (reason, p) => {
  //   console.log('Unhandled Rejection at:', reason.stack)
  //   // application specific logging, throwing an error, or other logic here
  // })
})

export const esops2 = async.pipe(
  withErrorLog,
  withDefaultParams,
  walk,
  copyToDestination,
  createReport
)
export default esops2
