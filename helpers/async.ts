/**
 * Async
 */
import * as pipe from 'promised-pipe'
import * as result from 'await-result'
import parallel from 'async/parallel'
import waterfall from 'async/waterfall'

export {pipe, result, parallel, waterfall}

export const fromNodeCallback = cb => (...args) => {
  return new Promise((resolve, reject) => {
    cb.apply(null, [
      ...args,
      (err, data) => {
        if (err) reject(err)
        else resolve(data)
      }
    ])
  })
}

export const extend = fn => async prev =>
  fn(prev)
    .then(next => ({...prev, ...next}))
    .catch(e => {
      throw e
    })

export default {
  pipe,
  result,
  fromNodeCallback,
  extend,
  waterfall,
  parallel
}
