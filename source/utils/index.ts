import {is, tryCatch as RTryCatch} from 'ramda'

/**
 * Sync
 */
export const isString = (arg: any): arg is string => is(String)(arg)

export const throwIf = type => arg => {
  if (is(type, arg)) throw arg
  else return arg
}

export {curry, tryCatch} from 'ramda'

/**
 * Async
 */
const pipe = require('promised-pipe')
export {pipe}
export {default as result} from 'await-result'
