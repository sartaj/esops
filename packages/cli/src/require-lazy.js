import path from 'path'
import execa from 'execa'
import log from '@esops/logger'

export default async (name, opts) => {
  log.announce(`Installing ${name} pipeline`)
  let command = ['add', name]
  if (opts.dev) command.push('--dev')
  return new Promise((resolve, reject) => {
    try {
      const result = require(name)
      resolve(result)
    } catch (e) {
      const tryingToInstall = execa('yarn', command, { cwd: opts.cwd })
      tryingToInstall.stdout.pipe(process.stdout)
      tryingToInstall
        .then(function() {
          try {
            const result = require(name)
            resolve(result)
          } catch (err) {
            reject(
              new Error(
                `Uh Oh. Unknown error while trying to install ${name}`,
                err
              )
            )
          }
        })
        .catch(err => {
          console.error(new Error(err))
        })
    }
  })
}
