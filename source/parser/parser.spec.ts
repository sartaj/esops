import {parsedToGeneratorManifest, parseStack, resolve} from '.'
import {MOCK_STACKS, MOCK_TEMPLATES} from '../core/examples'
import {ParsedStack, LocalWithProps} from '../core/types'
import * as path from 'path'

import {withSnapshots} from '../../test-utils/withSnapshots'
import {
  scrubAbsolutePathFromString,
  prettyJSON
} from '../../test-utils/fs-utils'

const describe = withSnapshots(__filename)

describe('parseStack()', async assert => {
  const stack = {cwd: MOCK_STACKS['mergeable-file-cwd-override']}
  const actual = await parseStack(stack)
  const snap = scrubAbsolutePathFromString(prettyJSON(actual), stack.cwd)
  assert({
    given: 'single FS path',
    should: 'return fs path as LocalOptionWithProps',
    snap
  })
})

describe('parsedToGeneratorManifest()', async assert => {
  const expectedRelativePaths = [
    '.vscode/settings.json',
    'src/stores/stores-architecture.md',
    'tsconfig.json'
  ]

  const config = {cwd: MOCK_TEMPLATES.basic}
  const resolved = await resolve('./', config)
  const parsed = parsedToGeneratorManifest(resolved, config)

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

describe('resolver()', async assert => {
  const config = {
    cwd: MOCK_STACKS['basic-ignore-files']
  }

  assert({
    given: 'single FS path',
    should: 'return fs path as LocalOptionWithProps',
    expected: [[config.cwd + '/', {}]],
    actual: await resolve('./', config)
  })

  assert({
    given: 'single FS path as array',
    should: 'return fs path as LocalOptionWithProps',
    expected: [[config.cwd + '/', {}]],
    actual: await resolve(['./'], config)
  })

  assert({
    given: 'single FS path with props',
    should: 'return fs path as LocalOptionWithProps',
    expected: [[config.cwd + '/', {}]],
    actual: await resolve([['./', {}]], config)
  })
})
