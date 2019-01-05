import * as isDirectory from 'is-directory'
import * as path from 'path'
import {is, isNil, pipe} from 'ramda'

import {PREFIX, TOGGLE_FILES} from '../core/constants'
import {
  CWD,
  GeneratorManifest,
  LocalStack,
  LocalWithProps,
  Option,
  Options,
  OptionsWithProps,
  ParserOptions,
  Resolve,
  ParsedStack,
  WithProps
} from '../core/types'
import log from '../drivers/console'
import fs from '../drivers/fs'
import {
  ConfigNotFound,
  CWDNotDefined,
  InvalidOptsError,
  StackConfig
} from '../messages'
import resolver from '../resolver'
import {isString, pipe as asyncPipe, throwError, filter} from '../utils'

const renderConfigNotFound = ({cwd}) => {
  throw new Error(ConfigNotFound({cwd}))
}

const isValidOpts = opts => is(String, opts) || is(Array, opts)

const toggleReducer = (toggles, togglePath) => {
  const file = fs.readFileSync(togglePath, 'utf-8').split('\n')
  const name = path.basename(togglePath).replace(PREFIX, '')
  return {
    ...toggles,
    [name]: file
  }
}

type GetFiles = (cwd: string) => string[]
const getFiles: GetFiles = pipe(
  // Get an array of all paths in a folders
  fs.listTreeSync,
  // For now, only files are supported
  // TODO: Explore need/use case for folder path support
  filter(filePath => !isDirectory.sync(filePath)),
  // TODO: Explore need/use case for allowing esops toggle files to be copies
  filter((filePath: string) => !TOGGLE_FILES.includes(path.basename(filePath)))
)

type Toggles = {
  merge: string[]
}
const parseToggles = async (parsePath): Promise<Toggles> =>
  TOGGLE_FILES.map(file => path.join(parsePath, file))
    .filter(fs.existsSync)
    .reduce(toggleReducer, {})

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

export const parseCwd = async ({cwd}) => {
  const parsed = await parseStack([cwd, {}])
  const {stack} = parsed
  if (isNil(stack)) renderConfigNotFound({cwd})
  if (!isValidOpts(stack)) throw new TypeError(InvalidOptsError())
  log.md(StackConfig(stack))
  return parsed
}

export const parseStack = async ([directory, props]: LocalWithProps): Promise<
  ParsedStack
> => {
  if (!directory) throw new TypeError(CWDNotDefined())

  const stack = findStackConfig(directory)

  const toggles = await parseToggles(directory)

  const files = await getFiles(directory)

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

const createDefaultOpt = (path: string): WithProps => [path, {}]

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

const convertAllOptionsToHaveProps = (opts: Options): OptionsWithProps =>
  isString(opts)
    ? [createDefaultOpt(opts)]
    : opts.map((opt: Option) => (isString(opt) ? createDefaultOpt(opt) : opt))

const defaultConfig = {
  cwd: process.cwd()
}

export const resolve: Resolve = (opts, {cwd} = defaultConfig) =>
  asyncPipe(
    convertAllOptionsToHaveProps,
    opts => opts.map(opt => createOptionPromise(cwd, opt).catch(throwError)),
    opts => Promise.all(opts).catch(throwError)
  )(opts).catch(throwError)

export const parsedToGeneratorManifest = (stacks, {cwd}): GeneratorManifest => {
  const manifest = stacks
    .map((stack: LocalStack) => ({
      directory: stack[0],
      props: stack[1],
      paths: getFiles(stack[0])
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

// const parsedStack = [{
//   stack: []
// }]

// const walk = async ({cwd, context}) => {
//   const parsed = await resolver({cwd, context})
//   const result = [...context, parsed]
//   return parsed.stack
//     ? walk({cwd: parsed.cwd, context: result})
//     : result
// }

export const parsedToManifest = async ({
  opts,
  cwd
}): Promise<GeneratorManifest> => parsedToGeneratorManifest(opts, {cwd})

const resolveStack = async ({
  cwd,
  opts = []
}: ParsedStack): Promise<ParserOptions> => ({
  cwd,
  opts: await resolve(opts, {cwd})
})

export const parse = asyncPipe(parseCwd, resolveStack, parsedToManifest)

const run = async ({cwd, stack}) => {
  // const context = [cwd, props]
  // const parsedStack = await walk({cwd, context: stack})
  // const
  // const walk = ({ cwd, stack })
  // if(stack) parsed.stack = stack
}

export default parse
