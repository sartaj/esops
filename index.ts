import chalk from 'chalk'

import {
  configIsObject,
  getComposeDefinitionFromEsopsConfig,
  sanitizeComponent,
  sanitizeCompose
} from './domain/lenses'
import {ConfigNotFound, FinalReport2} from './domain/messages'
import {Params} from './domain/types'
import {
  findEsopsConfig2,
  hasEsopsCompose,
  resolveComponent
} from './domain/parser'
import {copyToDestinationWithPrompts, renderComponent} from './domain/render'
import {
  createFsDriver,
  createInteractiveConsoleUX,
  createResolver,
  renderError
} from './side-effects'
import async from './utilities/async'
import {throwError} from './utilities/sync'
import {extend} from './utilities/sync'

export const walk = async.extend(async params => {
  const {ui} = params.effects
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
        params
      )(resolvedComponent)

      let report = []
      if (componentIsALocalPathWithEsopsCompose) {
        ui.info(`${ui.getTabs(params.treeDepth)}  compose definition found`)
        ui.info(` `)
        await walk({
          ...params,
          parent: resolvedComponent[0],
          treeDepth: params.treeDepth + 1
        })
      } else {
        report = await renderComponent(params, resolvedComponent)
        ui.info(` `)
        return params.results.push(report)
      }
      return report ? [...params.results, report] : params.results
    }

    const runSeries = async.pipe(
      findEsopsConfig2(params),
      async s => {
        if (!s) throw new TypeError(ConfigNotFound({cwd: params.parent}))
        return s
      },
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
        ui,
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

    params.prompts && ui.prompts.inject(params.prompts)

    return {
      ...params,
      treeDepth: 0,
      ...paths,
      results: []
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
  const renderPrepFolder = await filesystem.appCache.getRenderPrepFolder()

  const generatedFiles = filesystem
    .listTreeSync(renderPrepFolder)
    .map(file => filesystem.path.relative(renderPrepFolder, file))
    .sort()

  ui.md(
    FinalReport2({
      generatedFiles,
      destination
    }),
    logLevel
  )
}
export const reportWalkStart = async.extend(async params => {
  params.effects.ui.info(chalk.bold.blue('\ncomposing infrastructure...\n'))
})

/**
 * ## Side Effect Commands
 * Side Effects are injected into the program as the `effects` key.
 */

const withSideEffects = extend(({logLevel}) => ({
  effects: {
    filesystem: createFsDriver(),
    resolver: createResolver(),
    ui: createInteractiveConsoleUX(logLevel)
  }
}))

const crash = (e: Error) => {
  switch (process.env.NODE_ENV) {
    case 'test':
      throw e
    case 'e2e':
      renderError(e)
      break
    default:
      renderError(e)
      process.exit(1)
  }
}

/**
 * Run
 */

export const esops = (params: Params) =>
  async
    .pipe(
      withSideEffects,
      withDefaultParams,
      reportWalkStart,
      walk,
      copyToDestinationWithPrompts,
      createReport
    )(params)
    .catch(crash)

export default esops
