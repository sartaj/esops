export {spawnWithDebug}

const crossSpawn = require('cross-spawn')
const debug = require('debug')('git-pull-or-clone')
const fs = require('fs')

function spawnWithDebug(command, args, cb) {
  const title = command + ' ' + args.join(' ')
  debug(title)
  const child = crossSpawn(command, args, {
    stdio: ['pipe', process.stdout, process.stderr]
  })
  child.on('error', cb)
  child.on('close', function(code) {
    if (code !== 0) return cb(new Error('Non-zero exit code: ' + code))
    cb(null)
  })
  return child
}

function spawn(command, args, opts, cb) {
  opts.stdio = debug.enabled ? 'inherit' : 'ignore'

  const child = crossSpawn(command, args, opts)
  child.on('error', cb)
  child.on('close', function(code) {
    if (code !== 0) return cb(new Error('Non-zero exit code: ' + code))
    cb(null)
  })
  return child
}
