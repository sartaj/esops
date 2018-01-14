import chalk from 'chalk'
import termImg from 'term-img'
import boxen from 'boxen'

export const logo = () => chalk.blue.bold.dim(`esops`)

export const info = message => `${logo()} ${chalk.green(message)}`

export const error = err =>
  `\n${logo()} ${chalk.red.bold('ERROR')} ${chalk.red(err.message)}`

export const header = () => logo()

export const help = () => ``

export const announce = string =>
  boxen(string, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    float: 'center',
    align: 'center'
  })

export const carlton = () =>
  termImg(__dirname + '/carlton.gif', { height: 2, fallback: () => {} })
