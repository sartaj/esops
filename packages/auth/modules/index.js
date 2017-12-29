const { getGitConfig } = require('./utils/git')

const init = async ({ cwd = process.cwd() }) => {
  try {
    const { gitConfig } = await getGitConfig({ cwd })
    if (gitConfig) {
      console.log(gitConfig)
    } else {
      console.log('Git repo not found. Would you like to create one?')
    }
  } catch (e) {
    console.error(new Error(e))
  }
}

init()
