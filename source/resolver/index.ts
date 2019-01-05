import * as path from 'path'

import fs from '../drivers/fs'
import {CWDNotDefined, NoPathError} from '../messages'

export const tryFSPath = (pkg, {cwd}) => {
  try {
    const potentialPath = path.join(cwd, pkg)
    return fs.existsSync(potentialPath) ? potentialPath : null
  } catch (e) {
    throw e
  }
}
const tryNodePath = async (pathString, opts) => {
  try {
    return fs.resolvePkg(pathString, opts)
  } catch (e) {
    throw e
  }
}

export const fetchPath = async (pathString, {cwd}) => {
  try {
    if (!cwd) throw new TypeError(CWDNotDefined())
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
    if (!modulePath) throw new TypeError(NoPathError({pathString, cwd}))
    return modulePath
  } catch (e) {
    throw e
  }
}

export default fetchPath
