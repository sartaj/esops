// eslint-disable-next-line

const path = require('path')

const lazyRequire = require('@esops/lazy-require')
// const target = require('@esops/target-react-native-web')
const publishGHPages = require('@esops/publish-github-pages')
const log = require('@esops/logger').default

// const installAssistant = ({ cwd, dependencies }) => {
//   dependencies.forEach(dependency => {
//     lazyRequire(dependency, { cwd })
//   })
// }

const devStaticGithub = async context => {
  const { parameters, cwd } = context
  // const dependencies = ['react']
  // installAssistant({ dependencies, cwd })
  switch (parameters.second) {
    case 'web':
    case 'browser':
    case 'github-pages':
      // const target =
      console.log('LAZY REQUIRE')
      lazyRequire.sync(
        '@esops/target-react-native-web',
        {
          dev: true
        },
        (err, target) => {
          if (err) console.error(err)
          console.log(target)
        }
      )
      // await target.default({ devMode: true, cwd })
      break
    case 'help':
    default:
      log.md(`For \`esops dev\`, available commands are:

## Web

* \`esops dev web\`
* \`esops dev github-pages\`

`)
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
