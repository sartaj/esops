const compile = require('@esops/compiler-react-native-web');

// eslint-disable-next-line
module.exports = {
  name: 'static',
  run: async (context) => {
    const { parameters, cwd } = context

    switch (parameters.first) {
      case 'dev':
        await compile({ devMode: true, cwd })
        break
      case 'ship':
        await compile({ devMode: false, cwd })
        break
      case 'help':
      default:
        console.log('for esops web static, available commands are help and web')
    }
  }
}
