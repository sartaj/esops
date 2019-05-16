import * as path from 'path'

import esops from '../../../../index'

import {withSnapshots} from '../../../../test-utilities/withSnapshots'
import {withTempDir} from '../../../../test-utilities/withTempDir'
import {
  getFileContents,
  getSortedFilePaths
} from '../../../../test-utilities/fs-utils'

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
