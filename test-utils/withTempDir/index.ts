import * as rimraf from 'rimraf'
import {copy} from 'fs-jetpack'
import * as fs from 'fs'
import * as path from 'path'
import {curry} from 'ramda'

export const withTempDir = curry(async (dir, initialFiles, callback) => {
  const tempPath = path.join(dir, '/.tmp/')

  async function before() {
    rimraf.sync(tempPath, fs)
    if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath)
    if (initialFiles) copy(initialFiles, tempPath, {overwrite: true})
  }

  async function after() {
    rimraf.sync(tempPath, fs)
  }
  await before()
  await callback(tempPath)
  await after()
})
