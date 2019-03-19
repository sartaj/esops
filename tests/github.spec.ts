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

import esops from '../usage/main'
import {MOCK_STACKS} from '../core/examples'

const describe = withSnapshots(__filename)

// describe('esops() github features', async assert => {
// await withTempDir(__dirname, MOCK_STACKS['github-url'], async cwd => {
//   prompts.inject([false])
//   await esops({cwd})

// await assert({
//   given: 'a minimal package with no extra files',
//   should: 'generate basic template in cwd',
//   snap: getSortedFilePaths(cwd)
// })
// })
// })
