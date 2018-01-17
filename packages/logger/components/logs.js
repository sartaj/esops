import log from 'loglevel'
import chalk from 'chalk'

import { logo } from './brand'

export const info = message => {
  log.info(`${logo()} ${chalk.green(message)}`)
}

export { trace, debug, warn, setLevel } from 'loglevel'
