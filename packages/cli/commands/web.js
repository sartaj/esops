
// eslint-disable-next-line
module.exports = {
  name: 'web',
  alias: [],
  run: async (context) => {
    const { parameters, cwd, ship: { web } } = context

    switch (parameters.first) {
      case 'static':
        switch (parameters.second) {
          case 'dev':
            await web({ devMode: true, cwd })
            break
          case 'ship':
            await web({ devMode: false, cwd })
            break
          case 'help':
          default:
            console.log('for esops web static, available commands are help and web')
        }
    }
  }
}
