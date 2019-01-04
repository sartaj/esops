import * as path from 'path'
import {is, isNil, filter} from 'ramda'
import {pipe, isString} from '../utils'

import fs from '../drivers/fs'
import log from '../drivers/console'
import {
  ResolverOptions,
  GeneratorManifest,
  LocalOption,
  Path,
  Resolve,
  Options,
  Option,
  LocalWithProps,
  OptionsWithProps,
  WithProps,
  CWD
} from '../core/types'

import {
  StackConfig,
  InvalidOptsError,
  ConfigNotFound,
  CWDNotDefined
} from '../messages'

import fetchPath from '../resolver'

import * as isDirectory from 'is-directory'

const renderConfigNotFound = ({cwd}) => {
  throw new Error(ConfigNotFound({cwd}))
}

const isValidOpts = opts => is(String, opts) || is(Array, opts)

const BRAND = 'esops'
const PREFIX = `.${BRAND}-`

const TOGGLE_FILES = [
  `${PREFIX}git-include`,
  `${PREFIX}npm-include`,
  `${PREFIX}merge`,
  `${PREFIX}template`,
  `.${BRAND}/${PREFIX}git-include`,
  `.${BRAND}/${PREFIX}npm-include`,
  `.${BRAND}/${PREFIX}merge`,
  `.${BRAND}/${PREFIX}template`
]

const toggleReducer = (toggles, togglePath) => {
  const file = fs.readFileSync(togglePath, 'utf-8').split('\n')
  const name = path.basename(togglePath).replace(PREFIX, '')
  return {
    ...toggles,
    [name]: file
  }
}

const getFiles = pipe(
  // Get an array of all paths in a folders
  fs.listTreeSync,
  // For now, only files are supported
  // TODO: Explore need/use case for folder path support
  filter(filePath => !isDirectory.sync(filePath)),
  // TODO: Explore need/use case for allowing esops toggle files to be copies
  filter((filePath: string) => !TOGGLE_FILES.includes(path.basename(filePath)))
)

const getStackFilePaths = (templatePath: Path): Path[] => {
  const paths = fs.listTreeSync(templatePath)
  // For now, only files are supported
  // TODO: Explore need/use case for folder path support
  const filePaths = paths.filter(filePath => !isDirectory.sync(filePath))
  return filePaths
}

const parseToggles = async parsePath =>
  TOGGLE_FILES.map(file => path.join(parsePath, file))
    .filter(fs.existsSync)
    .reduce(toggleReducer, {})

export const parsedToGeneratorManifest = (opts, {cwd}): GeneratorManifest => {
  const manifest = opts
    .map((opt: LocalOption) => ({
      stackPath: opt[0],
      opts: opt[1],
      paths: getStackFilePaths(opt[0])
    }))
    .reduce(
      (manifest, optWithPaths): GeneratorManifest => [
        ...manifest,
        ...optWithPaths.paths.map(fromPath => {
          const relativePath = path.relative(optWithPaths.stackPath, fromPath)
          const toPath = path.join(cwd, relativePath)
          const fileExists = fs.existsSync(toPath)

          return {
            cwd,
            stackPath: optWithPaths.stackPath,
            relativePath,
            fromPath,
            toFolder: path.dirname(toPath),
            toPath,
            fileExists,
            opts: optWithPaths.opts
          }
        })
      ],
      []
    )

  return manifest
}

export const parseDirectory = async ({
  cwd,
  opts
}: ResolverOptions): Promise<ResolverOptions> => {
  if (!cwd) throw new TypeError(CWDNotDefined())

  if (!opts) {
    const esopsConfigPath = path.join(cwd, 'esops.json')
    const esopsConfig =
      fs.existsSync(esopsConfigPath) &&
      fs.readFileSync(esopsConfigPath, {encoding: 'utf-8'})

    if (esopsConfig) {
      try {
        opts = JSON.parse(esopsConfig)
      } catch (e) {
        throw new TypeError(InvalidOptsError())
      }
    }
  }

  if (!opts) {
    const packageJsonPath = path.join(cwd, 'package.json')
    const pkg = fs.existsSync(packageJsonPath) && fs.readPkg.sync({cwd})
    opts = pkg.esops
  }

  if (isNil(opts)) renderConfigNotFound({cwd})

  if (!isValidOpts(opts)) throw new TypeError(InvalidOptsError())

  const toggles = await parseToggles(cwd)

  const files = await getFiles(cwd)

  log.md(StackConfig(opts))

  return {
    cwd,
    toggles,
    files,
    opts
  }
}

const createDefaultOpt = (path: string): WithProps => [path, {}]

type OptionPromises = Promise<LocalWithProps>

const createOptionPromise = (cwd: CWD, opt: WithProps): OptionPromises =>
  new Promise((resolve, reject) => {
    const path = opt[0]
    const props = opt[1]
    fetchPath(path, cwd)
      .then(path => {
        resolve([path, props])
      })
      .catch(reject)
  })

const defaultConfig = {
  cwd: process.cwd()
}

const convertAllOptionsToHaveProps = (opts: Options): OptionsWithProps =>
  isString(opts)
    ? [createDefaultOpt(opts)]
    : opts.map((opt: Option) => (isString(opt) ? createDefaultOpt(opt) : opt))

const throwError = e => {
  throw e
}

export const resolve: Resolve = (opts, {cwd} = defaultConfig) =>
  pipe(
    convertAllOptionsToHaveProps,
    opts => opts.map(opt => createOptionPromise(cwd, opt).catch(throwError)),
    opts => Promise.all(opts).catch(throwError)
  )(opts).catch(throwError)
