/* eslint no-console: 0 */

import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import { callback } from 'awaiting'

import compilerDevelop from './compiler/develop'
import compilerBuild from './compiler/build'

import createWebpackConfig from './webpack'
import log from '@esops/logger'

const standardEntries = [
  'index.js',
  'entry.js',
  'src/index.js',
  'src/main.js',
  'src/entry.js',
  'app/index.js',
  'app/main.js',
  'app/entry.js'
]

const DEFAULT_LOGO_PATH = path.join(__dirname, '../template/icon.png')
const DEFAULT_HTML_PATH = path.join(__dirname, '../template/index.html')

const defaultOpts = {
  entry: 'src/index.js',
  devMode: false,
  distFolder: './.esops/target/web/dist',
  assetsFolder: './assets',
  logoFile: 'logo.png',
  indexHtmlPath: DEFAULT_HTML_PATH,
  cwd: process.cwd(),
  port: 8000
}

const findInArray = (array, test) =>
  array.reduce((acc, next) => (test(next) ? [...acc, next] : acc), [])

const checkConfig = async config => {
  if (!fs.existsSync(config.entryPath)) {
    console.error(
      new Error(
        `Can't locate an entry path. Attempted ${standardEntries.join(',')}`
      )
    )
    process.exit(1)
  }

  try {
    await callback(mkdirp, config.entryPath)
  } catch (err) {
    if (err && err.code !== 'EEXIST') console.error(err)
  }

  // Logging to user
  console.log(
    config.devMode
      ? 'starting dev environment...'
      : 'create production distribution...'
  )
  console.log(`Using package ${config.entryFile}`)
}

// opts expects config to be generated by `../config` file
export default async opts => {
  const optsWithDefaults = {
    ...defaultOpts,
    ...opts
  }

  const entriesFound = findInArray(standardEntries, entry =>
    fs.existsSync(path.join(optsWithDefaults.cwd, entry))
  )
  const entryFile = entriesFound[0]
  if (!entryFile) {
    log.md(`# Entry file not found.

## Acceptable entries

* \`package.json\` \`main\` property
${standardEntries
      .map(entry => `* \`${entry}\`\n`)
      .reduce((acc, next) => `${acc}${next}`, '')}
`)
    process.exit(1)
  }

  const entryPath = path.join(optsWithDefaults.cwd, entryFile)
  const buildPath = path.join(optsWithDefaults.cwd, optsWithDefaults.distFolder)
  const packageLogoPath = path.join(
    optsWithDefaults.cwd,
    optsWithDefaults.assetsFolder,
    optsWithDefaults.logoFile
  )
  const logoPath = fs.existsSync(packageLogoPath)
    ? packageLogoPath
    : DEFAULT_LOGO_PATH

  const config = {
    entryFile,
    entryPath,
    buildPath,
    logoPath,
    ...optsWithDefaults
  }

  await checkConfig(config)

  // Create webpack compiler
  const webpackConfig = createWebpackConfig(config)

  // Run server
  if (config.devMode) return compilerDevelop(config, webpackConfig)
  else return compilerBuild(webpackConfig)
}
