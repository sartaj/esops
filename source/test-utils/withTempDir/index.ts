import * as path from 'path'
import * as rimraf from 'rimraf'
import fs from '../../drivers/fs'
import {curry} from 'ramda'

export const withTempDir = curry(async (dir, initialFiles, callback) => {
  const tempPath = path.join(dir, '/.tmp/')

  async function before() {
    rimraf.sync(tempPath, fs)
    if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath)
    if (initialFiles) fs.forceCopy(initialFiles, tempPath)
  }

  async function after() {
    rimraf.sync(tempPath, fs)
  }
  await before()
  await callback(tempPath)
  await after()
})
