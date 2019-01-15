import * as pipe from 'promised-pipe'

import {Run} from '../core/types'
import {crash} from '../drivers/console'
import generate from '../modules/generators'
import parse from '../modules/parser'

export const esops: Run = params =>
  pipe(
    parse,
    generate
  )(params).catch(crash)

export default esops
