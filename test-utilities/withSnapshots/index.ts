import {curry} from 'ramda'
import * as path from 'path'
import * as fs from 'fs'
import * as riteway from 'riteway'
require('colors')
const colors = require('colors/safe')

require.extensions['.snap'] = require.extensions['.js']

const UPDATE_SNAPSHOT_MESSAGE = colors.bold.red(
  `
######################################################################
#                                                                    #
#  Snapshot failed. Run with UPDATE_SNAPSHOTS=1 to update snapshots. #
#                                                                    #
######################################################################

`
)

const SNAPSHOT_NEWLINE = '\n\n'

function escapeQuotes(str) {
  return str.replace(/\\([\s\S])|(`)/g, `\\$1$2`)
}

const updateSnapshot = (snapshotPath, name, snap) => {
  const startLine = `module.exports[\`${name}\`] = \`${SNAPSHOT_NEWLINE}`
  const endLine = '`'
  const escapedSnap = escapeQuotes(snap)
  if (!fs.existsSync(snapshotPath)) fs.writeFileSync(snapshotPath, '')
  const snapFile = fs.readFileSync(snapshotPath, {encoding: 'utf-8'})
  const updatedSnap =
    snapFile.search(startLine) > -1
      ? snapFile.replace(
          new RegExp(`${startLine}(.*?)${endLine}`),
          `${startLine}${escapedSnap}${endLine}`
        )
      : snapFile + `${startLine}${escapedSnap}${endLine}` + '\n\n'
  fs.writeFileSync(snapshotPath, updatedSnap)
  return {
    expected: snap,
    actual: snap
  }
}

const toMatchSnapshot = curry((snapshotDir, snapshotPath, name, contents) => {
  const shouldUpdateSnapshots = process.env.UPDATE_SNAPSHOTS
  if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir)

  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/, '')
  }

  const actual =
    typeof contents !== 'string' ? JSON.stringify(contents, null, 2) : contents

  if (!fs.existsSync(snapshotPath)) {
    if (shouldUpdateSnapshots) return updateSnapshot(snapshotPath, name, actual)
    else
      console.error(
        colors.bold.red(`
      
      Snapshot does not exist yet. ${UPDATE_SNAPSHOT_MESSAGE}
      
      `)
      )
    return {
      actual,
      expected: ''
    }
  }

  const expectedModule = require(snapshotPath)[name]
  const expected =
    typeof expectedModule === 'string'
      ? expectedModule.replace(SNAPSHOT_NEWLINE, '') // replace first line-break
      : expectedModule

  if (actual !== expected) {
    if (shouldUpdateSnapshots) {
      return updateSnapshot(snapshotPath, name, actual)
    } else {
      console.error(
        colors.bold.black(
          '\n\n-----------------------------------------------------------------\n\n'
        )
      )
      console.error(UPDATE_SNAPSHOT_MESSAGE)
      console.error(colors.bold.red('\n\n•••• EXPECTED ••••\n\n'))
      console.error(colors.bold.red(expected))
      console.error(colors.bold.green('\n\n•••• ACTUAL ••••\n\n'))
      console.error(colors.bold.green(actual))
      console.error(colors.bold.red('\n\n•••• DIFF ••••\n\n'))
      const diff = require('diff').diffChars(expected, actual)

      diff.forEach(function(part) {
        // green for additions, red for deletions
        // grey for common parts
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey'
        process.stderr.write(part.value[color])
      })

      console.error(
        colors.bold.black(
          '\n\n-----------------------------------------------------------------\n\n'
        )
      )

      console.log()
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

export const withSnapshots = (
  filename: string,
  snapshotDirectory: string = 'snapshots'
) => (describeMessage, callback) => {
  const fileDirectory: string = path.dirname(filename)
  const fileBasename = path.basename(filename)
  const snapshotDir = path.join(fileDirectory, snapshotDirectory)
  const snapshotPath = path.join(snapshotDir, `${fileBasename}.snap`)

  // TODO: Make snapshot update function update a specific section of a snapshot, so we don't have to delete the entire file on update.
  process.env.UPDATE_SNAPSHOTS &&
    fs.existsSync(snapshotPath) &&
    fs.unlinkSync(snapshotPath)

  const matchByName = toMatchSnapshot(snapshotDir, snapshotPath)

  const describeFunc = riteway.describe
  if (typeof describeFunc === 'function') {
    describeFunc(describeMessage, async assert => {
      try {
        const assertOrSnap = ({given, should, actual, expected, snap}) => {
          if (snap) {
            const name = `Describe ${describeMessage} | Given ${given}: should ${should}`
            const results = matchByName(name, snap)
            assert({
              given,
              should,
              ...results
            })
          } else {
            assert({
              given,
              should,
              expected,
              actual
            })
          }
        }
        await callback(assertOrSnap)
      } catch (e) {
        throw e
      }
    })
  }
}
