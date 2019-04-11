import async from '../utilities/async'
import {PATH_COMPONENT_TYPE} from './constants'
import {getComponentType} from './lenses'
import {renderPathComponent} from './render-path'

export const renderComponent = async (params, sanitizedComponent) => {
  const {
    effects: {ui}
  } = params

  const tab = ui.getTabs(params.treeDepth)
  const [componentString, variables, options] = sanitizedComponent

  const componentType = getComponentType(componentString)
  let response
  switch (componentType) {
    case PATH_COMPONENT_TYPE:
    default:
      response = await async.result(
        renderPathComponent(params, sanitizedComponent)
      )
  }

  const [err, result] = response
  if (err) throw err

  ui.info(`${tab}  rendered`)

  return result
}
