const { build } = require('gluegun')
const { initLogger } = require('@esops/utils-logger')

/**
 * Create the cli and kick it off
 */
async function run (argv) {
  initLogger()

  const cli = build()
    .brand('esops')
    .src(`${__dirname}`)
    .plugins('./node_modules', { matching: 'esops-*', hidden: true })
    .create()

  // and run it
  const context = await cli.run(argv)

  // send it back (for testing, mostly)
  return context
}

// eslint-disable-next-line
module.exports = run
