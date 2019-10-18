const crossSpawn = require('cross-spawn')
const fs = require('fs')

function spawnWithDebug(command, args, cb) {
  // const title = command + ' ' + args.join(' ')
  const child = crossSpawn(command, args, {
    // stdio: ['pipe', process.stdout, process.stderr],
    shell: true
  })

  let stderr = ''
  child.stderr.on('data', function(data) {
    stderr = data
  })
  child.on('error', () => {
    cb(stderr)
  })

  child.on('close', function(code) {
    if (code !== 0) return cb(stderr)
    cb(null)
  })
  return child
}

export {spawnWithDebug}
