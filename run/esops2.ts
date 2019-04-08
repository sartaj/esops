import chalk from 'chalk'
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
import {copyToDestinationWithPrompts, renderComponent} from '../modules/render'
import async from '../utilities/async'
import {throwError} from '../utilities/sync'
import {FinalReport2} from '../core/messages'

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

export const esops2 = async.pipe(
  withDefaultParams,
  reportWalkStart,
  walk,
  copyToDestinationWithPrompts,
  createReport
)
export default esops2
