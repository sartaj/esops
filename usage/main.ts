/**
 * Main Usage
 */
import {pipe} from 'ramda'

import {Run} from '../core/types'
import async from '../helpers/async'
import {isString} from '../helpers/sync'
import {extend, sideEffect} from '../helpers/sync'
import {fs, log, temporaryDirectory} from '../side-effects'
import {
  findEsopsConfig,
  getComposeDefinitionFromEsopsConfig
} from '../steps/parse'
import esops1 from './esops1'
import esops2 from './esops2'

/**
 * Side Effects
 */
const installSideEffects = extend({
  commands: {
    tempDir: temporaryDirectory(),
    filesystem: fs,
    ui: log,
    error: {
      crash: log.crash
    }
  }
})

const setLoggingLevel = sideEffect(({logLevel, commands}) => {
  commands.ui.setLevel(
    logLevel ? logLevel : process.env.NODE_ENV === 'test' ? 'error' : 'trace'
  )
})

export const withCommands = pipe(
  installSideEffects,
  setLoggingLevel
)

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
      withCommands,
      async params =>
        (await isProbablyEsops2(params))
          ? await esops2(params)
          : await esops1(params)
    )(params)
    .catch(log.crash)

export default esops
