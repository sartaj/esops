import {curry} from 'ramda'
import * as path from 'path'
import * as fs from 'fs'
import * as riteway from 'riteway'
import {unique} from 'shorthash'

const toMatchSnapshot = curry((snapshotDir, name, contents) => {
  const uniqueName = unique(name)
  const fileHeader = `___SNAPSHOT___ ${name} ___\n\n`
  const shouldUpdateSnapshots = process.env.UPDATE_SNAPSHOTS
  const snapshotPath = path.join(snapshotDir, `${uniqueName}.snap`)

  const updateSnapshot = actual => {
    fs.writeFileSync(snapshotPath, fileHeader + actual)
    console.log(`snapshot ${name} has been updated`)
    return {
      expected: actual,
      actual
    }
  }

  if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir)

  const actual =
    typeof contents !== 'string' ? JSON.stringify(contents, null, 2) : contents

  if (!fs.existsSync(snapshotPath)) {
    if (shouldUpdateSnapshots) return updateSnapshot(actual)
    else
      throw new Error(
        'Snapshot does not exist yet. Run with UPDATE_SNAPSHOTS=1 to update snapshots.'
      )
  }

  const expected = fs
    .readFileSync(snapshotPath, {encoding: 'utf-8'})
    .replace(fileHeader, '')

  if (actual !== expected) {
    if (shouldUpdateSnapshots) {
      return updateSnapshot(actual)
    } else {
      return {
        actual,
        expected
      }
    }
  } else {
    return {
      actual,
      expected
    }
  }
})

export const withSnapshots = curry(
  (cwd: string | null, dirname: string | null, describeMessage, callback) => {
    const dirPath: string = cwd || process.cwd()
    const snapshotDirname: string = dirname || 'snapshots'
    const snapshotDir = path.join(dirPath, snapshotDirname)
    const matchByName = toMatchSnapshot(snapshotDir)

    const describeFunc = riteway.describe
    if (typeof describeFunc === 'function') {
      describeFunc(describeMessage, async assert => {
        const assertSnap = ({given, should, snap}) => {
          const name = `Describe ${describeMessage} | Given ${given}: should ${should}`

          assert({
            given,
            should,
            ...matchByName(name, snap)
          })
        }
        callback(assert, assertSnap)
      })
    }
  }
)
