const boxen = require('boxen')
const log = require('loglevel')
const wrapAnsi = require('wrap-ansi')

export const announce = (string, opts, type = 'info') => {
  log[type](
    boxen(wrapAnsi(string, 80), {
      borderStyle: 'round',
      align: 'left',
      float: 'left',
      margin: 1,
      padding: 1,
      ...opts
    })
  )
}
