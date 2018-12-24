import * as path from 'path'
import {is, isNil} from 'ramda'

import fs from '../drivers/fs'
import log from '../drivers/console'
import {ResolverOptions} from '../core/types'
import {StackConfig, InvalidOptsError, ConfigNotFound} from '../messages'

const renderConfigNotFound = () => {
  throw new Error(ConfigNotFound())
}

const isValidOpts = opts => is(String, opts) || is(Array, opts)

export const findOpts = ({cwd, opts}: ResolverOptions): ResolverOptions => {
  if (!opts) {
    const esopsConfigPath = path.join(cwd, 'esops.json')
    const esopsConfig =
      fs.existsSync(esopsConfigPath) &&
      fs.readFileSync(esopsConfigPath, {encoding: 'utf-8'})

    if (esopsConfig) {
      try {
        opts = JSON.parse(esopsConfig)
      } catch (e) {
        throw new TypeError(InvalidOptsError())
      }
    }
  }

  if (!opts) {
    const packageJsonPath = path.join(cwd, 'package.json')
    const pkg = fs.existsSync(packageJsonPath) && fs.readPkg.sync({cwd})
    opts = pkg.esops
  }

  if (isNil(opts)) renderConfigNotFound()

  if (!isValidOpts(opts)) throw new TypeError(InvalidOptsError())

  log.md(StackConfig(opts))

  return {
    cwd,
    opts
  }
}

export default findOpts
