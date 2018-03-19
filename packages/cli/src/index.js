import log, { intercept } from '@esops/logger'
import path from 'path'

import requireLazy from './require-lazy'

// const targetWeb = require('@esops/target-react-native-web').default
// const targetDesktop = require('@esops/target-react-native-electron')
// const publishGHPages = require('@esops/publish-github-pages')

const webDevBox = publicPath =>
  `🌎  Your static web dev environment is live! 🌎
${publicPath}
Please open this link in your browser 
to begin initial build.`

const desktopDevBox = publicPath =>
  `🌎  Your desktop dev environment is loading... 🌎`
/**
 * Create the cli and kick it off
 */
async function run(argv) {
  const statement = argv.join(' ')
  const cwd = process.cwd()

  // Begin log intercept
  intercept.init()

  let url
  let target
  switch (statement) {
    case 'dev web':
    case 'web dev':
    case 'dev github-pages':
    case 'github-pages dev':
      target = await requireLazy('@esops/target-react-native-web', {
        cwd,
        dev: true
      })
      url = await target.default({ devMode: true, cwd })
      log.announce(webDevBox(url))
      break
    case 'dev desktop':
    case 'desktop dev':
    case 'dev electron':
    case 'electron dev':
      const targetDesktop = await requireLazy(
        '@esops/target-react-native-desktop',
        { cwd, dev: true }
      )
      url = await targetDesktop({ devMode: true, cwd })
      log.announce(desktopDevBox(url))
      break
    case 'ship':
    case 'ship github-pages':
      const distribution = {
        devMode: false,
        buildPath: path.join(cwd, './.esops/target/web/dist')
      }
      target = await requireLazy('@esops/target-react-native-web')
      await target.default(distribution)
      // await publishGHPages({ cwd, ...distribution })
      break
    case 'help':
    case undefined:
      await log.mdFile(path.join(__dirname, '../../docs/welcome.md'))
      break
    default:
      log.md('For `esops`, available commands are `dev, ship, & help`.')
  }
}

// eslint-disable-next-line
module.exports = run
