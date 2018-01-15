import chalk from 'chalk'
import PrettyError from 'pretty-error'
import { announce } from './announce'

// Bug: https://github.com/AriaMinaei/pretty-error#troubleshooting
const prettyError = new PrettyError()
  .skipNodeFiles()
  .appendStyle({
    // this is a simple selector to the element that says 'Error'
    'pretty-error > header': {
      // which we can hide:
      display: 'none'
    },
    'pretty-error > trace > item > header > pointer > file': {
      color: 'bright-cyan'
    }
  })
  .skipPackage('babel-cli', 'babel-polyfill', 'gluegun')

export const renderError = message => {
  const stackTrace = prettyError.render(message)
  const errorTemplate = `
  ${chalk.red('Oops.')} ${chalk.red(message)} 

  ___

  ${chalk.red.bold.dim('Stack Trace')}
  ${stackTrace}
  `
  announce(errorTemplate, {
    align: 'left',
    borderColor: 'red'
  })
}

export const init = () => {
  process.on('uncaughtException', function(error) {
    renderError(error, prettyError)
  })

  // To render unhandled rejections created in BlueBird:
  process.on('unhandledRejection', function(reason) {
    console.log('Unhandled rejection')
    console.log('stack traces\n' + prettyError.render(reason))
  })
}

export const error = message => {
  // process.nextTick(function() {
  throw new Error(message)
  // announce(errorTemplate(new Error(message)), {}, 'error')
  // })
}
