import async from '../utilities/async'
import {PATH_COMPONENT_TYPE, EFFECT_COMPONENT_TYPE} from './constants'
import {getComponentType} from './lenses'
import {renderPathComponent} from './render-path'
import {renderEffectComponent} from './render-effect'
import {Params, SanitizedComponent} from './types'

export const renderComponent = async (
  params: Params,
  sanitizedComponent: SanitizedComponent
) => {
  const {
    effects: {ui}
  } = params

  const tab = ui.getTabs(params.treeDepth)
  const [componentString, variables, options] = sanitizedComponent

  const componentType = getComponentType(componentString)
  let response
  switch (componentType) {
    case EFFECT_COMPONENT_TYPE:
      response = await async.result(
        renderEffectComponent(params, sanitizedComponent)
      )
    case PATH_COMPONENT_TYPE:
      response = await async.result(
        renderPathComponent(params, sanitizedComponent)
      )
      break
    default:
      throw new Error('command not recognized.')
  }

  const [err, result] = response
  if (err) throw err

  ui.info(`${tab}  rendered`)

  return result
}
