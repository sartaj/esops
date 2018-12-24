import * as path from 'path'
import fs from '../drivers/fs'
import log from '../drivers/console'
import {ResolverOptions} from '../core/types'

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

  log.md(`# Stack Configuration
  ${typeof opts === 'string' ? opts : JSON.stringify(opts, null, 2)}`)

  return {
    cwd,
    opts
  }
}

export default findOpts
