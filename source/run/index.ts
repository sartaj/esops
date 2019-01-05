import {pipe, is} from '../utils'

import {
  EsopsRun,
  ParsedStack,
  ParserOptions,
  GeneratorManifest
} from '../core/types'

import {
  parseStack,
  parsedToGeneratorManifest,
  resolve as resolverStack
} from '../parser'
import generate from '../generators'

import log from '../drivers/console'

const resolveStack = async ({
  cwd,
  opts = []
}: ParsedStack): Promise<ParserOptions> => ({
  cwd,
  opts: await resolverStack(opts, {cwd})
})

const parse = async ({opts, cwd}): Promise<GeneratorManifest> =>
  parsedToGeneratorManifest(opts, {cwd})

const crashEsops = e => {
  if (is(Object, e) || is(String, e)) {
    if (process.env.NODE_ENV === 'test') throw e
    log.renderError(e)
    if (process.env.RUN_CONSOLE_TEST !== '1') process.exit(1)
  }
}

const parseAndResolve = async (cwd, props) => {
  // const cwdParsed = await parseDirectory({cwd, props})
  // const resolved = await resolveStack(cwdParsed)
  // const parsed = resolved.map(([cwd, props]) => parseDirectory({cwd, props}))
}
const parseCwd = ({cwd}) => parseStack({cwd})

export const esops: EsopsRun = params =>
  pipe(
    parseCwd,
    resolveStack,
    parse,
    generate
  )(params).catch(crashEsops)

export default esops
