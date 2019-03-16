import {renderError, crash} from './components/error'
import {announce} from './components/announce'
import {md, mdFile} from './components/markdown'
import {logo, info, trace, debug, warn, setLevel} from './components/log'
import {map} from 'ramda'
import {composeSideEffect} from 'helpers/sync'

let log = {
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
  // Make functions mockable
  log = map(() => () => {}, log)
  log.crash = crash
}
// const composableLog = message =>
//   composeSideEffect(args => {
//     log.info(message)
//   })

export default log
