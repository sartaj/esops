import {pipe} from 'ramda'
import {GitFetchFailed} from '../../../domain/messages'
import {spawn} from '../../../side-effects/process'

export const GITHUB_COMPONENT_TYPE = 'GITHUB'
export const GITHUB_PREFIX = 'github:'
export const isGithub = componentString =>
  componentString.startsWith(GITHUB_PREFIX)

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

/**
 * ## Utilities
 */

const getGitInfoFromGithubPath = pipe(
  str => str.substr(GITHUB_PREFIX.length, str.length - 1),
  str => str.split('#'),
  ([githubPath, branch]) => ({
    gitUrl: `https://github.com/${githubPath}.git`,
    branch
  })
)

export const resolveGithub = async (
  {
    effects: {
      filesystem: {appCache}
    }
  },
  sanitizedComponent
) => {
  const pathString = sanitizedComponent[0]

  try {
    const destination = await appCache.createNewCacheFolder()
    const {gitUrl, branch} = getGitInfoFromGithubPath(pathString)
    const modulePath = await tryGitPath({gitUrl, destination, branch})

    return modulePath
  } catch (e) {
    throw new TypeError(GitFetchFailed({pathString, message: e.message}))
  }
}
export default resolveGithub

export const is = isGithub
export const COMPONENT_TYPE = GITHUB_COMPONENT_TYPE
export const resolve = resolveGithub
