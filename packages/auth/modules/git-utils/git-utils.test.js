const test = require('ava')
const mock = require('mock-fs')

const { getGitConfig, getRemoteUrl } = require('./')

const MOCK_URL = 'git@github.com:example/example.git'
const HTTPS_URL = 'https://github.com/example/example.git'

const GIT_CONFIG_TEMPLATE = `
[core]
  repositoryformatversion = 0
  filemode = true
  bare = false
  logallrefupdates = true
  ignorecase = true
  precomposeunicode = true
[remote "origin"]
  url = ${MOCK_URL}
  fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
  remote = origin
  merge = refs/heads/master
`

const gitMock = {
  '/path/to/non/git/dir': {
    src: {}
  },
  '/path/to/git/dir': {
    '.git': {
      config: GIT_CONFIG_TEMPLATE
    },
    src: {}
  }
}

test.before(() => {
  mock(gitMock)
})

test.after.always(() => {
  mock.restore()
})

test('getGitConfig › should be a function', t => {
  t.is(typeof getGitConfig, 'function')
})

test('getGitConfig › should assume process.cwd without a parameter', async t => {
  process.chdir('/path/to/git/dir')
  const gitConfig = await getGitConfig()
  t.is(gitConfig['remote "origin"'].url, MOCK_URL)
})

test('getGitConfig › should get git when explicitly passing in', async t => {
  const gitConfig1 = await getGitConfig('/path/to/git/dir')
  t.is(gitConfig1['remote "origin"'].url, MOCK_URL)

  process.chdir('/path/to/non/git/dir')
  const gitConfig2 = await getGitConfig('/path/to/git/dir')
  t.is(gitConfig2['remote "origin"'].url, MOCK_URL)
})

test('getGitConfig › should return false when passed in cwd is not a path', async t => {
  process.chdir('/path/to/git/dir')
  const gitConfig1 = await getGitConfig('/path/to/non/git/dir')
  t.false(gitConfig1)

  process.chdir('/path/to/non/git/dir')
  const gitConfig2 = await getGitConfig('/path/to/non/git/dir')
  t.false(gitConfig2)
})

test('getGitConfig › should return false when implicit cwd is not a directory', async t => {
  process.chdir('/path/to/non/git/dir')
  const gitConfig = await getGitConfig()
  t.false(gitConfig)
})

test('getGitConfig › should work when used within children of git configs', async t => {
  process.chdir('/path/to/git/dir/src')
  const gitConfig1 = await getGitConfig()
  t.is(gitConfig1['remote "origin"'].url, MOCK_URL)

  process.chdir('/path/to/non/git/dir/src')
  const gitConfig2 = await getGitConfig('/path/to/git/dir/src')
  t.is(gitConfig2['remote "origin"'].url, MOCK_URL)
})

test('getRemoteUrl > should return formatted url', async t => {
  process.chdir('/path/to/git/dir/src')
  const gitConfig = await getGitConfig()
  const url = getRemoteUrl('origin', gitConfig)
  console.log(url)
  t.is(url, HTTPS_URL)
})
