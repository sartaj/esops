/**
 * Main Usage
 */

import {Run} from '../core/types'
import {configureSideEffects, log} from '../side-effects'
import {pipe} from '../helpers/async'
import generate from '../steps/generate'
import parse from '../steps/parse'

export const esops: Run = params =>
  pipe(
    configureSideEffects,
    parse,
    generate
  )(params).catch(log.crash)

export default esops
