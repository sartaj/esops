import * as createLogDriver from 'log-driver'
import * as prompts from 'prompts'

import {announce} from './components/announce'
import {renderError} from './components/error'
import {md, mdFile} from './components/markdown'
import {isObject} from 'util'

const getTabs = (tab: number): string => new Array(tab).fill('    ').join('')

const getLogLevel = logLevel =>
  logLevel ? logLevel : process.env.NODE_ENV === 'test' ? 'error' : 'info'

const prettifyLogArgs = (...args) =>
  args.map(arg => (isObject(arg) ? JSON.stringify(arg, null, 2) : arg))

/**
 * Create Interactive UX
 */

export const createInteractiveConsoleUX = ui => {
  const logger = createLogDriver({
    level: getLogLevel(ui),
    format: (level, ...args) => args.join(' ')
  })
  return {
    getTabs,
    announce,
    renderError,
    md,
    mdFile,
    prompts,
    ...logger,
    info: (...args) => logger.info(prettifyLogArgs(...args))
  }
}

// Deprecated
export {announce, renderError, md, mdFile}
