import * as path from 'path'
import * as resolvePkg from 'resolve-pkg'
import * as fs from 'fs'
import * as tmp from 'tmp'

import {CWDNotDefined, NoPathError} from '../../core/messages'
import {pipe} from 'ramda'
import {spawn} from '../process'

const NODE_PREFIX = 'node:'
const GITHUB_PREFIX = 'github:'

export const tryGitPath = async ({gitUrl, destination, branch}) => {
  const args = [
    'clone',
    '--branch',
    branch || 'master',
    '--depth',
    '1',
    gitUrl,
    destination + 'tmp'
  ]

  const [err] = await spawn('git', args)
  if (err) throw err
  return destination
}

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
    return resolvePkg(pathString, opts)
  } catch (e) {
    throw e
  }
}

const extractGitInfoFromGithubPath = pipe(
  str => str.substr(GITHUB_PREFIX.length, str.length - 1),
  str => str.split('#'),
  ([githubPath, branch]) => ({
    gitUrl: `https://github.com/${githubPath}.git`,
    branch
  })
)

export const fetchPath = async (pathString, {cwd}) => {
  try {
    if (!cwd) throw new TypeError(CWDNotDefined())
    let modulePath
    if (!modulePath) modulePath = await tryFSPath(pathString, {cwd})

    if (!modulePath && pathString.startsWith(NODE_PREFIX)) {
      const nodePath = pathString.substr(NODE_PREFIX.length)
      modulePath = await tryNodePath(nodePath, {cwd})
    }

    if (!modulePath && pathString.startsWith(GITHUB_PREFIX)) {
      const {gitUrl, branch} = extractGitInfoFromGithubPath(pathString)
      const tempDir = tmp.dirSync()
      modulePath = await tryGitPath({gitUrl, destination: tempDir.name, branch})
      // modulePath += '/stack'
      // console.log(modulePath)
      modulePath = ''
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
