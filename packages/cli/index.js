#!/usr/bin/env node

const spawn = require('cross-spawn')
const script = process.argv[2]
const args = process.argv.slice(3)

function spawnScript (script) {
  const result = spawn.sync(
    'node',
    [require.resolve('./scripts/' + script)].concat(args),
    {stdio: 'inherit'}
  )
  process.exit(result.status)
}

switch (script) {
  // case 'start':
  // case 'build':
  case 'lint':
  case 'eject':
    spawnScript(script)
    break
  default:
    console.log('Unknown script "' + script + '".')
    console.log('Perhaps you need to upgrade reggie?')
    break
}

// programmatic usage for linter
var Linter = require('standard-engine').linter
var opts = require('./lint-options.js')
module.exports = new Linter(opts)
