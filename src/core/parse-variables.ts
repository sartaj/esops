import {is, map} from 'ramda'

import {Try} from '../utilities/sync'

var compile = require('es6-template-strings/compile')
var resolve = require('es6-template-strings/resolve-to-string')

export const generateTemplateString = (str: string) => vars =>
  resolve(compile(str), vars)

const isMappable = x => is(Object, x) || is(Array, x)

const deepMap = fn => map(x => (isMappable(x) ? deepMap(fn)(x) : fn(x)))

export const parseVariables = ({parent, child, ...rest}) => {
  const parentVariables = parent[1] || {}
  const childVariables = child[1] || {}

  const context = {
    parent: parentVariables,
    ...rest
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

export const parseComponentStringVariables = (
  componentString,
  parsedVariables
) => {
  const [err, effect] = Try(() =>
    generateTemplateString(componentString)(parsedVariables)
  )
  return [err, effect]
}
