/**
 * Async
 */
import * as pipe from 'promised-pipe'
import * as result from 'await-result'

export {pipe, result}

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
  extend
}
