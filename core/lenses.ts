import {is, isNil} from 'ramda'

import {isArray, isObject, isString} from '../utilities/sync'
import {
  EFFECT_COMPONENT_TYPE,
  FILESYSTEM_EFFECT_PREFIX,
  GIT_URL_PREFIX,
  GITHUB_PREFIX,
  LOCAL_ABSOLUTE_PATH_PREFIX,
  LOCAL_RELATIVE_PATH_PREFIX,
  PATH_COMPONENT_TYPE,
  SHELL_EFFECT_PREFIX,
  URL_COMPONENT_TYPE
} from './constants'
import {Option, OptionsWithProps, Stacks, WithProps} from './types'
import {Compose, EsopsConfigObject} from './types2'
import {InvalidOptsError} from './messages'

/**
 * ## esops1
 */

export const isWithProps = opt =>
  Array.isArray(opt) &&
  opt.length === 2 &&
  typeof opt[1] === 'string' &&
  typeof opt[2] === 'object'

export const getPath = (opt: Option) =>
  is(String, opt)
    ? opt
    : is(String, opt[0])
    ? opt[0]
    : new TypeError(`${JSON.stringify(opt)} is not an object`)

export const createDefaultOpt = (path: string): WithProps => [path, {}]

export const convertAllOptionsToHaveProps = (opts: Stacks): OptionsWithProps =>
  isString(opts)
    ? [createDefaultOpt(opts)]
    : opts.map((opt: Option) => (isString(opt) ? createDefaultOpt(opt) : opt))

export const isValidOpts = opts => is(String, opts) || is(Array, opts)

/**
 * ## esops2
 */

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

export const sanitizeCompose = (composeDefinition: Compose) => {
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

const isGithub = componentString => componentString.startsWith(GITHUB_PREFIX)

const isGitUrl = componentString => componentString.startsWith(GIT_URL_PREFIX)

const isLocalPath = componentString =>
  componentString.startsWith(LOCAL_RELATIVE_PATH_PREFIX) ||
  componentString.startsWith(LOCAL_ABSOLUTE_PATH_PREFIX)

const isEffect = componentString =>
  componentString.startsWith(SHELL_EFFECT_PREFIX) ||
  componentString.startsWith(FILESYSTEM_EFFECT_PREFIX)

export const getComponentType = (componentString: string) => {
  return isGithub(componentString) || isGitUrl(componentString)
    ? URL_COMPONENT_TYPE
    : isLocalPath(componentString)
    ? PATH_COMPONENT_TYPE
    : isEffect(componentString)
    ? EFFECT_COMPONENT_TYPE
    : new Error('Not a component type')
}

export const configIsString = (arg: any): arg is string => is(String)(arg)

export const configIsCompose = (arg: any): arg is Compose => is(Array)(arg)

export const configIsObject = (arg: any): arg is EsopsConfigObject =>
  is(Object)(arg) && !isArray(arg)
