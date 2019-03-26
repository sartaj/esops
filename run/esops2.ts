import async from '../helpers/async'
import {isString, throwError} from '../helpers/sync'
import resolver from '../side-effects/fs/resolver'

import {
  findEsopsConfig,
  convertSeriesItemsToParallel,
  getComposeDefinitionFromEsopsConfig
} from '../parser/parse'
import {resolve} from 'dns'

const URL_COMPONENT_TYPE = 'URL'

const getComponentType = (componentString: string) => {
  return URL_COMPONENT_TYPE
}

const renderUrl = async (params, sanitizedComponent) => {
  try {
    const {
      cwd,
      effects: {ui}
    } = params
    const componentString = sanitizedComponent[0]
    const variables = sanitizedComponent[1]
    const options = sanitizedComponent[2]

    const [errorResolving, resolvedPath] = await async.result(
      await resolver(componentString, {cwd})
    )
    const nextEsopsConfig = await async.result(
      findEsopsConfig(resolvedPath),
      true
    )
    const nextEsopsComposeDefinition = getComposeDefinitionFromEsopsConfig(
      nextEsopsConfig
    )
    console.log(nextEsopsComposeDefinition)

    const isDirectoryWithComposeDefinition =
      nextEsopsConfig && nextEsopsComposeDefinition

    return {isDirectoryWithComposeDefinition, cwd: resolvedPath}
  } catch (e) {
    throw e
  }
}

const renderComponent = async (params, sanitizedComponent) => {
  const {
    cwd,
    effects: {ui}
  } = params

  const componentString = sanitizedComponent[0]
  const variables = sanitizedComponent[1]
  const options = sanitizedComponent[2]

  const componentType = getComponentType(componentString)

  ui.info(`Rendering:${componentString}`)

  let response
  switch (componentType) {
    case URL_COMPONENT_TYPE:
    default:
      response = await async.result(renderUrl(params, sanitizedComponent))
  }

  const [err, result] = response
  if (err) throw err

  const nextDirectory =
    componentType === URL_COMPONENT_TYPE &&
    result.isDirectoryWithComposeDefinition &&
    result.cwd

  ui.info(`Rendered:${componentString}`)

  return nextDirectory
}

export const esops2RunRecursive = async.extend(async params => {
  const {
    cwd,
    destination,
    effects: {ui}
  } = params

  let {esopsResolvedDepth} = params
  esopsResolvedDepth = esopsResolvedDepth || 0
  esopsResolvedDepth++

  const result = await async.result(findEsopsConfig(cwd), true)
  const composeDefinition = getComposeDefinitionFromEsopsConfig(result)
  const series = convertSeriesItemsToParallel(composeDefinition)

  ui.debug('Compose Definition:')
  ui.debug(JSON.stringify(series, null, 2))

  const parallelSeries = series.map(parallel => {
    const resolveParallelComponents = parallel.map(component => {
      return async function resolveComponent() {
        const sanitizedComponent = isString(component) ? [component] : component

        const nextDirectory = await renderComponent(params, sanitizedComponent)

        if (nextDirectory) {
          await async.result(
            esops2RunRecursive({
              ...params,
              esopsResolvedDepth,
              cwd: nextDirectory
            }),
            true
          )
        }
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
