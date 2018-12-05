import {describe} from 'riteway'
import * as resolver from './'

// import fs from 'fs'
// import rimraf from 'rimraf'
// import R from 'ramda'

describe('resolver.resolve()', async assert => {
  const expected = {
    cwd: '/foo/bar',
    opts: '/baz/pro/shop'
  }

  assert({
    given: 'no parameters',
    should: 'return same shape',
    expected,
    actual: await resolver.resolve(expected)
  })
})

// const examplesDir = path.join(__dirname, '../core/examples')

// const MOCK_INFRASTRUCTURES = {
//   basic: path.join(examplesDir, 'templates', 'basic'),
//   'pipe-me': path.join(examplesDir, 'templates', 'pipe-me'),
//   'target-web': path.join(examplesDir, 'templates', 'target-web')
// }

// const MOCK_STACKS = {
//   basic: path.join(examplesDir, 'stacks', 'basic'),
//   disallowed: path.join(examplesDir, 'stacks', 'disallowed')
// }

/**
 * Utilities
 */
// const withTempFolder = callback => t => {
//   const dirname = __dirname + '/.tmp/'
//   if (!fs.existsSync(dirname)) fs.mkdirSync(dirname)
//   callback({t, dirname})
//   rimraf.sync(dirname, fs)
// }

// const keyValueExists = (key, value, list) =>
//   R.pipe(
//     R.find(R.propEq(key, value)),
//     R.isEmpty,
//     R.not
//   )(list)

/**
 * Specifications
 */

// test('resolve stack manifest', t => {
//   t.plan(1)
//   const actual = resolvers.findStackDefinition(MOCK_STACKS.basic)
//   const expected = [
//     '../../templates/basic',
//     '../../templates/basic-with-package'
//   ]
//   t.deepEquals(actual, expected)
// })

// test('get list of paths from template directory', t => {
//   t.plan(1)
//   const templateDirectory = MOCK_INFRASTRUCTURES.basic
//   const actual = resolvers.findStackDefinition(templateDirectory)
//   const expected = [
//     path.join(templateDirectory, '.vscode/settings.json'),
//     path.join(templateDirectory, 'src/stores/stores-architecture.md'),
//     path.join(templateDirectory, 'tsconfig.json')
//   ]
//   t.deepEqual(actual, expected)
// })
