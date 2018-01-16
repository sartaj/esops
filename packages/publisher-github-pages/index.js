const ghpages = require('gh-pages')
const parse = require('parse-git-config')
const GitUrlParse = require('git-url-parse')
const log = require('@esops/logger').default

const getGHPagesUrl = cwd => {
  const info = GitUrlParse(parse.sync({ cwd })['remote "origin"'].url)
  const repo = info.pathname.split('/')[2].slice(0, -4)
  const url = `http://${info.owner}.github.io/${repo}`
  return {
    url,
    repo,
    info
  }
}

const isGithubUserPage = (owner, repo) =>
  repo.indexOf(`${owner}.github.io`) > -1

// eslint-disable-next-line
module.exports = async ({ cwd, buildPath }) => {
  const { url, repo, info: { owner } } = getGHPagesUrl(cwd)
  const isUserPage = isGithubUserPage(owner, repo)
  return new Promise((resolve, reject) => {
    ghpages.publish(
      buildPath,
      {
        branch: isUserPage ? 'master' : 'gh-pages',
        add: isUserPage ? true : false
      },
      (err, data) => {
        if (err) reject(err)
        else {
          const publishedUrl = isUserPage ? `http://${repo}` : url

          log.announce(`Your static app has bee successfully deployed.
          ${publishedUrl}`)
          log.carlton()

          resolve({
            message: 'success',
            url: isUserPage ? `http://${repo}` : url
          })
        }
      }
    )
  })
}
