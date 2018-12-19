import {describe} from 'riteway'
import * as path from 'path'
import * as R from 'ramda'
import parser from './index'
import resolver from '../resolver'

import {MOCK_STACKS} from '../core/examples'

const keyValueExists = (key, value, list) =>
  R.pipe(
    R.find(R.propEq(key, value)),
    R.isEmpty,
    R.not
  )(list)

// /**
//  * Specifications
//  */

describe('parser()', async assert => {
  const expectedRelativePaths = [
    '.vscode/settings.json',
    'src/stores',
    'src/stores/stores-architecture.md',
    'tsconfig.json',
    '.eslintrc',
    '.vscode/settings.json',
    'package.json',
    'scripts/copy-files.js'
  ]

  const config = {cwd: MOCK_STACKS.basic}
  const localOptions = await resolver('./', config)
  const actual = parser(localOptions, config)

  expectedRelativePaths.forEach(relativePath => {
    assert({
      given: `${relativePath} in  ${path.basename(config.cwd)}`,
      should: 'exist',
      expected: true,
      actual: keyValueExists('relativePath', relativePath, actual)
    })
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
