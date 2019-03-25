/**
 * Main Usage
 */

import {Run} from '../core/types'
import async from '../helpers/async'
import {isString} from '../helpers/sync'
import {extend} from '../helpers/sync'
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
const getLogLevel = logLevel =>
  logLevel ? logLevel : process.env.NODE_ENV === 'test' ? 'error' : 'info'

const withCommands = extend(({logLevel}) => ({
  commands: {
    tempDir: temporaryDirectory(),
    filesystem: fs,
    ui: {
      ...log,
      ...log.createLogDriver({
        level: getLogLevel(logLevel),
        format: (level, ...args) => args.join(' ')
      })
    },
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
      withCommands,
      async params =>
        (await isProbablyEsops2(params))
          ? await esops2(params)
          : await esops1(params)
    )(params)
    .catch(log.crash)

export default esops
