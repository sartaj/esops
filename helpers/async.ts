/**
 * Async
 */
import * as pipe from 'promised-pipe'
import * as result from 'await-result'
import * as async from 'async'

export {pipe, result}

const promiseFromNodeCallback = cb => (...args) => {
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

export const fromNodeCallback = cb => async (...args) =>
  result(promiseFromNodeCallback(cb)(...args))

export const series = fromNodeCallback(async.series)
export const parallel = fromNodeCallback(async.parallel)

export const extend = fn => async prev =>
  fn(prev)
    .then(next => ({...prev, ...next}))
    .catch(e => {
      throw e
    })

export default {
  pipe,
  result,
  extend,
  fromNodeCallback,
  series,
  parallel
}
