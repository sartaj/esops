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
