const ghpages = require('gh-pages');

module.exports = async ({ cwd, message, buildPath, git }) => {
  const info = git.parse()
  const url = `http://${info.owner}.github.io/${info.pathname.split('/')[2]}`.slice(0,-4)
  return new Promise((resolve, reject) => { 
    ghpages.publish(buildPath, (err, data) => {
      if (err) reject(err)
      else resolve({ message: 'success', url })
    })
  })
}
