import async from '../helpers/async'
import {isString, throwError} from '../helpers/sync'
import {
  findEsopsConfig,
  convertSeriesItemsToParallel,
  getComposeDefinitionFromEsopsConfig
} from '../parser/parse'

const URL_COMPONENT_TYPE = 'URL'
const PATH_COMPONENT_TYPE = 'PATH'

const getComponentType = (componentString: string) => {
  return (
    (componentString.startsWith('github:') && URL_COMPONENT_TYPE) ||
    PATH_COMPONENT_TYPE
  )
}

const pathHasEsopsCompose = async localPath => {
  const nextEsopsConfig = await async.result(findEsopsConfig(localPath), true)
  const nextEsopsComposeDefinition = getComposeDefinitionFromEsopsConfig(
    nextEsopsConfig
  )

  const isDirectoryWithComposeDefinition =
    nextEsopsConfig && nextEsopsComposeDefinition ? true : false

  return isDirectoryWithComposeDefinition
}
const resolveUrl = async (params, sanitizedComponent) => {
  try {
    const {
      cwd,
      effects: {ui, filesystem}
    } = params
    const componentString = sanitizedComponent[0]
    const variables = sanitizedComponent[1]
    const options = sanitizedComponent[2]

    const resolvedPath = await async.result(
      await filesystem.resolver(componentString, params),
      true
    )
    return resolvedPath
  } catch (e) {
    throw e
  }
}

const renderComponent = async (params, sanitizedComponent) => {
  const {
    cwd,
    effects: {ui}
  } = params

  const tab = getSpacing(params.treeDepth)
  // console.log(params.effects.tempDir)
  const componentString = sanitizedComponent[0]
  const variables = sanitizedComponent[1]
  const options = sanitizedComponent[2]

  const componentType = getComponentType(componentString)

  ui.info(`${tab}  rendering`)
  const resolvedComponentString =
    componentType === URL_COMPONENT_TYPE
      ? await async.result(resolveUrl(params, sanitizedComponent))
      : componentString

  const resolvedComponentType = getComponentType(resolvedComponentString)

  let response
  switch (resolvedComponentType) {
    case PATH_COMPONENT_TYPE:
    default:
      response = await async.result(resolveUrl(params, sanitizedComponent))
  }

  const [err, result] = response
  if (err) throw err

  ui.info(`${tab}  rendered`)

  return result
}

const getSpacing = (tab: number): string => new Array(tab).fill('    ').join('')

const resolveComponent = params => async sanitizedComponent => {
  const {cwd, effects} = params
  const componentString = sanitizedComponent[0]
  const tab = getSpacing(params.treeDepth)
  effects.ui.info(`${tab}${componentString}`)
  effects.ui.info(`${tab}  resolving`)

  const componentType = getComponentType(componentString)

  const resolvedComponentString =
    componentType === URL_COMPONENT_TYPE
      ? await async.result(resolveUrl(params, sanitizedComponent), true)
      : componentString

  effects.ui.info(`${tab}  resolved`)

  return [resolvedComponentString, sanitizedComponent[1], sanitizedComponent[2]]
}

const sanitizeComponent = async component => {
  return isString(component) ? [component] : component
}
export const esops2RunRecursive = async.extend(async params => {
  const recurseOrRender = async resolvedComponent => {
    const resolvedComponentString = resolvedComponent[0]
    const [err, hasEsopsCompose] = await async.result(
      pathHasEsopsCompose(resolvedComponentString)
    )
    if (hasEsopsCompose) {
      params.effects.ui.info(
        `${getSpacing(params.treeDepth)}  compose definition found`
      )
      params.effects.ui.info(` `)
      await async.result(
        esops2RunRecursive({
          ...params,
          esopsResolvedDepth,
          cwd: resolvedComponentString,
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
    recurseOrRender
  )

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

  return async
    .series(
      series.map(parallel => async () =>
        async.parallel(
          parallel.map(component => async () => runComponent(component))
        )
      )
    )
    .catch(throwError)
})

const convertEsops1ToEsops2 = params => {
  if (!params.destination && params.cwd)
    return {
      ...params,
      treeDepth: 0,
      destination: params.cwd
    }
  else return params
}

export const esops2 = async.pipe(
  convertEsops1ToEsops2,
  esops2RunRecursive
)

export default esops2
