require('babel-register')({
  presets: ['env', 'react', 'flow'],
  plugins: ['transform-object-rest-spread', 'syntax-dynamic-import']
})

require('babel-polyfill')

const compiler = require('./src').default

// eslint-disable-next-line
module.exports = opts => compiler(opts)

if (require.main === module) {
  compiler()
}
