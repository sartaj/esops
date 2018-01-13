require('@esops/language-babel/node')

const compiler = require('./src').default

// eslint-disable-next-line
module.exports = async opts => compiler(opts)

if (require.main === module) {
  compiler()
}
