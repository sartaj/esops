import * as path from 'path'

import esops from '../../library'
import {getFileContents} from '../../test-utilities/fs-utils'
import {withSnapshots} from '../../test-utilities/withSnapshots'
import {withTempDir} from '../../test-utilities/withTempDir'

const describe = withSnapshots(__filename)

const rootPath = path.join(__dirname, './module')

describe('esops() override features', async assert => {
  await withTempDir(__dirname, rootPath, async root => {
    await esops({root, prompts: [false]})
    await assert({
      given: 'no to override',
      should: 'not override files',
      snap: getFileContents(path.join(root, 'tsconfig.json'))
    })
  })

  await withTempDir(__dirname, rootPath, async root => {
    await esops({root, prompts: [true]})
    await assert({
      given: 'yes to override',
      should: 'override files',
      snap: getFileContents(path.join(root, 'tsconfig.json'))
    })
  })

  await withTempDir(__dirname, rootPath, async root => {
    await esops({root, prompts: [new Error()]})
    await assert({
      given: 'canceling prompt to override',
      should: 'not override files',
      snap: getFileContents(path.join(root, 'tsconfig.json'))
    })
  })
})