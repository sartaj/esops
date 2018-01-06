// const path = require('path')
const target = require('@esops/target-react-native-web')

// eslint-disable-next-line
module.exports = {
  name: 'static',
  run: async context => {
    const { parameters, cwd, ship, preferences } = context
    switch (parameters.first) {
      case 'dev':
        await target({ devMode: true, cwd })
        break
      case 'ship':
        // const distribution = {
        //   devMode: false,
        //   buildPath: path.join(cwd, './.esops/target/web/dist')
        // }
        return ship({
          manager: preferences.ship.manager,
          target,
          tests: preferences.tests,
          docs: preferences.docs,
          ci: preferences.ship.ci,
          stage: preferences.ship.stage,
          destination: preferences.ship.destination
        })

      //         await compile(distribution)
      //         const published = await publishGHPages({...context, ...distribution})
      //         console.log(`

      // ==============
      // Your static app has bee successfully deployed.
      // ${published.url}
      // ==============
      // `)
      case 'help':
      default:
        console.log('for esops web static, available commands are help and web')
    }
  }
}
