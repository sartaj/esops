import async from '../helpers/async'
import {throwError} from '../helpers/sync'
import {map, pipe} from 'ramda'
import {findEsopsConfig} from '../parser/parse'
import {
  getSpacing,
  convertSeriesItemsToParallel,
  getComposeDefinitionFromEsopsConfig,
  hasEsopsCompose,
  resolveComponent,
  sanitizeComponent
} from '../parser/parser2'
import {copyToDestination, renderComponent} from '../renderer/render'

export const walk = async.extend(async params => {
  const renderOrRunRecursive = async resolvedComponent => {
    const componentIsALocalPathWithEsopsCompose = await async.result(
      hasEsopsCompose(resolvedComponent),
      true
    )

    if (componentIsALocalPathWithEsopsCompose) {
      params.effects.ui.info(
        `${getSpacing(params.treeDepth)}  compose definition found`
      )
      params.effects.ui.info(` `)
      await async.result(
        walk({
          ...params,
          parent: resolvedComponent[0],
          treeDepth: params.treeDepth + 1
        }),
        true
      )
    } else {
      await renderComponent(params, resolvedComponent)
      params.effects.ui.info(` `)
    }
  }

  const runComponent = async.pipe(
    sanitizeComponent,
    resolveComponent(params),
    renderOrRunRecursive
  )

  const runParallel = pipe(
    map(component => async () => runComponent(component)),
    runnerFunc => async () => async.parallel(runnerFunc)
  )

  const runSeries = async.pipe(
    findEsopsConfig,
    getComposeDefinitionFromEsopsConfig,
    convertSeriesItemsToParallel,
    map(runParallel),
    async.series,
    () => params
  )

  const {parent} = params

  return runSeries(parent).catch(throwError)
})

const withDefaultParams = async params => {
  const destination = params.destination || params.cwd
  const root = params.root || destination

  return {
    ...params,
    treeDepth: 0,
    root,
    parent: root,
    destination
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

export const esops2 = async.pipe(
  withDefaultParams,
  walk,
  copyToDestination,
  createReport
)

export default esops2
