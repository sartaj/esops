import {flatten} from 'ramda'

import async from '../utilities/async'
import {throwError} from '../utilities/sync'
import {
  getComposeDefinitionFromEsopsConfig,
  sanitizeComposeParam
} from './lenses'
import {ConfigNotFound} from './messages'
import {findEsopsConfig, hasEsopsCompose, resolveComponent} from './resolver'
import {renderComponent} from './render'
import {Report} from './types'

export const walk = async.extend(async params => {
  const {ui} = params.effects
  try {
    const renderOrRunRecursive = async composeDefinition => {
      /* resolve the component */
      const [resolutionError, resolvedComponent] = await resolveComponent(
        params
      )(composeDefinition)

      if (resolutionError) throw resolutionError

      /* check if component has esops compose */
      const componentIsALocalPathWithEsopsCompose = await hasEsopsCompose(
        params
      )(resolvedComponent)

      /* the report from the render is used for copying */
      let report: Report = []

      /* walk if `resolved path has a esops.json` file */
      if (componentIsALocalPathWithEsopsCompose) {
        ui.info(`${ui.getTabs(params.treeDepth)}  compose definition found`)
        ui.info(` `)
        await walk({
          ...params,
          parent: resolvedComponent,
          treeDepth: params.treeDepth + 1
        })
      } else {
        /* render resolved component */
        report = await renderComponent(params, resolvedComponent)
        ui.info(` `)
        /* return params with new results */

        return params.results.push(report)
      }
      /* return all results */
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
