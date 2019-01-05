import {is, tryCatch as RTryCatch} from 'ramda'

/**
 * Sync
 */
export const isString = (arg: any): arg is string => is(String)(arg)

export const throwIfTypeIs = type => arg => {
  if (is(type, arg)) throw arg
  else return arg
}

export const throwError = e => {
  throw e
}

export {curry, tryCatch, is} from 'ramda'

// [ramda types filter fix](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25581#issuecomment-442354314)
export const filter = fn => arr => arr.filter(fn)

/**
 * Async
 */
const pipe = require('promised-pipe')
export {pipe}
export {default as result} from 'await-result'
