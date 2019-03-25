import {debug, info, setLevel, trace, warn} from 'loglevel'

import {announce} from './components/announce'
import {crash, renderError} from './components/error'
import {md, mdFile} from './components/markdown'

export const log = {
  announce,
  md,
  mdFile,
  info,
  trace,
  debug,
  warn,
  renderError,
  crash,
  setLevel
}

export default log
