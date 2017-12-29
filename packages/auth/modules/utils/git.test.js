const { getGitConfig } = require('./git')

describe('utils/git', () => {
  test('getGitUtils should be a function', () => {
    expect(typeof getGitConfig).toBe('function')
  })

  test('getGitUtils should assume process.cwd without a parameter', () => {
    expect.assertions(1)
    return getGitConfig().then(gitConfig => {
      expect(gitConfig.core).toBeTruthy()
    })
  })
})
