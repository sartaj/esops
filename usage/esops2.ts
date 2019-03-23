import async from '../helpers/async'
import {isString, throwError} from '../helpers/sync'
import resolver from '../side-effects/fs/resolver'
import {
  findEsopsConfig,
  normalizeUserInputedInfrastructureDefinition,
  resolveEsopsConfig
} from '../steps/parse'

export const esops2 = async.extend(async params => {
  const {cwd, destination, commands} = params
  const result = await async.result(resolveEsopsConfig({cwd}), true)

  const series = normalizeUserInputedInfrastructureDefinition(
    result.parsed.compose
  )

  const parallelSeries = series.map(parallel => {
    const resolveParallelComponents = parallel.map(component => {
      return async function resolveComponent() {
        const sanitizedComponent = isString(component) ? [component] : component
        const url = sanitizedComponent[0]
        const variables = sanitizedComponent[1]
        const options = sanitizedComponent[2]
        const [errorResolving, resolvedPath] = await async.result(
          await resolver(url, {cwd})
        )
        const esopsConfig = await async.result(
          findEsopsConfig(resolvedPath),
          true
        )
        if (esopsConfig && esopsConfig.compose) {
          await async.result(esops2({...params, cwd: resolvedPath}), true)
        }
        // const result = async.result(await render())
      }
    })
    return async function resolveSeries() {
      const [] = await async.parallel(resolveParallelComponents)
    }
  })

  await new Promise((resolve, reject) => {
    async.series(parallelSeries, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  }).catch(throwError)
})

export default esops2
