import {describe} from 'riteway'
import * as path from 'path'
import * as R from 'ramda'
import parser from './index'
import resolver from '../resolver'

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

describe('parser()', async assert => {
  const expectedRelativePaths = [
    '.vscode/settings.json',
    'src/stores/stores-architecture.md',
    'tsconfig.json'
  ]

  const config = {cwd: MOCK_TEMPLATES.basic}
  const resolved = await resolver('./', config)
  const parsed = parser(resolved, config)

  assert({
    given: path.basename(config.cwd),
    should: `have expected length of ${expectedRelativePaths.length}`,
    expected: expectedRelativePaths.length,
    actual: parsed.length
  })

  parsed.forEach(manifest => {
    assert({
      given: `${manifest.relativePath} in  ${path.basename(config.cwd)}`,
      should: 'exist',
      expected: true,
      actual: expectedRelativePaths.indexOf(manifest.relativePath) > -1
    })

    assert({
      given: `${manifest.relativePath}`,
      should: 'have cwd',
      expected: MOCK_TEMPLATES.basic,
      actual: manifest.outputDir
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
