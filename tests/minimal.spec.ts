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

describe('esops() minimal features', async assert => {
  await withTempDir(__dirname, MOCK_STACKS['basic'], async destination => {
    await esops({destination})

    await assert({
      given: 'a minimal package with no extra files',
      should: 'generate basic template in cwd',
      snap: getSortedFilePaths(destination)
    })

    await assert({
      given: 'no .gitignore',
      should: 'not create a .gitignore',
      expected: null,
      actual: getFileContents(path.join(destination, '.gitignore'))
    })

    await assert({
      given: 'no .npmignore',
      should: 'not create a .npmignore',
      expected: null,
      actual: getFileContents(path.join(destination, '.npmignore'))
    })
  })

  await withTempDir(
    __dirname,
    MOCK_STACKS['basic-ignore-files'],
    async destination => {
      await esops({destination})

      await assert({
        given: 'an included .gitignore',
        should: 'have updated .gitignore with generated file paths',
        snap: getFileContents(path.join(destination, '.gitignore'))
      })
    }
  )
})
