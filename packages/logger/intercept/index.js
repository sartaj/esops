// const intercept = require 'intercept-stdout'
const errorHandler = require('../components/Error')

module.exports.init = () => {
  // To render exceptions thrown in non-promies code:
  errorHandler.init()
  // Setup prettyError, which the intercept above uses to render errors.
  // const errorHandler = setupPrettyError()
  // Intercept all stdout
  // const stopStdoutIntercept = intercept(
  //   logInterceptHandler,
  //   logErrorHandler(errorHandler)
  // )
  // intercepting = true // TODO: Remove mutation
  // const end = () => {
  // errorHandler.stop()
  // stopStdoutIntercept()
  // intercepting = false // TODO: Remove mutation
  // }
  // return end
}
