import * as path from 'path'
import * as rimraf from 'rimraf'
import {describe} from 'riteway'

import esops from './index'
import fs from '../drivers/fs'
import {MOCK_STACKS} from '../core/examples'

describe('run()', async assert => {
  assert({
    given:
      'a basic package with package.json config and available `.gitignore`',
    should: 'generate basic template in cwd',
    expected: [
      '.gitignore',
      '.vscode',
      '.vscode/settings.json',
      'esops.json',
      'infrastructure',
      'infrastructure/basic',
      'infrastructure/basic/.vscode',
      'infrastructure/basic/.vscode/settings.json',
      'infrastructure/basic/src',
      'infrastructure/basic/src/stores',
      'infrastructure/basic/src/stores/stores-architecture.md',
      'infrastructure/basic/tsconfig.json',
      'package.json',
      'src',
      'src/stores',
      'src/stores/stores-architecture.md',
      'tsconfig.json'
    ],
    actual: await runTest(MOCK_STACKS.basic)
  })
})

async function runTest(cwd) {
  const tempDir = __dirname + '/.tmp/'
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
  fs.forceCopy(cwd, tempDir)
  await esops({cwd: tempDir})
  const actual = fs
    .listTreeSync(tempDir)
    .sort()
    .map(abs => path.relative(tempDir, abs))
  rimraf.sync(tempDir, fs)
  return actual
}
