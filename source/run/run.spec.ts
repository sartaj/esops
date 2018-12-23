import {withSnapshots} from '../test-utils/withSnapshots'
import {withTempDir} from '../test-utils/withTempDir'
import {getSortedFilePaths, getGitignoreContents} from '../test-utils/fs-utils'

import esops from './index'
import {MOCK_STACKS} from '../core/examples'

const describe = withSnapshots(__dirname, null)

describe('run()', async (assert, assertSnap) => {
  const initialFiles = MOCK_STACKS.basic

  withTempDir(__dirname, initialFiles, async cwd => {
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
      snap: getGitignoreContents(cwd)
    })
  })
})
