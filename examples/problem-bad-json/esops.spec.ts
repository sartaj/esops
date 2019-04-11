import * as path from 'path'
import {Try} from 'riteway'

import esops from '../../'
import {cleanErrorString} from '../../tests/test-utils/fs-utils'
import {withSnapshots} from '../../tests/test-utils/withSnapshots'
import {withTempDir} from '../../tests/test-utils/withTempDir'

const rootPath = path.join(__dirname, './module')

const describe = withSnapshots(__filename)

describe('esops() bad json', async assert => {
  await withTempDir(__dirname, rootPath, async root => {
    const snap = cleanErrorString(root)(await Try(esops, {root}))
    await assert({
      given: 'non parseable',
      should: 'throw a friendly error',
      snap
    })
  })
})
