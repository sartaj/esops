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
import {MOCK_STACKS} from '../core/examples'

const describe = withSnapshots(__filename)

describe('esops() node+npm features', async assert => {
  await withTempDir(
    __dirname,
    MOCK_STACKS['basic-ignore-files'],
    async destination => {
      await esops({destination})

      await assert({
        given: 'an included .npmignore',
        should: 'have updated .npmignore with generated file paths',
        snap: getFileContents(path.join(destination, '.npmignore'))
      })
    }
  )

  await withTempDir(__dirname, MOCK_STACKS['basic-package-json'], async cwd => {
    await esops({cwd})

    await assert({
      given: 'a minimal package with package.json',
      should: 'generate basic template in cwd',
      snap: getSortedFilePaths(cwd)
    })

    await assert({
      given: 'an included .gitignore',
      should: 'have updated .gitignore with generated paths',
      snap: getFileContents(path.join(cwd, '.gitignore'))
    })

    await assert({
      given: 'a minimal package.json',
      should: 'have contents in package.json',
      snap: getJsonContents(path.join(cwd, 'package.json'))
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-node-module'], async cwd => {
    await spawn(`npm`, ['install'], {cwd})
    await esops({cwd})
    await assert({
      given: 'minimal stack from node module',
      should: 'generate basic template in cwd from node_module',
      snap: getSortedFilePaths(cwd)
    })
  })
})
