import {run} from '../domain/run'
import {UserParams} from '../domain/types'
import {
  createFsDriver,
  createInteractiveConsoleUX,
  createResolver,
  createShell,
  renderError
} from '../side-effects'
import async from '../utilities/async'
import {extend} from '../utilities/sync'

/**
 * ## Side Effect Commands
 * Side Effects are injected into the program as the `effects` key.
 */

const withSideEffects = extend(({logLevel}) => {
  return {
    effects: {
      filesystem: createFsDriver(),
      resolver: createResolver(),
      ui: createInteractiveConsoleUX(logLevel),
      shell: createShell()
    }
  }
})

const crash = (e: Error) => {
  switch (process.env.NODE_ENV) {
    case 'test':
      throw e
    case 'e2e':
      renderError(e)
      break
    default:
      renderError(e)
      process.exit(1)
  }
}

/**
 * Run
 */

export const esops = (params: UserParams) =>
  async
    .pipe(
      withSideEffects,
      run
    )(params)
    .catch(crash)

export default esops
