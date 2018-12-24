import {mdString} from './markdown'

const chalk = require('chalk')
const PrettyError = require('pretty-error')
const {announce} = require('./announce')

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
  .skipPackage('babel-cli', 'babel-polyfill', 'gluegun', 'pirates')

export const renderError = e => {
  const stackTrace = prettyError.render(e)
  const errorTemplate = `
  ${chalk.bold(`# ${chalk.red('Oops.')} ${chalk.red(e.name)}`)}

  ${mdString(e.message)}
  ___

  ${chalk.red.bold.dim('Stack Trace')}
  ${stackTrace}
  `
  announce(errorTemplate, {
    align: 'left',
    borderColor: 'red'
  })
}

// module.exports.renderError = renderError

// module.exports.init = () => {
//   process.on('uncaughtException', function(error) {
//     renderError(error, prettyError)
//   })

//   // To render unhandled rejections created in BlueBird:
//   process.on('unhandledRejection', function(reason) {
//     console.log('Unhandled rejection')
//     console.log('stack traces\n' + prettyError.render(reason))
//   })
// }

// module.exports.error = message => {
//   // process.nextTick(function() {
//   throw new Error(message)
//   // announce(errorTemplate(new Error(message)), {}, 'error')
//   // })
// }
