import {describe} from 'riteway'
import * as path from 'path'
import * as R from 'ramda'
import parser from './index'
import resolver from '../resolver-stack'

import {MOCK_TEMPLATES} from '../core/examples'

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
      actual: manifest.cwd
    })
  })
})
