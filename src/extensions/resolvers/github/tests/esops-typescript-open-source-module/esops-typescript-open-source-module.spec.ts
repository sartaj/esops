import * as path from 'path'

import esops from '../../../../../index'
import {
  getFileContents,
  getSortedFilePaths
} from 'riteway-fs-snapshots/fs-utils'
import {withSnapshots} from 'riteway-fs-snapshots/withSnapshots'
import {withTempDir} from 'riteway-fs-snapshots/withTempDir'

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
