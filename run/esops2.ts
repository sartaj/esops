import async from '../helpers/async'
import {throwError} from '../helpers/sync'
import {
  convertSeriesItemsToParallel,
  findEsopsConfig,
  getComposeDefinitionFromEsopsConfig
} from '../parser/parse'
import {
  getSpacing,
  hasEsopsCompose,
  resolveComponent,
  sanitizeComponent
} from '../parser/parser2'
import {copyToDestination, renderComponent} from '../renderer/render'

const withEsopsRecursion = (
  params,
  runRecursion
) => async resolvedComponent => {
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
      runRecursion({
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

export const run = async.extend(async params => {
  const runComponent = async.pipe(
    sanitizeComponent,
    resolveComponent(params),
    withEsopsRecursion(params, run)
  )

  const {
    parent,
    destination,
    effects: {ui}
  } = params

  const result = await async.result(findEsopsConfig(parent), true)
  const composeDefinition = getComposeDefinitionFromEsopsConfig(result)
  const series = convertSeriesItemsToParallel(composeDefinition)

  return async
    .series(
      series.map(parallel => async () =>
        async.parallel(
          parallel.map(component => async () => runComponent(component))
        )
      )
    )
    .then(() => {
      return params
    })
    .catch(throwError)
})

const convertEsops1ToEsops2 = async params => {
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

const createReport = async p => {
  const {filesystem, ui} = p.effects
  ui.info(await filesystem.listTreeSync(p.destination))
}

export const esops2 = async.pipe(
  convertEsops1ToEsops2,
  run,
  copyToDestination,
  createReport
)

export default esops2
