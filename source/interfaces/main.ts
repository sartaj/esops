import {Run} from '../core/types'
import logger from '../drivers/console'
import generate from '../modules/generators'
import parse from '../modules/parser'
import {pipe} from '../utils/async'

logger.setLevel(0)

export const esops: Run = params =>
  pipe(
    parse,
    generate
  )(params).catch(logger.crash)

export default esops
