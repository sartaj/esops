const chalk = require('chalk')

const log = require('loglevel')

export {trace, debug, warn, setLevel} from 'loglevel'

export const logo = () => chalk.blue.bold.dim(`esops`)

export const info = message => {
  log.info(`${logo()} ${chalk.green(message)}`)
}
