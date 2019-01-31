import {Run} from '../core/types'
import logger from '../side-effects/console'
import {pipe} from '../helpers/async'
import generate from '../steps/generate'
import parse from '../steps/parse'

logger.setLevel(0)

export const esops: Run = params =>
  pipe(
    parse,
    generate
  )(params).catch(logger.crash)

export default esops
