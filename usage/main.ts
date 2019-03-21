/**
 * Main Usage
 */

import {Run} from '../core/types'
import {configureSideEffects, log, fs} from '../side-effects'
import {pipe} from '../helpers/async'
import generate from '../steps/generate'
import parse from '../steps/parse'

const convertEsops1ToEsops2 = params => {
  if (!params.destination && params.cwd)
    return {
      ...params,
      destination: params.cwd
    }
  else return params
}

export const esops: Run = params =>
  pipe(
    configureSideEffects,
    convertEsops1ToEsops2,
    parse
  )(params).catch(log.crash)

export default esops
