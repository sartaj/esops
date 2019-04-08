import * as path from 'path'

import esops from '../../../../interfaces/main'
import {getFileContents} from '../../../test-utils/fs-utils'
import {withSnapshots} from '../../../test-utils/withSnapshots'
import {withTempDir} from '../../../test-utils/withTempDir'

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
