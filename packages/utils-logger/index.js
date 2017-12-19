/* eslint-disable no-console, no-confusing-arrow */

import PrettyError from 'pretty-error'
import intercept from 'intercept-stdout'

import * as template from './template'

const setupInfoHandler = () => (message) => {
  if (!message) return
  console.log(message)
}

const header = () => {
  console.log('\n')
  console.log(template.header())
}

const setupHelpHandler = ({ beforeHelp }) => () => {
  beforeHelp()
  console.log(template.help())
}

const setupErrorHandler = ({ beforeError }) => {
  // eslint-disable-next-line
  Error.stackTraceLimit = Infinity

  const prettyError = new PrettyError()
    .appendStyle({
      'pretty-error > header': {
        display: 'none'
      }
    })
    .skipNodeFiles()
    .skipPackage('babel-cli')

  return (err) => {
    console.error(template.error(err))
    beforeError()
    console.log(prettyError.render(err))
    process.exit(1)
  }
}

const initLoggingSystem = () => {
  // Run header before console intercept.
  header()

  const endIntercept = intercept((message) => {
    return template.info(message)
  })

  const info = setupInfoHandler()

  const error = setupErrorHandler({ beforeError: endIntercept })

  const help = setupHelpHandler({ beforeHelp: endIntercept })

  return { info, error, help }
}

let log = null
export const initLogger = initLoggingSystem
export default log
