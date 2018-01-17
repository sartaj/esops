const { build } = require('gluegun')
const log = require('@esops/logger')
// const path = require('path')

/**
 * Create the cli and kick it off
 */
async function run(argv) {
  // Begin log intercept
  log.main.init()

  // process.nextTick due to bug in prettyError when manually rendering
  // source: https://github.com/AriaMinaei/pretty-error#troubleshooting
  process.nextTick(async function() {
    const cli = build()
      .brand('esops')
      .src(`${__dirname}`)
      // .plugins(path.join(__dirname, './plugins'))
      .create()

    // and run it
    const context = await cli.run(argv)

    // send it back (for testing, mostly)
    return context
  })
}

// eslint-disable-next-line
module.exports = run
