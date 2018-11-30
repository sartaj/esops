import R from 'ramda'
import fs from 'fs'

const deepMerge = R.curry(R.deepMergeLeft)

const installDrivers = deepMerge({
  drivers: {
    fs: {
      createTempFolder: () => null,
      forceCopy: () => null,
      readFile: fs.readFile
      // readTree: fs.readFile
    },
    logger: console.log,
    process
    // http
  }
})

export default installDrivers
