import * as path from 'path'
import rimraf from 'rimraf'
// import describe from './spec/withSnapshot.spec'
import esops from './index'
import fs from '../drivers/fs'

import {MOCK_STACKS} from '../core/examples'

// describe('esops-cli', async assert => {
//   assert({
//     given: 'a basic package',
//     expected: 'basic copying',
//     snap: await runTest(MOCK_PACKAGES.basic)
//   })
// })

runTest(MOCK_STACKS.basic)

async function runTest(cwd) {
  const tempDir = __dirname + '/.tmp/'
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
  fs.copySync(cwd, tempDir)
  process.chdir(tempDir)
  await esops()
  // const actual = fs.listTreeSync(cwd).sort()
  // rimraf.sync(tempDir, fs)
  // return actual
}
