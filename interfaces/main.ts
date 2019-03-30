/**
 * Main Usage
 */

import {Run} from '../core/types'
import async from '../helpers/async'
import {isString} from '../helpers/sync'
import {extend} from '../helpers/sync'
import {createFsDriver, log} from '../side-effects'
import {
  findEsopsConfig,
  getComposeDefinitionFromEsopsConfig
} from '../parser/parse'
import esops1 from '../run/esops1'
import esops2 from '../run/esops2'

/**
 * ## Side Effect Commands
 * Side Effects are injected into the program as the `effects` key.
 */
const getLogLevel = logLevel =>
  logLevel ? logLevel : process.env.NODE_ENV === 'test' ? 'error' : 'info'

const interactiveUi = ui => ({
  ...log,
  ...log.createLogDriver({
    level: getLogLevel(ui),
    format: (level, ...args) => args.join(' ')
  })
})

const withSideEffects = extend(({logLevel}) => ({
  effects: {
    filesystem: createFsDriver(),
    ui: interactiveUi(logLevel),
    error: {
      crash: log.crash
    }
  }
}))

/**
 * Choose Esops Version
 */

const isProbablyEsops2 = async params => {
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

export const esops: Run = params =>
  async
    .pipe(
      withSideEffects,
      async params =>
        (await isProbablyEsops2(params))
          ? await esops2(params)
          : await esops1(params)
    )(params)
    .catch(log.crash)

export default esops
