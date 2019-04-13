import {flatten} from 'ramda'

import async from '../utilities/async'
import {throwError} from '../utilities/sync'
import {
  getComposeDefinitionFromEsopsConfig,
  sanitizeComponent,
  sanitizeCompose
} from './lenses'
import {ConfigNotFound} from './messages'
import {findEsopsConfig, hasEsopsCompose, resolveComponent} from './parser'
import {renderComponent} from './render'

export const walk = async.extend(async params => {
  const {ui} = params.effects
  ui.info(params.parent[0])
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
          parent: resolvedComponent,
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
      findEsopsConfig(params),
      async localPath => {
        if (!localPath)
          throw new TypeError(ConfigNotFound({cwd: params.parent[0]}))
        return localPath
      },
      getComposeDefinitionFromEsopsConfig,
      sanitizeCompose,
      async.mapToAsync(renderOrRunRecursive),
      async.series,
      results => ({...params, results})
    )

    return runSeries(params.parent[0]).catch(throwError)
  } catch (e) {
    throw e
  }
})

export const flattenWalkResults = async.extend(async params => ({
  results: flatten(params.results)
}))
