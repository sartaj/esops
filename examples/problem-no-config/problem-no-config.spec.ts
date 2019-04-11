import * as path from 'path'
import {Try} from 'riteway'

import esops from '../../library'
import {cleanErrorString} from '../../test-utilities/fs-utils'
import {withSnapshots} from '../../test-utilities/withSnapshots'
import {withTempDir} from '../../test-utilities/withTempDir'

const rootPath = path.join(__dirname, './module')

const describe = withSnapshots(__filename)

describe('esops() no config found', async assert => {
  await withTempDir(__dirname, rootPath, async root => {
    const snap = cleanErrorString(root)(await Try(esops, {root}))
    await assert({
      given: 'no config found',
      should: 'provide a friendly message on how to use esops',
      snap
    })
  })
})
