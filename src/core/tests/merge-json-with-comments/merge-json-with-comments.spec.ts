import * as path from 'path'

import esops from '../../../run'
import {
  getFileContents,
  getSortedFilePaths
} from 'riteway-fs-snapshots/fs-utils'
import {withSnapshots} from 'riteway-fs-snapshots/withSnapshots'
import {withTempDir} from 'riteway-fs-snapshots/withTempDir'

const describe = withSnapshots(__filename)

const rootPath = path.join(__dirname, './module')

const NAME = 'esops multi-merge'
describe(NAME, async assert => {
  await withTempDir(__dirname, rootPath, async root => {
    await esops({root: path.join(root, 'infrastructure')})

    await assert({
      given: NAME,
      should: 'generate correct files',
      snap: getSortedFilePaths(root)
    })

    await assert({
      given: NAME,
      should: 'generate correct package.json',
      snap: getFileContents(path.join(root, 'package.json'))
    })

    await assert({
      given: NAME,
      should: 'generate correct .gitignore',
      snap: getFileContents(path.join(root, '.gitignore'))
    })
  })
})
