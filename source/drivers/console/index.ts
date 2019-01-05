import {is} from 'ramda'

import * as l from './components'

const logger =
  process.env.NODE_ENV === 'test'
    ? {
        announce: () => {},
        info: () => {},
        md: () => {},
        renderError: () => {}
      }
    : l

export const crash = e => {
  if (is(Object, e) || is(String, e)) {
    if (process.env.NODE_ENV === 'test') throw e
    logger.renderError(e)
    if (process.env.RUN_CONSOLE_TEST !== '1') process.exit(1)
  }
}

export default logger
