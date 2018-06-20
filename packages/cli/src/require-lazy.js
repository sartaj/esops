import execa from 'execa'
import log from '@esops/logger'
import resolveFrom from 'resolve-from'

const requireModule = (modulePath, name) => {
  log.announce(`Using ${name || modulePath}`)
  return require(modulePath)
}

export default async (name, opts) => {
  // eslint-disable-next-line
  let command = ['add', name]
  if (opts.dev) command.push('--dev')
  return new Promise((resolve, reject) => {
    const modulePathInCwd = resolveFrom.silent(opts.cwd, name)
    const modulePathDir = resolveFrom.silent(__dirname, name)
    if (modulePathInCwd) resolve(requireModule(modulePathInCwd, name))
    else if (modulePathDir) resolve(requireModule(modulePathDir, name))
    else {
      log.announce(`Installing ${name}`)
      const tryingToInstall = execa('yarn', command, { cwd: opts.cwd })
      tryingToInstall.stdout.pipe(process.stdout)
      tryingToInstall
        .then(function() {
          try {
            resolve(requireModule(name))
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
