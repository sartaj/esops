import * as path from 'path'
import * as spawn from 'await-spawn'

import {Try} from 'riteway'
import {withSnapshots} from '../../../test-utils/withSnapshots'
import {withTempDir} from '../../../test-utils/withTempDir'
import {cleanErrorString} from '../../../test-utils/fs-utils'

import esops from '../../../../library'
const rootPath = path.join(__dirname, './module')

const describe = withSnapshots(__filename)

describe('esops() bad config', async assert => {
  await withTempDir(__dirname, rootPath, async root => {
    const snap = cleanErrorString(root)(await Try(esops, {root}))
    await assert({
      given: 'an invalid config object',
      should: 'throw a friendly error',
      snap
    })
  })
})
