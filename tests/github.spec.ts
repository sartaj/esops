import * as path from 'path'
import * as spawn from 'await-spawn'
import * as prompts from 'prompts'

import {Try} from 'riteway'
import {withSnapshots} from './test-utils/withSnapshots'
import {withTempDir} from './test-utils/withTempDir'
import {
  getSortedFilePaths,
  getFileContents,
  getJsonContents,
  cleanErrorString
} from './test-utils/fs-utils'

import esops from '../interfaces/main'
import {MOCK_STACKS} from './examples'

const describe = withSnapshots(__filename)

describe('esops() github features', async assert => {
  await withTempDir(__dirname, MOCK_STACKS['github-url'], async cwd => {
    // prompts.inject([false])
    await esops({
      destination: cwd,
      logLevel: 'info'
    })

    await assert({
      given: 'a github path that composes another github path',
      should: 'generate appropriate files',
      snap: getSortedFilePaths(cwd)
    })
    await assert({
      given: 'a .gitignore',
      should: 'create merged .gitignore with manifest',
      snap: getFileContents(path.join(cwd, '.gitignore'))
    })
    await assert({
      given: 'a package.json',
      should: 'create merged package.json with manifest',
      snap: getFileContents(path.join(cwd, 'package.json'))
    })
  })
})
