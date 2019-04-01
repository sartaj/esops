/**
 * Async
 */
import * as pipe from 'promised-pipe'
import * as result from 'await-result'
import * as async from 'async'
import {reduce} from 'ramda'
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

export const seriesPromise = reduce(
  (promiseChain: Promise<any[]>, currentTask: () => Promise<any>) => {
    return promiseChain.then(chainResults =>
      currentTask().then(currentResult => [...chainResults, currentResult])
    )
  },
  Promise.resolve([])
)

type AsyncFn = () => Promise<any>
export const parallelPromise = (parallel: AsyncFn[]) =>
  Promise.all(parallel.map((fn: AsyncFn) => fn()))

export const fromNodeCallback = cb => async (...args) =>
  result(promiseFromNodeCallback(cb)(...args))

export const series = <T>(seriesArr: Promise<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    async.series(seriesArr, (err, result: T) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

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
  parallel,
  parallelPromise,
  seriesPromise
}
