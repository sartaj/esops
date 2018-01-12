import chalk from 'chalk'

export const logo = () => `esops`

export const info = message =>
  `\n${logo()} ${chalk.dim.bold('')} ${chalk.green(message)}`

export const error = err =>
  `\n${logo()} ${chalk.red.bold('ERROR')} ${chalk.red(err.message)}`

export const header = () => logo()

export const help = () => ``
