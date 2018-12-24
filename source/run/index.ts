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

import log from '../drivers/console'

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
  if (process.env.NODE_ENV === 'test') throw e
  log.renderError(e)
  if (!process.env.RUN_CONSOLE_TEST) process.exit(1)
}

export const esops: EsopsRun = params =>
  pipe(
    resolveCwd,
    resolveStack,
    parse,
    generate
  )(params).catch(crashEsops)

export default esops
