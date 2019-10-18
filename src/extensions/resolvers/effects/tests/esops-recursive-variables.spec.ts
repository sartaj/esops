import * as path from 'path'

import esops from '../../../../index'
import {
  getFileContents,
  getSortedFilePaths
} from 'riteway-fs-snapshots/fs-utils'
import {withSnapshots} from 'riteway-fs-snapshots/withSnapshots'
import {withTempDir} from 'riteway-fs-snapshots/withTempDir'

const describe = withSnapshots(__filename)

const rootPath = path.join(__dirname, './module')

describe('esops recursive variables', async assert => {
  console.warn('@DEPRECATE will be deprecated and rethought.')
  await withTempDir(__dirname, rootPath, async root => {
    await esops({
      root: path.join(root, 'infrastructure'),
      logLevel: 'error'
    })

    // await assert({
    //   given: 'esops-react-native-typescript',
    //   should: 'generate correct files',
    //   snap: getSortedFilePaths(root)
    // })

    // await assert({
    //   given: 'esops-react-native-typescript',
    //   should: 'generate correct package.json',
    //   snap: getFileContents(path.join(root, 'package.json'))
    // })

    // await assert({
    //   given: 'esops-react-native-typescript',
    //   should: 'generate correct .gitignore',
    //   snap: getFileContents(path.join(root, '.gitignore'))
    // })
  })
})
