const { build } = require('gluegun')
const { intercept } = require('@esops/logger')
const path = require('path')

/**
 * Create the cli and kick it off
 */
async function run(argv) {
  intercept.init()

  const cli = build()
    .brand('esops')
    .src(`${__dirname}`)
    .plugins(path.join(__dirname, '../plugins'))
    .create()

  // and run it
  const context = await cli.run(argv)

  // send it back (for testing, mostly)
  return context
}

// eslint-disable-next-line
module.exports = run
