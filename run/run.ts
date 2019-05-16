import {copyToDestinationWithPrompts} from '../core/copy-to-destination'
import {createReport, reportWalkStart} from '../core/messages'
import {UserParams} from '../core/types'
import {flattenWalkResults, walk} from '../core/walk-recursive'
import {withDefaultParams} from '../core/with-default-params'
import resolve from '../extensions/resolvers'
import {
  createFsDriver,
  createInteractiveConsoleUX,
  createShell,
  renderError,
  vm
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
      ui: createInteractiveConsoleUX(logLevel),
      shell: createShell(),
      vm,
      resolve
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

export const esops = (params: UserParams) =>
  async
    .pipe(
      withSideEffects,
      withDefaultParams,
      reportWalkStart,
      walk,
      flattenWalkResults,
      copyToDestinationWithPrompts,
      createReport
    )(params)
    .catch(crash)

export default esops
