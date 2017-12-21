require('@esops/compiler-babel/node')

const compiler = require('./src').default

// eslint-disable-next-line
module.exports = opts => compiler(opts)

if (require.main === module) {
  compiler()
}
