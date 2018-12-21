var tape = require('tape')
var compareToSnapshot = require('snapshotter')

const withSnapshot = tape => {
  const describe = (description, callback) => {
    tape(description, t => {
      const assert = ({given, should, snap}) => {
        compareToSnapshot(t, snap, `Given ${given}: should ${should}`)
      }
      callback(assert)
    })
  }
  return describe
}

const describe = withSnapshot(tape)

export default describe
