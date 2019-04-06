/**
 * Main Usage
 */

import {Params} from '../core/types2'
import async from '../utilities/async'
import {isString} from '../utilities/sync'
import {extend} from '../utilities/sync'
import {
  createFsDriver,
  createResolver,
  createInteractiveConsoleUX,
  renderError
} from '../side-effects'
import {findEsopsConfig} from '../modules/parse'
import {getComposeDefinitionFromEsopsConfig} from '../core/lenses'

import esops1 from '../run/esops1'
import esops2 from '../run/esops2'

/**
 * ## Side Effect Commands
 * Side Effects are injected into the program as the `effects` key.
 */

const withSideEffects = extend(({logLevel}) => ({
  effects: {
    filesystem: createFsDriver(),
    resolver: createResolver(),
    ui: createInteractiveConsoleUX(logLevel)
  }
}))

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
 * Choose Esops Version
 */

const isProbablyEsops2 = async params => {
  if (params.destination) return true
  let probablyEsops2 = false
  try {
    const {cwd} = params
    const result = await async.result(findEsopsConfig(cwd), true)
    const composeDefinition = getComposeDefinitionFromEsopsConfig(result)

    // Short Circuit if previous version of esops
    const firstUrl = isString(composeDefinition)
      ? composeDefinition
      : composeDefinition[0]

    probablyEsops2 = firstUrl.startsWith('github:')
  } catch (e) {
    probablyEsops2 = false
  }
  return probablyEsops2
}

/**
 * Run
 */

export const esops = (params: Params) =>
  async
    .pipe(
      withSideEffects,
      async params =>
        (await isProbablyEsops2(params))
          ? await esops2(params)
          : await esops1(params)
    )(params)
    .catch(crash)

export default esops
