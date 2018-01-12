const path = require('path')
const target = require('@esops/target-react-native-web')
const publishGHPages = require('@esops/publish-github-pages')

// eslint-disable-next-line
module.exports = {
  name: 'static',
  run: async context => {
    const { parameters, cwd, ship, preferences } = context
    const distribution = {
      devMode: false,
      buildPath: path.join(cwd, './.esops/target/web/dist')
    }
    switch (parameters.first) {
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
        console.log(`
      // ==============
      // Your static app has bee successfully deployed.
      // ${published.url}
      // ==============
      // `)
        break
      case 'help':
      default:
        console.log('for esops web static, available commands are help and web')
    }
  }
}
