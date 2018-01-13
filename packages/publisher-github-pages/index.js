const ghpages = require('gh-pages')
const parse = require('parse-git-config')
const GitUrlParse = require('git-url-parse')

const getGHPagesUrl = cwd => {
  const info = GitUrlParse(parse.sync({ cwd })['remote "origin"'].url)
  const url = `http://${info.owner}.github.io/${
    info.pathname.split('/')[2]
  }`.slice(0, -4)
  return url
}

module.exports = async ({ cwd, buildPath }) => {
  const url = getGHPagesUrl(cwd)

  return new Promise((resolve, reject) => {
    ghpages.publish(buildPath, (err, data) => {
      if (err) reject(err)
      else resolve({ message: 'success', url })
    })
  })
}
