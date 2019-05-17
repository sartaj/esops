import {is, Pred, T, curry, pipe} from 'ramda'
import * as stripJsonComments from 'strip-json-comments'

export const isString = (arg: any): arg is string => is(String)(arg)

export const isArray = (arg: any): arg is any[] => is(Array)(arg)

export const isObject = (arg: any): arg is Object =>
  is(Object)(arg) && !isArray(arg)

export const throwIfTypeIs = type => arg => {
  if (is(type, arg)) throw arg
  else return arg
}

export const throwError = e => {
  throw e
}

// [ramda types filter fix](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25581#issuecomment-442354314)
export const filter = fn => arr => arr.filter(fn)

// For `cond` arrays
export type Conditional = [Pred, (args: any) => void]

export const defaultTo = (cb): Conditional => [T, cb]

export const sideEffect = curry((cb: Function, arg: any) => {
  cb(arg)
  return arg
})

export const extend = next => previous => ({
  ...previous,
  ...(is(Function, next) ? next(previous) : next)
})

export const Try = fn => {
  try {
    return [null, fn()]
  } catch (e) {
    return [e, null]
  }
}

type ParseJSON = (json: string) => Object
export const parseJSON: ParseJSON = pipe(
  stripJsonComments,
  JSON.parse
)
