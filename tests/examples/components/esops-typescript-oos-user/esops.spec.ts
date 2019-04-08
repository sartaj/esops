import * as path from 'path'
import * as prompts from 'prompts'

import esops from '../../../../interfaces/main'
import {getFileContents, getSortedFilePaths} from '../../../test-utils/fs-utils'
import {withSnapshots} from '../../../test-utils/withSnapshots'
import {withTempDir} from '../../../test-utils/withTempDir'

const describe = withSnapshots(__filename)

const rootPath = path.join(__dirname, './module')

describe('esops typescript open source module user', async assert => {
  await withTempDir(__dirname, rootPath, async root => {
    await esops({
      root: path.join(root, 'infrastructure'),
      logLevel: 'error'
    })

    await assert({
      given: 'different destination in root esops config',
      should: 'generate appropriate files',
      snap: getSortedFilePaths(root)
    })

    await assert({
      given: 'different destination in root esops config',
      should: 'merge package.json',
      snap: getFileContents(path.join(root, 'package.json'))
    })

    await assert({
      given: 'different destination in root esops config',
      should: 'create proper .gitignore with manifest',
      snap: getFileContents(path.join(root, '.gitignore'))
    })
  })
})
