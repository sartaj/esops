const boxen = require('boxen')
const log = require('loglevel')
const wrapAnsi = require('wrap-ansi')

module.exports.announce = (string, opts, type = 'info') => {
  log[type](
    boxen(wrapAnsi(string, 80), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      float: 'center',
      align: 'center',
      ...opts
    })
  )
}
