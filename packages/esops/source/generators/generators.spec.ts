import {describe} from 'riteway'
import * as path from 'path'
import * as R from 'ramda'
import resolver from '../resolver'
import parser from '../parser'
import generator from './index'

import {MOCK_TEMPLATES} from '../core/examples'

const keyValueExists = (key, value, list) =>
  R.pipe(
    R.find(R.propEq(key, value)),
    R.isEmpty,
    R.not
  )(list)

// /**
//  * Specifications
//  */

describe('generator()', async assert => {
  const expectedRelativePaths = [
    '.vscode/settings.json',
    'src/stores/stores-architecture.md',
    'tsconfig.json'
  ]

  const config = {cwd: MOCK_TEMPLATES.basic}
  const resolved = await resolver('./', config)
  const parsed = parser(resolved, config)
  generator(parsed)
  assert({
    given: '',
    should: ``,
    expected: true,
    actual: true
  })
})

// test(
//   'test render',
//   withTempFolder(({t, dirname}) => {
//     t.plan(1)
//     const infrastructureDirectory = MOCK_INFRASTRUCTURES.basic
//     fs.copySync(infrastructureDirectory, dirname)
//     const props = {}
//     // const actual = parsers.render(dirname, infrastructureDirectory, props);
//     t.equal(true, true)
//   })
// )
