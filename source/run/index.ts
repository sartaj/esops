import {pipe} from '../utils'

import {
  EsopsRun,
  ResolverOptions,
  ParserOptions,
  GeneratorManifest
} from '../core/types'

import findOpts from '../opt-finder'
import resolver from '../resolver'
import parser from '../parser'
import generate from '../generators'

const resolve = async ({
  cwd,
  opts
}: ResolverOptions): Promise<ParserOptions> => ({
  cwd,
  opts: await resolver(opts, {cwd})
})

const parse = async ({opts, cwd}): Promise<GeneratorManifest> =>
  parser(opts, {cwd})

export const esops: EsopsRun = pipe(
  findOpts,
  resolve,
  parse,
  generate
)

export default esops
