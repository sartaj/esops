const chalk = require('chalk')
const log = require('loglevel')

log.setLevel(0)
export {trace, debug, warn, setLevel} from 'loglevel'

export const announce = require('./announce').announce
export const image = require('./image').image
export const carlton = require('./image').carlton
export const md = require('./markdown').md
export const mdFile = require('./markdown').mdFile
export const error = require('./error')

export const logo = () => chalk.blue.bold.dim(`esops`)

export const header = () => logo()

export const info = message => {
  log.info(`${logo()} ${chalk.green(message)}`)
}
