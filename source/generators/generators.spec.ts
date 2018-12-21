import {describe} from 'riteway'
import * as path from 'path'
import * as R from 'ramda'
import resolver from '../resolver'
import parser from '../parser'
import generator from './index'

import {MOCK_TEMPLATES} from '../core/examples'

// describe('generator()', async assert => {
//   const config = {cwd: MOCK_TEMPLATES.basic}
//   const resolved = await resolver('./', config)
//   const parsed = parser(resolved, config)
//   // generator(parsed)
//   assert({
//     given: '',
//     should: ``,
//     expected: true,
//     actual: true
//   })
// })
