import path from 'path'

import { paths } from '@esops/logger'

import * as core from './webpack/core'
import * as devtools from './webpack/devtools'
import * as javascript from './webpack/javascript'
import * as typescript from './webpack/typescript'
// import * as css from './webpack/css'
import * as assets from './webpack/assets'
import * as html from './webpack/html'

// const DEFAULT_LOGO_PATH = path.join(__dirname, '../template/icon.png')
const DEFAULT_HTML_PATH = path.join(__dirname, '../template/index.html')

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

const defaultWebpackOpts = {
  entry: 'src/index.js',
  buildDir: './.esops/target/web/dist',
  indexHtmlPath: DEFAULT_HTML_PATH
}

/**
 * Generates webpack config from preferences
 */
export default ({ cwd, devMode }) => {
  /*eslint-disable*/
  process.env.BABEL_ENV = devMode
  process.env.NODE_ENV = devMode
  /*eslint-enable*/

  const { indexHtmlPath, buildDir } = defaultWebpackOpts
  const entryFile = paths.findEntryFile(cwd, standardEntries)
  const entryPath = path.join(cwd, entryFile)
  const buildPath = path.join(cwd, buildDir)

  return {
    mode: devMode,
    cache: devMode,

    // Entry/output/resolve points
    ...core.paths({ buildPath, buildDir, entryPath }),
    // Rules for different file types
    // module: { rules: utils.convertObjectToArray(rules) },
    module: {
      rules: [
        {
          oneOf: [
            assets.urls,
            javascript.rules,
            typescript.rules,
            assets.files // Defined last to be a catch all for if above files fail
            // WARNING: Don't add rules below assets.files. Add above.
          ]
        }
      ]
    },
    // Plugins to do extra things to the package
    plugins: [
      ...core.plugins({ cwd, buildPath, chunk: true }),
      ...html.plugins({ indexHtmlPath }),
      ...(devMode ? devtools.plugins({ cwd, buildDir }) : [])
    ]
  }
}
