import log from './console'
import {composeSideEffect} from '../helpers/sync'

export const configureSideEffects = composeSideEffect(
  ({logLevel} = {logLevel: 0}) => {
    log.setLevel(logLevel)
  }
)

export {default as fs} from './fs/index'

export {log}
