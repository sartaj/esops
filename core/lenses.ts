import {is, isNil} from 'ramda'
import {isArray, isObject, isString} from '../utilities/sync'
import {InvalidOptsError} from './messages'
import {Compose, EsopsConfigObject, SanitizedComponent} from './types'

/**
 * ## esops2
 */

export const getCommandFromSanitized = (component: SanitizedComponent) =>
  component[0]

export const getCommand = (composeDefinition: Compose) => composeDefinition[0]

export const getVariables = (composeDefinition: Compose) => composeDefinition[1]

export const getOptions = (composeDefinition: Compose) => composeDefinition[2]

export const getComposeDefinitionFromEsopsConfig = result =>
  isNil(result)
    ? null
    : isString(result)
    ? [result]
    : isArray(result)
    ? result
    : result.compose

export const sanitizeComposeParam = (composeDefinition: Compose) => {
  try {
    return isString(composeDefinition)
      ? [[composeDefinition, {}, {}]]
      : isString(getCommand(composeDefinition)) &&
        composeDefinition.length === 1
      ? [[composeDefinition[0], {}, {}]]
      : isArray(composeDefinition) &&
        isString(getCommand(composeDefinition)) &&
        isObject(getVariables(composeDefinition))
      ? [composeDefinition]
      : composeDefinition
  } catch {
    throw new TypeError(InvalidOptsError())
  }
}

export const sanitizeComponent = async component =>
  isString(component) ? [component] : component

export const configIsString = (arg: any): arg is string => is(String)(arg)

export const configIsCompose = (arg: any): arg is Compose => is(Array)(arg)

export const configIsObject = (arg: any): arg is EsopsConfigObject =>
  is(Object)(arg) && !isArray(arg)
