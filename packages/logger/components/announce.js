import boxen from 'boxen'
import log from 'loglevel'
import wrapAnsi from 'wrap-ansi'

export const announce = (string, opts, type = 'info') => {
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
