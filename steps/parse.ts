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
import generate from '../steps/generate'
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
import {convertAllOptionsToHaveProps, isValidOpts} from '../core/helpers'
import async from '../helpers/async'
import {filter, throwError, isString} from '../helpers/sync'
import log from '../side-effects/console'
import fs from '../side-effects/fs'
import resolver from '../side-effects/fs/resolver'

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
 * ### findEsopsConfig
 * Read and parse esops config file from `esops.json` or `package.json`.
 */
const findEsopsConfig = directory => {
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

  const stack = findEsopsConfig(directory)

  const toggles = await parseToggles(directory)

  const files = await listFileTreeSync(directory)

  if (isNil(stack)) renderConfigNotFound({cwd: directory})

  if (!isValidOpts(stack)) throw new TypeError(InvalidOptsError())

  log.md(StackConfig(stack))

  return {
    directory,
    cwd: directory,
    toggles,
    files,
    opts: stack,
    stack,
    destination: directory,
    compose: stack
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
export const parseStackDir = ({destinationDir, rootStackDir}) => ({
  destinationDir,
  rootStackDir: rootStackDir || destinationDir
})

// Verify stack directory and destination directory

export const resolveEsopsConfig = async.extend(async ({cwd}) => {
  const [err, parsed] = await async.result(parseWorkingDirectory([cwd, {}]))
  if (err) throw new TypeError(InvalidOptsError())
  const {stack} = parsed
  if (isNil(stack)) renderConfigNotFound({cwd})
  if (!isValidOpts(stack)) throw new TypeError(InvalidOptsError())
  return {parsed}
})

const resolveStack = async.extend(async ({parsed: {cwd, opts = []}}) => ({
  cwd,
  opts: await resolve(opts, {cwd})
}))

export const parsedToManifest = async ({
  opts,
  cwd
}): Promise<GeneratorManifest> => parsedToGeneratorManifest(opts, {cwd})

export const normalizeUserInputedInfrastructureDefinition = infrastructure => [
  infrastructure
] // TODO: Allow alternative inputs for infrastructure

export const esops2 = async.extend(async params => {
  const {cwd, destination, commands} = params
  const result = await async.result(resolveEsopsConfig({cwd}), true)

  const series = normalizeUserInputedInfrastructureDefinition(
    result.parsed.compose
  )

  const parallelSeries = series.map(parallel => {
    const resolveParallelComponents = parallel.map(component => {
      return async function resolveComponent() {
        const sanitizedComponent = isString(component) ? [component] : component
        const url = sanitizedComponent[0]
        const variables = sanitizedComponent[1]
        const options = sanitizedComponent[2]
        const [errorResolving, resolvedPath] = await async.result(
          await resolver(url, {cwd})
        )
        const esopsConfig = await async.result(
          findEsopsConfig(resolvedPath),
          true
        )
        if (esopsConfig && esopsConfig.compose) {
          await async.result(esops2({...params, cwd: resolvedPath}), true)
        }
        // const result = async.result(await render())
      }
    })
    return async function resolveSeries() {
      const [] = await async.parallel(resolveParallelComponents)
    }
  })

  await new Promise((resolve, reject) => {
    async.series(parallelSeries, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  }).catch(throwError)
})

export const esops1 = async.pipe(
  resolveEsopsConfig,
  resolveStack,
  parsedToManifest,
  generate
)

export const parse = async params => {
  const {cwd} = params
  const result = await async.result(resolveEsopsConfig({cwd}), true)

  // Short Circuit if previous version of esops
  const firstUrl = isString(result.parsed.compose)
    ? result.parsed.compose
    : result.parsed.compose[0]

  if (
    firstUrl.startsWith('node:') ||
    firstUrl.startsWith('.') ||
    firstUrl.startsWith('/')
  ) {
    return esops1(params)
  } else {
    await esops2(params)
  }
}
export default parse
