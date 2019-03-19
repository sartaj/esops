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

export default {
  pipe,
  result,
  fromNodeCallback
}
