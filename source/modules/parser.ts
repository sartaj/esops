/**
 * # Parser
 *
 * The parser takes data from either an argument or Node `process` methods,
 * and creates a `GeneratorManifest` that can be consumed by the esops `generator`.
 *
 * ## Concerns
 *
 * - Parse `cwd`.
 * - Find esops related configs within `cwd`.
 * - Resolve stacks found within configs.
 * - Parse configs and list files inside each stack.
 * - Create `GeneratorManifest` by merging configs in `cwd` and each stack.
 */
import * as isDirectory from 'is-directory'
import * as path from 'path'
import {isNil, pipe} from 'ramda'

import {PREFIX, TOGGLE_FILES} from '../core/constants'
import {
  ConfigNotFound,
  CWDNotDefined,
  InvalidOptsError,
  StackConfig
} from '../core/messages'
import {
  CWD,
  GeneratorManifest,
  LocalStack,
  LocalWithProps,
  ParsedStack,
  ParserOptions,
  Resolve,
  Toggles,
  WithProps
} from '../core/types'
import {convertAllOptionsToHaveProps, isValidOpts} from '../core/utils'
import log from '../drivers/console'
import fs from '../drivers/fs'
import * as async from '../utils/async'
import resolver from '../utils/resolver'
import {filter, throwError} from '../utils/sync'

/**
 * ## Utils
 */
const renderConfigNotFound = ({cwd}) => {
  throw new Error(ConfigNotFound({cwd}))
}

/**
 * ## Resolver
 */
type OptionPromises = Promise<LocalWithProps>
const createOptionPromise = (cwd: CWD, opt: WithProps): OptionPromises =>
  new Promise((resolve, reject) => {
    const path = opt[0]
    const props = opt[1]
    resolver(path, {cwd})
      .then(path => {
        resolve([path, props])
      })
      .catch(reject)
  })

const defaultResolveConfig = {
  cwd: process.cwd()
}

export const resolve: Resolve = (opts, {cwd} = defaultResolveConfig) =>
  async
    .pipe(
      convertAllOptionsToHaveProps,
      opts => opts.map(opt => createOptionPromise(cwd, opt).catch(throwError)),
      opts => Promise.all(opts).catch(throwError)
    )(opts)
    .catch(throwError)

/**
 * ## FS & Config Parsers
 */

/**
 * ### listFileTreeSync
 * Get a list of files that ignore directories and toggle files
 *
 * TODO: Explore need/use case for folder path support.
 * TODO: Explore need/use case for allowing esops toggle files to be copies.
 */
type ListFiles = (cwd: string) => string[]
const listFileTreeSync: ListFiles = pipe(
  fs.listTreeSync,
  filter(filePath => !isDirectory.sync(filePath)),
  filter((filePath: string) => !TOGGLE_FILES.includes(path.basename(filePath)))
)

/**
 * ### parseToggles
 * Read and parse esops toggle files as an Toggles Object.
 */
const parseToggles = async (parsePath): Promise<Toggles> =>
  TOGGLE_FILES.map(file => path.join(parsePath, file))
    .filter(fs.existsSync)
    .reduce((toggles, togglePath) => {
      const file = fs.readFileSync(togglePath, 'utf-8').split('\n')
      const name = path.basename(togglePath).replace(PREFIX, '')
      return {
        ...toggles,
        [name]: file
      }
    }, {})

/**
 * ### findStackConfig
 * Read and parse esops config file from `esops.json` or `package.json`.
 */
const findStackConfig = directory => {
  let stack = undefined

  if (!stack) {
    const esopsConfigPath = path.join(directory, 'esops.json')
    const esopsConfig =
      fs.existsSync(esopsConfigPath) &&
      fs.readFileSync(esopsConfigPath, {encoding: 'utf-8'})

    if (esopsConfig) {
      try {
        stack = JSON.parse(esopsConfig)
      } catch (e) {
        throw new TypeError(InvalidOptsError())
      }
    }
  }

  if (!stack) {
    const packageJsonPath = path.join(directory, 'package.json')
    const pkg =
      fs.existsSync(packageJsonPath) && fs.readPkg.sync({cwd: directory})
    stack = pkg.esops
  }

  return stack
}

/**
 * ### parseWorkingDirectory
 * Read and parse esops config file from `esops.json` or `package.json`.
 */
export const parseWorkingDirectory = async ([
  directory,
  props
]: LocalWithProps): Promise<ParsedStack> => {
  if (!directory) throw new TypeError(CWDNotDefined())

  const stack = findStackConfig(directory)

  const toggles = await parseToggles(directory)

  const files = await listFileTreeSync(directory)

  if (isNil(stack)) renderConfigNotFound({cwd: directory})

  if (!isValidOpts(stack)) throw new TypeError(InvalidOptsError())

  log.md(StackConfig(stack))

  return {
    cwd: directory,
    toggles,
    files,
    opts: stack,
    stack
  }
}

/**
 * ## Create Generator Manifest
 */
export const parsedToGeneratorManifest = (stacks, {cwd}): GeneratorManifest => {
  const manifest = stacks
    .map((stack: LocalStack) => ({
      directory: stack[0],
      props: stack[1],
      paths: listFileTreeSync(stack[0])
    }))
    .reduce(
      (manifest, optWithPaths): GeneratorManifest => [
        ...manifest,
        ...optWithPaths.paths.map(fromPath => {
          const relativePath = path.relative(optWithPaths.directory, fromPath)
          const toPath = path.join(cwd, relativePath)
          const fileExists = fs.existsSync(toPath)

          return {
            cwd,
            stackPath: optWithPaths.directory,
            relativePath,
            fromPath,
            toFolder: path.dirname(toPath),
            toPath,
            fileExists,
            props: optWithPaths.props
          }
        })
      ],
      []
    )

  return manifest
}

/**
 * ## Parse Runners
 */
export const parseCwd = async ({cwd}) => {
  const parsed = await parseWorkingDirectory([cwd, {}])
  const {stack} = parsed
  if (isNil(stack)) renderConfigNotFound({cwd})
  if (!isValidOpts(stack)) throw new TypeError(InvalidOptsError())
  log.md(StackConfig(stack))
  return parsed
}

const resolveStack = async ({
  cwd,
  opts = []
}: ParsedStack): Promise<ParserOptions> => ({
  cwd,
  opts: await resolve(opts, {cwd})
})

export const parsedToManifest = async ({
  opts,
  cwd
}): Promise<GeneratorManifest> => parsedToGeneratorManifest(opts, {cwd})

/**
 * ## Compose It All Together 🙌🏽
 */
export const parse = async.pipe(
  parseCwd,
  resolveStack,
  parsedToManifest
)

export default parse
