import * as path from 'path'

import esops from '../../../../interfaces/main'
import {getFileContents, getSortedFilePaths} from '../../../test-utils/fs-utils'
import {withSnapshots} from '../../../test-utils/withSnapshots'
import {withTempDir} from '../../../test-utils/withTempDir'

const describe = withSnapshots(__filename)

const rootPath = path.join(__dirname, './module')

describe('esops() minimal features', async assert => {
  await withTempDir(__dirname, rootPath, async root => {
    await esops({root})

    await assert({
      given: 'a minimal package with no extra files',
      should: 'generate basic template in cwd',
      snap: getSortedFilePaths(root)
    })

    await assert({
      given: 'no .gitignore',
      should: 'not create a .gitignore',
      expected: null,
      actual: getFileContents(path.join(root, '.gitignore'))
    })

    await assert({
      given: 'no .npmignore',
      should: 'not create a .npmignore',
      expected: null,
      actual: getFileContents(path.join(root, '.npmignore'))
    })
  })
})
