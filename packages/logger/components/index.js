import chalk from 'chalk'
import log from 'loglevel'

log.setLevel(0)

export { announce } from './announce'
export { image } from './image'
export { md, mdFile } from './markdown'
export { error } from './error'

export const logo = () => chalk.blue.bold.dim(`esops`)

export const header = () => logo()

export const info = message => {
  log.info(`${logo()} ${chalk.green(message)}`)
}

export { trace, debug, warn } from './'
