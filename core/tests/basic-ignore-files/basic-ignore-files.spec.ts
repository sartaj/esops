import * as path from 'path'

import esops from '../../../'
import {getFileContents} from 'riteway-fs-snapshots/fs-utils'
import {withSnapshots} from 'riteway-fs-snapshots/withSnapshots'
import {withTempDir} from 'riteway-fs-snapshots/withTempDir'

const rootPath = path.join(__dirname, './module')

const describe = withSnapshots(__filename)

describe('esops() ignore file generation', async assert => {
  await withTempDir(__dirname, rootPath, async root => {
    await esops({root})

    await assert({
      given: 'an included .gitignore',
      should: 'have updated .gitignore with generated file paths',
      snap: getFileContents(path.join(root, '.gitignore'))
    })

    await assert({
      given: 'an included .npmignore',
      should: 'have updated .npmignore with generated file paths',
      snap: getFileContents(path.join(root, '.npmignore'))
    })
  })
})
