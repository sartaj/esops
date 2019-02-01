import {renderError, crash} from './components/error'
import {announce} from './components/announce'
import {md, mdFile} from './components/markdown'
import {logo, info, trace, debug, warn, setLevel} from './components/log'
import {map} from 'ramda'

let logger = {
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

if (process.env.NODE_ENV === 'test') {
  logger = map(() => () => {}, logger)
  logger.crash = crash
}

export default logger
