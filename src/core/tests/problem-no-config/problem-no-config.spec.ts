import * as path from 'path'
import {Try} from 'riteway'

import esops from '../../../'
import {cleanErrorString} from 'riteway-fs-snapshots/fs-utils'
import {withSnapshots} from 'riteway-fs-snapshots/withSnapshots'
import {withTempDir} from 'riteway-fs-snapshots/withTempDir'

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
