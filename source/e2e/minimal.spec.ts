import * as path from 'path'
import * as spawn from 'await-spawn'

import {Try} from 'riteway'
import {withSnapshots} from '../../test-utils/withSnapshots'
import {withTempDir} from '../../test-utils/withTempDir'
import {
  getSortedFilePaths,
  getFileContents,
  getJsonContents,
  cleanErrorString
} from '../../test-utils/fs-utils'

import esops from '../run/index'
import {MOCK_STACKS} from '../core/examples'

const describe = withSnapshots(__dirname, 'snapshots-minimal')

describe('esops() minimal features', async (assert, assertSnap) => {
  await withTempDir(__dirname, MOCK_STACKS['basic-gitignore'], async cwd => {
    await esops({cwd})

    await assertSnap({
      given: 'stack with esops.json and fs path',
      should: 'generate basic template in cwd',
      snap: getSortedFilePaths(cwd)
    })

    await assertSnap({
      given: 'an included gitignore',
      should: 'have updated gitignore with generated file paths',
      snap: getFileContents(path.join(cwd, '.gitignore'))
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-package-json'], async cwd => {
    await esops({cwd})

    await assertSnap({
      given: 'a minimal package with package.json',
      should: 'generate basic template in cwd',
      snap: getSortedFilePaths(cwd)
    })

    await assertSnap({
      given: 'a minimal package.json and included .gitignore',
      should: 'have updated .gitignore with generated paths',
      snap: getFileContents(path.join(cwd, '.gitignore'))
    })

    await assertSnap({
      given: 'a minimal package.json',
      should: 'have contents in package.json',
      snap: getJsonContents(path.join(cwd, 'package.json'))
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic'], async cwd => {
    await esops({cwd})

    await assertSnap({
      given: 'a minimal package with no .gitignore',
      should: 'generate basic template in cwd',
      snap: getSortedFilePaths(cwd)
    })

    await assert({
      given: 'no .gitignore',
      should: 'not create a gitignore',
      expected: null,
      actual: getFileContents(path.join(cwd, '.gitignore'))
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-node-module'], async cwd => {
    await spawn(`npm`, ['install'], {cwd})
    await esops({cwd})
    await assertSnap({
      given: 'minimal stack from node module',
      should: 'generate basic template in cwd from node_module',
      snap: getSortedFilePaths(cwd)
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-bad-path'], async cwd => {
    const cleanError = cleanErrorString(cwd)
    const snap = cleanError(await Try(esops, {cwd}))
    await assertSnap({
      given: 'a bad path in the config',
      should: 'throw a friendly error',
      snap
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-bad-config'], async cwd => {
    const snap = cleanErrorString(cwd)(await Try(esops, {cwd}))
    await assertSnap({
      given: 'an invalid config object',
      should: 'throw a friendly error',
      snap
    })
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-bad-config'], async cwd => {
    const snap = cleanErrorString(cwd)(await Try(esops, {cwd}))
    await assertSnap({
      given: 'non parseable',
      should: 'throw a friendly error',
      snap
    })
  })
})
