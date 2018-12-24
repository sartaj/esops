import * as path from 'path'
import {is} from 'ramda'

import fs from '../drivers/fs'
import log from '../drivers/console'
import {ResolverOptions} from '../core/types'
import {StackConfig, InvalidOptsError} from '../messages'

const isValidOpts = opts => is(String, opts) || is(Array, opts)

export const findOpts = ({cwd, opts}: ResolverOptions): ResolverOptions => {
  if (!opts) {
    const esopsConfigPath = path.join(cwd, 'esops.json')
    opts =
      fs.existsSync(esopsConfigPath) &&
      JSON.parse(fs.readFileSync(esopsConfigPath, {encoding: 'utf-8'}))
  }
  if (!opts) {
    const pkg = fs.readPkg.sync({cwd})
    opts = pkg.esops
  }
  if (!opts || !isValidOpts(opts)) throw new TypeError(InvalidOptsError())

  log.md(StackConfig(opts))

  return {
    cwd,
    opts
  }
}

export default findOpts
