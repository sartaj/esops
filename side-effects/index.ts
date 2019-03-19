import log from './console'
import {sideEffect, extend} from '../helpers/sync'
import {pipe} from 'ramda'
import temporaryDirectory from './fs/temporary-directory'
import fs from './fs/index'

const setLoggingLevel = sideEffect(({logLevel} = {logLevel: 0}) => {
  log.setLevel(logLevel)
})

const addCommands = extend({
  commands: {
    tempDir: temporaryDirectory(),
    filesystem: fs,
    ui: log,
    processes: process,
    error: {
      crash: log.crash
    }
  }
})

export const configureSideEffects = pipe(
  setLoggingLevel,
  addCommands
)

export {fs}
export {log}
export {default as process} from './process'
