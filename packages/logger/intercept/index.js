// import intercept from 'intercept-stdout'
import * as errorHandler from '../components/Error'

export const init = () => {
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
