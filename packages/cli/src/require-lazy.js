import path from 'path'
import execa from 'execa'
import log from '@esops/logger'

const installAndImportLibrary = async (name, opts) => {
  log.announce(`Installing ${name} pipeline`)
  let command = ['add', name]
  if (opts.dev) command.push('--dev')

  return new Promise((resolve, reject) => {
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
        reject(
          new Error(`Uh Oh. Unknown error while trying to install ${name}`, err)
        )
      })
  })
}

export default async (name, opts) => {
  let result
  // Fetch
  try {
    result = require(name)
  } catch (e1) {
    try {
      result = await installAndImportLibrary(name, opts)
    } catch (err) {
      console.error(err)
    }
  }
  // Complete
  return result
}
