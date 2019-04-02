import * as path from 'path'
import * as spawn from 'await-spawn'

import {Try} from 'riteway'
import * as prompts from 'prompts'
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

describe('esops1() override features', async assert => {
  await withTempDir(
    __dirname,
    MOCK_STACKS['basic-overwrite-cwd-file'],
    async cwd => {
      prompts.inject([false])
      await esops({cwd})
      await assert({
        given: 'no to override',
        should: 'not override files',
        snap: getFileContents(path.join(cwd, 'tsconfig.json'))
      })
    }
  )

  await withTempDir(
    __dirname,
    MOCK_STACKS['basic-overwrite-cwd-file'],
    async cwd => {
      prompts.inject([true])
      await esops({cwd})
      await assert({
        given: 'yes to override',
        should: 'override files',
        snap: getFileContents(path.join(cwd, 'tsconfig.json'))
      })
    }
  )

  await withTempDir(
    __dirname,
    MOCK_STACKS['basic-overwrite-cwd-file'],
    async cwd => {
      const prompts = require('prompts')
      prompts.inject([new Error()])
      await esops({cwd})
      await assert({
        given: 'canceling prompt to override',
        should: 'not override files',
        snap: getFileContents(path.join(cwd, 'tsconfig.json'))
      })
    }
  )
})
