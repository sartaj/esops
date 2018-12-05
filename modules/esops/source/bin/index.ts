const run = require('../run')
const readPkg = require('read-pkg')
module.exports = () => {
  const cwd = process.cwd()
  const {esops} = readPkg.sync(cwd)
  run(cwd, esops)
}
