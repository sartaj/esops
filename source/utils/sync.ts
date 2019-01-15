import {is} from 'ramda'

export const isString = (arg: any): arg is string => is(String)(arg)

export const throwIfTypeIs = type => arg => {
  if (is(type, arg)) throw arg
  else return arg
}

export const throwError = e => {
  throw e
}

// [ramda types filter fix](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25581#issuecomment-442354314)
export const filter = fn => arr => arr.filter(fn)
