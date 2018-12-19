import {pipe} from '../utils'
import {
  EsopsRun,
  ResolverOptions,
  ParserOptions,
  GeneratorManifest
} from '../core/types'
import resolver from '../resolver'
import parser from '../parser'

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
  resolve,
  parse
  // TODO: validate,
  // generate,
)

export default esops
