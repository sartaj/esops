import * as path from 'path'
import fs from '../drivers/fs'

export const tryFSPath = (pkg, {cwd}) => {
  const potentialPath = path.join(cwd, pkg)
  return fs.existsSync(potentialPath) ? potentialPath : null
}

// const tryNodePath = async (...args) => {
//   try {
//     return fs.resolvePkg(...args)
//   } catch (e) {
//     throw e
//   }
// }

export const fetchPath = async (pathString, cwd) => {
  try {
    let modulePath
    if (!modulePath) modulePath = await tryFSPath(pathString, {cwd})
    /**
     * ## TODO: Support More Paths
     * Potential Paths:
     *  - tryNodePath
     *  - tryNPMInstall
     *  - tryGitFetch
     *  - tryHTTPFetch
     *  - tryTorrent
     **/
    if (!modulePath) throw new Error(`path ${pathString} not found from ${cwd}`)
    return modulePath
  } catch (e) {
    console.error(e)
    throw e
  }
}
