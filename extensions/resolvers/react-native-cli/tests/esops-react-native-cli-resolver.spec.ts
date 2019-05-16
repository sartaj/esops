import * as path from 'path'

import esops from '../../../../index'

import {withSnapshots} from 'riteway-fs-snapshots/withSnapshots'
import {withTempDir} from 'riteway-fs-snapshots/withTempDir'
import {
  getFileContents,
  getSortedFilePaths
} from 'riteway-fs-snapshots/fs-utils'

const describe = withSnapshots(__filename)

const rootPath = path.join(__dirname, './module')

describe('esops react native cli resolver', async assert => {
  await withTempDir(__dirname, rootPath, async root => {
    await esops({
      root: path.join(root, 'infrastructure'),
      logLevel: 'error',
      prompts: [true]
    })

    await assert({
      given: 'esops_react_native_resolver',
      should: 'generate correct files',
      snap: getSortedFilePaths(root)
    })

    await assert({
      given: 'esops_react_native_resolver',
      should: 'generate correct package.json',
      snap: getFileContents(path.join(root, 'package.json'))
    })

    await assert({
      given: 'esops_react_native_resolver',
      should: 'generate correct .gitignore',
      snap: getFileContents(path.join(root, '.gitignore'))
    })
  })
})
