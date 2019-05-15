import {flatten} from 'ramda'

import async from '../utilities/async'
import {throwError} from '../utilities/sync'
import {
  getComposeDefinitionFromEsopsConfig,
  sanitizeComposeParam
} from './lenses'
import {ConfigNotFound} from './messages'
import {findEsopsConfig, hasEsopsCompose, parseComponent} from './parser'
import {renderComponent} from './render'
import {Report} from './types'

export const walk = async.extend(async params => {
  const {ui} = params.effects
  try {
    const renderOrRunRecursive = async composeDefinition => {
      const [resolutionError, resolvedComponent] = await parseComponent(params)(
        composeDefinition
      )

      if (resolutionError) throw resolutionError

      const componentIsALocalPathWithEsopsCompose = await hasEsopsCompose(
        params
      )(resolvedComponent)

      let report: Report = []
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

    const getComposeDefinition = async.pipe(
      findEsopsConfig(params),
      async function checkForEsopsConfigPath(esopsConfigPath) {
        if (!esopsConfigPath)
          throw new TypeError(ConfigNotFound({cwd: params.parent[0]}))
        return esopsConfigPath
      },
      getComposeDefinitionFromEsopsConfig,
      sanitizeComposeParam
    )

    const runSeries = async.pipe(
      getComposeDefinition,
      async.mapToAsync(renderOrRunRecursive),
      async.series,
      results => ({...params, results})
    )

    return runSeries(params.parent[0]).catch(throwError)
  } catch (e) {
    throw e
  }
})

/* Since the walk is recursive, the results from the walk could be a deeply nested array. */
export const flattenWalkResults = async.extend(async params => ({
  results: flatten(params.results)
}))
