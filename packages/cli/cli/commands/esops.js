const compile = require('@esops/compiler-react-native-web');

// eslint-disable-next-line
module.exports = {
  alias: ['help', 'h'],
  run: async (context) => {
    const { parameters, cwd, print } = context
    print.info('welcome to esops')
  }
}
