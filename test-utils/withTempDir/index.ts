import * as rimraf from 'rimraf'
import {copy} from 'fs-jetpack'
import * as fs from 'fs'
import * as path from 'path'
import {curry} from 'ramda'

export const withTempDir = curry(async (dir, initialFiles, callback) => {
  try {
    const tempPath = path.join(dir, '/.tmp/')

    async function before() {
      try {
        rimraf.sync(tempPath, fs)
        if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath)
        if (initialFiles) copy(initialFiles, tempPath, {overwrite: true})
      } catch (e) {
        throw e
      }
    }

    async function after() {
      try {
        rimraf.sync(tempPath, fs)
      } catch (e) {
        throw e
      }
    }
    await before()
    await callback(tempPath)
    await after()
  } catch (e) {
    throw e
  }
})
