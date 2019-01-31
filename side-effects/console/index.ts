const chalk = require('chalk')
const log = require('loglevel')

import {trace, debug, warn, setLevel} from 'loglevel'

import {renderError, crash} from './components/error'
import {announce} from './components/announce'
import {md, mdFile} from './components/markdown'

const logo = () => chalk.blue.bold.dim(`esops`)

const info = message => {
  log.info(`${logo()} ${chalk.green(message)}`)
}

const logger =
  process.env.NODE_ENV !== 'test'
    ? {
        announce,
        md,
        mdFile,
        logo,
        info,
        trace,
        debug,
        warn,
        renderError,
        crash,
        setLevel
      }
    : {
        announce: () => {},
        info: () => {},
        md: () => {},
        renderError: () => {},
        logo: () => {},
        setLevel: () => {}
      }

export default logger
