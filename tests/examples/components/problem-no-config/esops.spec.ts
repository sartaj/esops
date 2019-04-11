import * as path from 'path'

import {Try} from 'riteway'
import {withSnapshots} from '../../../test-utils/withSnapshots'
import {withTempDir} from '../../../test-utils/withTempDir'
import {cleanErrorString} from '../../../test-utils/fs-utils'

import esops from '../../../../library'
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
