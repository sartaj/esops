import {is, Pred, T, curry} from 'ramda'

export const isString = (arg: any): arg is string => is(String)(arg)

export const isArray = (arg: any): arg is [] => is(Array)(arg)

export const isObject = val => is(Object)(val) && !isArray(val)

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
