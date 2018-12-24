import {pipe} from '../utils'

import {
  EsopsRun,
  ResolverOptions,
  ParserOptions,
  GeneratorManifest
} from '../core/types'

import resolveCwd from '../resolver-cwd'
import resolverStack from '../resolver-stack'
import parser from '../parser'
import generate from '../generators'

import {renderError} from '../drivers/console/components/error'

const resolveStack = async ({
  cwd,
  opts
}: ResolverOptions): Promise<ParserOptions> => ({
  cwd,
  opts: await resolverStack(opts, {cwd})
})

const parse = async ({opts, cwd}): Promise<GeneratorManifest> =>
  parser(opts, {cwd})

const crashEsops = e => {
  if (process.env.NODE_ENV !== 'test') renderError(e)
  throw e
}

export const esops: EsopsRun = params =>
  pipe(
    resolveCwd,
    resolveStack,
    parse,
    generate
  )(params).catch(crashEsops)

export default esops
