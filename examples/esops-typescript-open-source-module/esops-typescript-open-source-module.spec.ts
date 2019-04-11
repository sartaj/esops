import * as path from 'path'

import esops from '../../library'
import {
  getFileContents,
  getSortedFilePaths
} from '../../test-utilities/fs-utils'
import {withSnapshots} from '../../test-utilities/withSnapshots'
import {withTempDir} from '../../test-utilities/withTempDir'

const describe = withSnapshots(__filename)

const rootPath = path.join(__dirname, './module')

describe('esops typescript open source module', async assert => {
  await withTempDir(__dirname, rootPath, async root => {
    await esops({
      root,
      logLevel: 'error'
    })

    await assert({
      given: 'a github path that composes another github path',
      should: 'generate appropriate files',
      snap: getSortedFilePaths(root)
    })
    await assert({
      given: 'a .gitignore',
      should: 'create merged .gitignore with manifest',
      snap: getFileContents(path.join(root, '.gitignore'))
    })
    await assert({
      given: 'a package.json',
      should: 'create merged package.json with manifest',
      snap: getFileContents(path.join(root, 'package.json'))
    })
  })
})
