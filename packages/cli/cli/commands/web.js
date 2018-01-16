const path = require('path')
const target = require('@esops/target-react-native-web')
const publishGHPages = require('@esops/publish-github-pages')
const log = require('@esops/logger').default

const runWebStatic = async context => {
  const { parameters, cwd } = context

  const distribution = {
    devMode: false,
    buildPath: path.join(cwd, './.esops/target/web/dist')
  }

  switch (parameters.second) {
    case 'dev':
      await target({ devMode: true, cwd })
      break
    case 'build':
      await target(distribution)
      break
    case 'ship':
      // return ship({
      //   manager: preferences.ship.manager,
      //   target,
      //   tests: preferences.tests,
      //   docs: preferences.docs,
      //   ci: preferences.ship.ci,
      //   stage: preferences.ship.stage,
      //   destination: preferences.ship.destination
      // })

      await target(distribution)
      const published = await publishGHPages({ ...context, ...distribution })
      log.announce(`Your static app has bee successfully deployed.
${published.url}`)
      break
    case 'help':
    default:
      log.announce(
        'For `esops web static`, available commands are `dev` and `ship`.'
      )
  }
}
// eslint-disable-next-line
module.exports = {
  name: 'web',
  run: async context => {
    const { parameters } = context

    switch (parameters.first) {
      case 'static':
        runWebStatic(context)
        break
      default:
        log.announce(
          'For `esops web`, available commands are `static web` and `static ship`.'
        )
    }
  }
}
