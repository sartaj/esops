const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const url = require('url')
const ini = require('ini')
const findParentDir = require('find-parent-dir')
const ghUrl = require('github-url-from-git')

const findParentDirAsync = promisify(findParentDir)
const readFile = promisify(fs.readFile)

const getGitConfig = async (cwd = process.cwd()) => {
  try {
    const gitDirectory = await findParentDirAsync(cwd, '.git')
    if (!gitDirectory) return false

    const gitConfig = await readFile(
      path.join(gitDirectory, './.git/config'),
      'utf8'
    )

    return ini.decode(gitConfig)
  } catch (e) {
    return Promise.reject(
      new Error('Error while trying to retrieve git config', e)
    )
  }
}
const getRemoteUrl = (remote, config = getGitConfig()) => {
  const remoteUrl = config[`remote "${remote}"`].url
  if (!remoteUrl) return false
  const repository = { type: 'git', url: `${ghUrl(remoteUrl)}.git` }
  return url.format({
    ...url.parse(repository.url),
    auth: null,
    protocol: 'https'
  })
}

module.exports.getGitConfig = getGitConfig
module.exports.getRemoteUrl = getRemoteUrl
