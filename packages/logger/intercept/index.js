import PrettyError from 'pretty-error'
import intercept from 'intercept-stdout'
import * as components from '../components'

const setupPrettyError = () => {
  const initialStackLimit = Error.stackTraceLimit
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

  return {
    render: prettyError.render,
    stop: () => {
      // eslint-disable-next-line
      Error.stackTraceLimit = initialStackLimit
      prettyError.stop()
    }
  }
}

const logInterceptHandler = message => {
  return components.info(message)
}

const logErrorHandler = errorHandler => err => {
  console.error(components.error(err))
  console.log(errorHandler.render(err))
  process.exit(1)
}

// TODO: Revisit singleton object mutation strategy
// eslint-disable-next-line
let intercepting = false

export const isIntercepting = () => intercepting

export const init = () => {
  // Setup prettyError, which the intercept above uses to render errors.
  const errorHandler = setupPrettyError()

  // Intercept all stdout
  const stopStdoutIntercept = intercept(
    logInterceptHandler,
    logErrorHandler(errorHandler)
  )

  intercepting = true // TODO: Remove mutation

  const end = () => {
    errorHandler.stop()
    stopStdoutIntercept()
    intercepting = false // TODO: Remove mutation
  }

  return end
}
