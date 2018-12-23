import {curry} from 'ramda'
import * as path from 'path'
import * as fs from 'fs'
import * as riteway from 'riteway'

const updateSnapshot = (name, snapshotPath, actual) => {
  fs.writeFileSync(snapshotPath, actual)
  console.log(`snapshot ${name} has been updated`)
  return {
    expected: actual,
    actual
  }
}

const toMatchSnapshot = curry((snapshotDir, name, contents) => {
  const shouldUpdateSnapshots = process.env.UPDATE_SNAPSHOTS
  const snapshotPath = path.join(snapshotDir, `${name}.snap`)

  if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir)

  const actual =
    typeof contents !== 'string' ? JSON.stringify(contents, null, 2) : contents

  if (!fs.existsSync(snapshotPath)) {
    if (shouldUpdateSnapshots) return updateSnapshot(name, snapshotPath, actual)
    else
      throw new Error(
        'Snapshot does not exist yet. Run with UPDATE_SNAPSHOTS=1 to update snapshots.'
      )
  }

  const expected = fs.readFileSync(snapshotPath, {encoding: 'utf-8'})

  if (actual !== expected) {
    if (shouldUpdateSnapshots) {
      return updateSnapshot(name, snapshotPath, actual)
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

function hashCode(str) {
  return str
    .split('')
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0
    )
}

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
          const name = `${describeMessage}-${hashCode(
            describeMessage + given + should
          )}`

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
