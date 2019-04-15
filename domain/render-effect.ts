import {Params, SanitizedComponent} from './types'
import {Try} from '../utilities/sync'
import {VariableError} from './errors'
import {generateTemplateString} from './parse-variables'
import {map, is} from 'ramda'

const isMappable = x => is(Object, x) || is(Array, x)

const deepMap = fn => map(x => (isMappable(x) ? deepMap(fn)(x) : fn(x)))

const parseVariables = (parentComponent, childComponent) => {
  const parentVariables = parentComponent[1] || {}
  const childVariables = childComponent[1] || {}

  const context = {
    parent: parentVariables
  }

  const parsedVariables = deepMap(value =>
    is(String) ? generateTemplateString(value)(context) : value
  )(childVariables)

  const variables = {
    ...context,
    ...parsedVariables
  }
  return variables
}

const parseEffectString = (componentString, parsedVariables) => {
  const [err, effect] = Try(() =>
    generateTemplateString(componentString)(parsedVariables)
  )
  return [err, effect]
}

const runEffect = ({shell, vm}, effect) => {
  vm.runInNewContext(effect, {shell})
}

export const renderEffectComponent = (
  params: Params,
  sanitizedComponent: SanitizedComponent
) => {
  const componentString = sanitizedComponent[0]

  const variables = parseVariables(params.parent, sanitizedComponent)

  const [err, effect] = parseEffectString(componentString, variables)

  if (err) throw new VariableError(err)
  const {vm, shell} = params.effects
  runEffect({shell, vm}, effect)
  return true
}
