const path = require('path')

const core = require('@esops/target-react-native-web/lib/webpack/core')
const devtools = require('@esops/target-react-native-web/lib/webpack/devtools')
const javascript = require('@esops/target-react-native-web/lib/webpack/javascript')
const typescript = require('@esops/target-react-native-web/lib/webpack/typescript')
const assets = require('@esops/target-react-native-web/lib/webpack/assets')
const html = require('@esops/target-react-native-web/lib/webpack/html')

const { paths } = require('@esops/logger')

// const DEFAULT_LOGO_PATH = path.join(__dirname, '../template/icon.png')
const DEFAULT_HTML_PATH = path.join(__dirname, './template/index.html')

const defaultWebpackOpts = {
  entry: 'src/index.js',
  buildDir: './.esops/target/desktop/dist',
  indexHtmlPath: DEFAULT_HTML_PATH
}

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

/**
 * Generates webpack config from preferences
 */
// eslint-disable-next-line
module.exports = ({ cwd, devMode }) => {
  /*eslint-disable*/
  process.env.BABEL_ENV = devMode
  process.env.NODE_ENV = devMode
  /*eslint-enable*/

  const { indexHtmlPath, buildDir } = defaultWebpackOpts
  const entryFile = paths.findEntryFile(cwd, standardEntries)
  const entryPath = path.join(cwd, entryFile)
  const buildPath = path.join(cwd, buildDir)

  return {
    // Entry/output/resolve points
    ...core.paths({ buildPath, buildDir, entryPath }),

    target: 'electron-renderer',

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
