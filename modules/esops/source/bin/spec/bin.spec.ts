import * as path from 'path'
import rimraf from 'rimraf'
import describe from './withSnapshot.spec'
import esops from '../index'
import fs from '../../drivers/fs'

const examplesDir = path.join(__dirname, '../core/examples')

// const MOCK_TEMPLATES = {
//   basic: path.join(examplesDir, 'templates', 'basic'),
//   'pipe-me': path.join(examplesDir, 'templates', 'pipe-me'),
//   'target-web': path.join(examplesDir, 'templates', 'target-web')
// }

const MOCK_PACKAGES = {
  basic: path.join(examplesDir, 'packages', 'basic'),
  disallowed: path.join(examplesDir, 'packages', 'disallowed')
}

describe('esops()', async assert => {
  assert({
    given: 'a basic package',
    expected: 'basic copying',
    snap: await runTest(MOCK_PACKAGES.basic)
  })
})

async function runTest(cwd) {
  const tempDir = __dirname + '/.tmp/'
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
  fs.copySync(cwd, tempDir)
  process.chdir(tempDir)
  await esops()
  const actual = fs.listTreeSync(cwd).sort()
  rimraf.sync(tempDir, fs)
  return actual
}
