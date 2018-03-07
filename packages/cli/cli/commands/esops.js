// eslint-disable-next-line

const path = require('path')
const target = require('@esops/target-react-native-web').default
// const publishGHPages = require('@esops/publish-github-pages')
const log = require('@esops/logger')

const messages = require('../messages')

const devStaticGithub = async context => {
  const { parameters, cwd } = context

  switch (parameters.second) {
    case 'web':
    case 'browser':
    case 'github-pages':
      await target({ devMode: true, cwd })
      break
    case 'help':
    default:
      log.md(messages.webAvailableCommands)
  }
}

const shipStaticGithub = async context => {
  const { parameters, cwd } = context

  const distribution = {
    devMode: false,
    buildPath: path.join(cwd, './.esops/target/web/dist')
  }

  switch (parameters.second) {
    case 'web':
    case 'browser':
    case 'github-pages':
      await target(distribution)
      await publishGHPages({ ...context, ...distribution })
      break
    case 'help':
    default:
      log.md('For `esops ship`, available commands are `github-pages`.')
  }
}

// eslint-disable-next-line
module.exports = {
  run: async context => {
    const { parameters } = context

    switch (parameters.first) {
      case 'dev':
        devStaticGithub(context)
        break
      case 'ship':
        shipStaticGithub(context)
        break
      case 'help':
      case undefined:
        await log.mdFile(path.join(__dirname, '../../docs/welcome.md'))
        break
      default:
        log.md('For `esops`, available commands are `dev, ship, & help`.')
    }
  }
}
