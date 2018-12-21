import {pipe} from '../utils'
import {
  EsopsRun,
  ResolverOptions,
  ParserOptions,
  GeneratorManifest
} from '../core/types'
import resolver from '../resolver'
import parser from '../parser'
import generate from '../generators'
import fs from '../drivers/fs'
import log from '../drivers/console'

const resolve = async ({
  cwd,
  opts
}: ResolverOptions): Promise<ParserOptions> => ({
  cwd,
  opts: await resolver(opts, {cwd})
})

const parse = async ({opts, cwd}): Promise<GeneratorManifest> =>
  parser(opts, {cwd})

export const findOpts = ({cwd}: ResolverOptions): ResolverOptions => {
  const pkg = fs.readPkg.sync({cwd})
  const opts = pkg.esops
  log.md(`# Stack Configuration
  ${typeof opts === 'string' ? opts : JSON.stringify(opts, null, 2)}`)
  return {
    cwd,
    opts
  }
}

export const esops: EsopsRun = pipe(
  findOpts,
  resolve,
  parse,
  generate
)

export default esops
