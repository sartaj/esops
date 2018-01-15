// eslint-disable-next-line
const path = require('path')

module.exports = {
  alias: ['help', 'h'],
  run: async context => {
    const { log } = context
    await log.mdFile(path.join(__dirname, '../../docs/welcome.md'))
  }
}
