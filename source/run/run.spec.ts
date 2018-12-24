import * as path from 'path'

import {withSnapshots} from '../../test-utils/withSnapshots'
import {withTempDir} from '../../test-utils/withTempDir'
import {
  getSortedFilePaths,
  getFileContents,
  getJsonContents
} from '../../test-utils/fs-utils'

import esops from './index'
import {MOCK_STACKS} from '../core/examples'
import * as spawn from 'await-spawn'

const describe = withSnapshots(__dirname, null)

describe('minimal stack with esops.json and fs path', async (assert, assertSnap) => {
  withTempDir(__dirname, MOCK_STACKS.basic, async cwd => {
    await esops({cwd})

    assertSnap({
      given: 'a minimal package',
      should: 'generate basic template in cwd',
      snap: getSortedFilePaths(cwd)
    })

    assertSnap({
      given: 'an included gitignore',
      should: 'have updated gitignore with generated file paths',
      snap: getFileContents(path.join(cwd, '.gitignore'))
    })
  })
})

describe('minimal stack with package.json', async (assert, assertSnap) => {
  withTempDir(__dirname, MOCK_STACKS['basic-package-json'], async cwd => {
    await esops({cwd})

    assertSnap({
      given: 'a minimal package with package.json',
      should: 'generate basic template in cwd',
      snap: getSortedFilePaths(cwd)
    })

    assertSnap({
      given: 'an included .gitignore',
      should: 'have updated .gitignore with generated file paths',
      snap: getFileContents(path.join(cwd, '.gitignore'))
    })

    assertSnap({
      given: 'a package.json',
      should: 'have a package.json',
      snap: getJsonContents(path.join(cwd, 'package.json'))
    })
  })
})

describe('minimal stack with no .gitignore', async (assert, assertSnap) => {
  withTempDir(__dirname, MOCK_STACKS['basic-no-gitignore'], async cwd => {
    await esops({cwd})

    assertSnap({
      given: 'a minimal package with no .gitignore',
      should: 'generate basic template in cwd',
      snap: getSortedFilePaths(cwd)
    })

    assert({
      given: 'no .gitignore',
      should: 'not create a gitignore',
      expected: null,
      actual: getFileContents(path.join(cwd, '.gitignore'))
    })
  })
})

describe('minimal stack from node module', async (assert, assertSnap) => {
  withTempDir(__dirname, MOCK_STACKS['basic-node-module'], async cwd => {
    await spawn(`npm`, ['install'], {cwd})
    await esops({cwd})
    assertSnap({
      given: 'a minimal package',
      should: 'generate basic template in cwd from node_module',
      snap: getSortedFilePaths(cwd)
    })
  })
})
