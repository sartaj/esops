import * as rimraf from 'rimraf'
import {copy} from 'fs-jetpack'
import * as fs from 'fs'
import * as path from 'path'
import {curry, isNil, not} from 'ramda'

export const withTempDir = curry(
  async (dir, initialFiles: string | [], callback) => {
    try {
      const initialFilesReceived = not(isNil(initialFiles))

      const tempPath = path.join(dir, '/.tmp/')

      async function before() {
        try {
          rimraf.sync(tempPath, fs)
          if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath)
          if (initialFilesReceived) {
            const copyPaths =
              typeof initialFiles === 'string' ? [initialFiles] : initialFiles
            copyPaths.forEach(from => {
              copy(from, tempPath, {overwrite: true})
            })
          }
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
      console.error(e)
      process.exit(1)
    }
  }
)
