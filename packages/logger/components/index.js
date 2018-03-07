const chalk = require('chalk')
const log = require('loglevel')

log.setLevel(0)

module.exports.announce = require('./announce').announce
module.exports.image = require('./image').image
module.exports.carlton = require('./image').carlton
module.exports.md = require('./markdown').md
module.exports.mdFile = require('./markdown').mdFile
module.exports.error = require('./error')

const logo = () => chalk.blue.bold.dim(`esops`)

module.exports.logo = logo

module.exports.header = () => logo()

module.exports.info = message => {
  log.info(`${logo()} ${chalk.green(message)}`)
}

const { trace, debug, warn, setLevel } = require('./')

module.exports.chalk = chalk
module.exports.trace = trace
module.exports.debug = debug
module.exports.warn = warn
module.exports.setLevel = setLevel
