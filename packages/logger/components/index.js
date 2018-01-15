import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import termImg from 'term-img'
import boxen from 'boxen'
import marked from 'marked'
import TerminalRenderer from 'marked-terminal'
import loglevel from 'loglevel'
import wrapAnsi from 'wrap-ansi'

loglevel.setLevel('info')

marked.setOptions({
  renderer: new TerminalRenderer()
})

export const logo = () => chalk.blue.bold.dim(`esops`)

export const info = message => {
  loglevel.info(`${logo()} ${chalk.green(message)}`)
}

export const error = err =>
  `\n${logo()} ${chalk.red.bold('ERROR')} ${chalk.red(err.message)}`

export const header = () => logo()

export const help = () => ``

export const announce = (string, opts) =>
  boxen(wrapAnsi(string, 80), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    float: 'center',
    align: 'center',
    ...opts
  })

export const md = string => {
  loglevel.info(
    announce(marked(string), {
      align: 'left',
      float: 'center',
      margin: 2,
      padding: 2
    })
  )
}

export const mdFile = async path => {
  const str = fs.readFileSync(path, { encoding: 'utf-8' })
  md(str)
}

export const Image = ({ src, alt, ...opts }) =>
  termImg(src, {
    ...opts,
    height: opts.height || 2,
    fallback:
      opts.fallback || opts.alt
        ? () => {
            console.log(alt)
          }
        : () => {}
  })

export const carlton = () => Image(path.join(__dirname, '/carlton.gif'))
