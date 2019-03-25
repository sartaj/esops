import async from '../helpers/async'
import {isString, throwError} from '../helpers/sync'
import resolver from '../side-effects/fs/resolver'

import {
  findEsopsConfig,
  convertSeriesItemsToParallel,
  getComposeDefinitionFromEsopsConfig
} from '../steps/parse'

export const esops2RunRecursive = async.extend(async params => {
  const {
    cwd,
    destination,
    commands: {ui}
  } = params

  let {esopsResolvedDepth} = params
  esopsResolvedDepth = esopsResolvedDepth || 0
  esopsResolvedDepth++

  const result = await async.result(findEsopsConfig(cwd), true)
  const composeDefinition = getComposeDefinitionFromEsopsConfig(result)
  const series = convertSeriesItemsToParallel(composeDefinition)

  ui.debug('compose-depth', esopsResolvedDepth, '\n')
  ui.debug('compose-definition', composeDefinition)
  ui.debug('compose-series', JSON.stringify(series, null, 2))

  const parallelSeries = series.map(parallel => {
    ui.debug('compose-parallel', JSON.stringify(parallel, null, 2))
    const resolveParallelComponents = parallel.map(component => {
      return async function resolveComponent() {
        const sanitizedComponent = isString(component) ? [component] : component
        const url = sanitizedComponent[0]
        const variables = sanitizedComponent[1]
        const options = sanitizedComponent[2]
        const [errorResolving, resolvedPath] = await async.result(
          await resolver(url, {cwd})
        )

        const nextEsopsConfig = await async.result(
          findEsopsConfig(resolvedPath),
          true
        )
        const nextEsopsComposeDefinition = getComposeDefinitionFromEsopsConfig(
          result
        )

        if (nextEsopsConfig && nextEsopsComposeDefinition) {
          await async.result(
            esops2RunRecursive({
              ...params,
              esopsResolvedDepth,
              cwd: resolvedPath
            }),
            true
          )
        }
        ui.debug('compose-resolved', resolvedPath)
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

const convertEsops1ToEsops2 = params => {
  if (!params.destination && params.cwd)
    return {
      ...params,
      destination: params.cwd
    }
  else return params
}

export const esops2 = async.pipe(
  convertEsops1ToEsops2,
  esops2RunRecursive
)

export default esops2
