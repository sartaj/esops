const run = require('../run')
const fs = require('../drivers/fs')

export default () => {
  const cwd = process.cwd()
  const {esops} = fs.readPkg.sync(cwd)
  run(cwd, esops)
}
