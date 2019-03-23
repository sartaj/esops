/**
 * Main Usage
 */
import {Run} from '../core/types'
import async from '../helpers/async'
import {isString} from '../helpers/sync'
import {configureSideEffects, log} from '../side-effects'
import {resolveEsopsConfig} from '../steps/parse'
import esops1 from './esops1'
import esops2 from './esops2'

const convertEsops1ToEsops2 = params => {
  if (!params.destination && params.cwd)
    return {
      ...params,
      destination: params.cwd
    }
  else return params
}

export const selectEsopsVersion = async params => {
  const {cwd} = params
  const result = await async.result(resolveEsopsConfig({cwd}), true)

  // Short Circuit if previous version of esops
  const firstUrl = isString(result.parsed.compose)
    ? result.parsed.compose
    : result.parsed.compose[0]

  if (
    firstUrl.startsWith('node:') ||
    firstUrl.startsWith('.') ||
    firstUrl.startsWith('/')
  ) {
    return esops1(params)
  } else {
    await async.pipe(
      convertEsops1ToEsops2,
      esops2
    )(params)
  }
}

export const esops: Run = params =>
  async
    .pipe(
      configureSideEffects,
      selectEsopsVersion
    )(params)
    .catch(log.crash)

export default esops
