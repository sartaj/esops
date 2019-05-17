import {is, isNil, pipe} from 'ramda'
import {isArray, isObject, isString} from '../utilities/sync'
import {InvalidOptsError} from './messages'
import {
  Compose,
  Component,
  EsopsConfigObject,
  SanitizedComponent,
  SanitizedCompose,
  EsopsConfig
} from './types'

/**
 * ## esops2
 */

export const getCommandFromSanitized = (component: SanitizedComponent) =>
  component[0]

export const getCommand = (composeDefinition: Compose) => composeDefinition[0]

export const getVariables = (composeDefinition: Compose) => composeDefinition[1]

export const getOptions = (composeDefinition: Compose) => composeDefinition[2]

interface EsopsConfigObjectWithCompose extends EsopsConfigObject {
  compose: NonNullable<EsopsConfigObject['compose']>
}
export const isEsopsConfigObjectWithCompose = (
  arg: unknown
): arg is EsopsConfigObjectWithCompose =>
  typeof arg === 'object' && !isNil(arg) && arg.hasOwnProperty('compose')

const isComposeArrayOfCommands = (arg: Compose): arg is Component[] => false

export const isComposeCommand = (arg: Compose): arg is Component =>
  isString(arg) || // './foo'
  (isArray(arg) && arg.length === 1 && isString(arg[0])) || // ['./foo']
  (isArray(arg) && arg.length > 1 && isString(arg[0]) && !isString(arg[1])) || // compose: ['./foo'], not ['./foo', './test'], which is compose
  (isArray(arg) && isString(arg[0])) || // compose: ['./foo']
  false

export const getLastCommandFromConfig = (esopsJson: EsopsConfig) => {
  isEsopsConfigObjectWithCompose(esopsJson)
    ? isComposeArrayOfCommands(esopsJson.compose)
      ? getCommand(esopsJson.compose.slice(-1))
      : isComposeCommand(esopsJson.compose)
      ? getCommand(esopsJson.compose)
      : ''
    : ''
}

export const getComposeDefinitionFromEsopsConfig = result =>
  isNil(result)
    ? null
    : isString(result)
    ? [result]
    : isArray(result)
    ? result
    : result.compose

// TODO: Add SanitizedComponent to the return of this
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

export const getSanitizedComposeFromEsopsConfig = pipe(
  getComposeDefinitionFromEsopsConfig,
  sanitizeComposeParam
)

export const sanitizeComponent = async component =>
  isString(component) ? [component] : component

export const configIsString = (arg: any): arg is string => is(String)(arg)

export const configIsCompose = (arg: any): arg is Compose => is(Array)(arg)

export const configIsObject = (arg: any): arg is EsopsConfigObject =>
  is(Object)(arg) && !isArray(arg)
