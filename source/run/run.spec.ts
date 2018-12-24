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

const describe = withSnapshots(__dirname, null)

describe('run()', async (assert, assertSnap) => {
  withTempDir(__dirname, MOCK_STACKS.basic, async cwd => {
    await esops({cwd})

    assertSnap({
      given:
        'a basic package with package.json config and available `.gitignore`',
      should: 'generate basic template in cwd',
      snap: getSortedFilePaths(cwd)
    })

    assertSnap({
      given:
        'a basic package with package.json config and available `.gitignore`',
      should: 'have updated gitignore with generated file paths',
      snap: getFileContents(path.join(cwd, '.gitignore'))
    })

    assertSnap({
      given:
        'a basic package with package.json config and available `.gitignore`',
      should: 'have merged package.json',
      snap: getJsonContents(path.join(cwd, 'package.json'))
    })
  })
})
