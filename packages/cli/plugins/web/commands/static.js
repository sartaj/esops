const path = require('path')

const compile = require('@esops/target-react-native-web')
const publishGHPages = require('@esops/publish-github-pages')

// eslint-disable-next-line
module.exports = {
  name: 'static',
  run: async (context) => {
    const { parameters, cwd, system, git } = context
    switch (parameters.first) {
      case 'dev':
        await compile({ devMode: true, cwd })
        break
      case 'ship':
        const distribution = {
          devMode: false,
          buildPath: path.join(cwd, './.esops/target/web/dist'),
        }
        await compile(distribution)
        const published = await publishGHPages({...context, ...distribution})
        console.log(`

==============
Your static app has bee successfully deployed.
${published.url}
==============
`)
        break
      case 'help':
      default:
        console.log('for esops web static, available commands are help and web')
    }
  }
}
