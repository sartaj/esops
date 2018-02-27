const config = require('./config')
const maps = config.plugins.map(require.resolve)

module.exports = maps
