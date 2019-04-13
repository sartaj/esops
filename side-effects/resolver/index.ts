import * as fs from 'fs'
import * as path from 'path'
import {pipe} from 'ramda'
import * as resolvePkg from 'resolve-pkg'

import {spawn} from '../process'

const NODE_PREFIX = 'node:'
const GITHUB_PREFIX = 'github:'

export const tryGitPath = async ({gitUrl, destination, branch}) => {
  try {
    const args = [
      'clone',
      '--branch',
      branch || 'master',
      '--depth',
      '1',
      gitUrl,
      destination
    ]

    const [err] = await spawn('git', args)
    if (err) throw err
    return destination
  } catch (e) {
    throw new Error(e)
  }
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

export const createResolver = () => ({
  tryGitPath,
  tryFSPath,
  tryNodePath
})
