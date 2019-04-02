import async from '../helpers/async'
import {throwError} from '../helpers/sync'
import {findEsopsConfig} from '../parser/parse'
import {hasEsopsCompose, resolveComponent} from '../parser/parser2'

import {
  getComposeDefinitionFromEsopsConfig,
  sanitizeComponent,
  sanitizeCompose
} from '../core/helpers'

import {copyToDestination, renderComponent} from '../renderer/render'

export const walk = async.extend(async params => {
  const {ui} = params.effects
  const renderOrRunRecursive = async composeDefinition => {
    const resolvedComponent = await async.pipe(
      sanitizeComponent,
      resolveComponent(params)
    )(composeDefinition)

    const componentIsALocalPathWithEsopsCompose = await async.result(
      hasEsopsCompose(resolvedComponent),
      true
    )

    if (componentIsALocalPathWithEsopsCompose) {
      ui.info(`${ui.getTabs(params.treeDepth)}  compose definition found`)
      ui.info(` `)
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
