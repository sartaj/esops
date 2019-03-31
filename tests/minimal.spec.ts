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

describe('esops() minimal features', async assert => {
  await withTempDir(__dirname, MOCK_STACKS['basic'], async cwd => {
    await esops({destination: cwd})

    await assert({
      given: 'a minimal package with no extra files',
      should: 'generate basic template in cwd',
      snap: getSortedFilePaths(cwd)
    })

    await assert({
      given: 'no .gitignore',
      should: 'not create a .gitignore',
      expected: null,
      actual: getFileContents(path.join(cwd, '.gitignore'))
    })

    await assert({
      given: 'no .npmignore',
      should: 'not create a .npmignore',
      expected: null,
      actual: getFileContents(path.join(cwd, '.npmignore'))
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-ignore-files'], async cwd => {
    await esops({destination: cwd})

    await assert({
      given: 'an included .gitignore',
      should: 'have updated .gitignore with generated file paths',
      snap: getFileContents(path.join(cwd, '.gitignore'))
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-ignore-files'], async cwd => {
    await esops({destination: cwd})

    await assert({
      given: 'an included .npmignore',
      should: 'have updated .npmignore with generated file paths',
      snap: getFileContents(path.join(cwd, '.npmignore'))
    })
  })

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
