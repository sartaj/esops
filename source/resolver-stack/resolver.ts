import * as path from 'path'
import fs from '../drivers/fs'

export const tryFSPath = (pkg, {cwd}) => {
  const potentialPath = path.join(cwd, pkg)
  return fs.existsSync(potentialPath) ? potentialPath : null
}

const tryNodePath = async (pathString, opts) => {
  try {
    return fs.resolvePkg(pathString, opts)
  } catch (e) {
    throw e
  }
}

export const fetchPath = async (pathString, cwd) => {
  try {
    let modulePath
    if (!modulePath) modulePath = await tryFSPath(pathString, {cwd})

    const NODE_PREFIX = 'node:'
    if (!modulePath && pathString.startsWith(NODE_PREFIX)) {
      const nodePath = pathString.substr(NODE_PREFIX.length)
      modulePath = await tryNodePath(nodePath, {cwd})
    }
    /**
     * ## TODO: Support More Paths
     * Potential Paths:
     *  - tryHTTPFetch
     *  - tryGitFetch
     *  - tryNPMInstall
     *  - tryTorrent
     **/
    if (!modulePath)
      throw new TypeError(
        `Path ${pathString} not found.

Current Working Directory: ${cwd}.

Allowed paths include:

- fs paths: './infrastructure'
- node paths: 'node:@myorg/my-stack/stack
`
      )
    return modulePath
  } catch (e) {
    throw e
  }
}
