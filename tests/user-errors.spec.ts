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

describe('esops1() user errors', async assert => {
  await withTempDir(__dirname, MOCK_STACKS['basic-no-config'], async cwd => {
    const snap = cleanErrorString(cwd)(await Try(esops, {cwd}))
    await assert({
      given: 'no config found',
      should: 'provide a friendly message on how to use esops',
      snap
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-bad-path'], async cwd => {
    const cleanError = cleanErrorString(cwd)
    const snap = cleanError(await Try(esops, {cwd}))
    await assert({
      given: 'a bad path in the config',
      should: 'throw a friendly error',
      snap
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-bad-config'], async cwd => {
    const snap = cleanErrorString(cwd)(await Try(esops, {cwd}))
    await assert({
      given: 'an invalid config object',
      should: 'throw a friendly error',
      snap
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-bad-json'], async cwd => {
    const snap = cleanErrorString(cwd)(await Try(esops, {cwd}))
    await assert({
      given: 'non parseable',
      should: 'throw a friendly error',
      snap
    })
  })
})
