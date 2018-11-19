import R from 'ramda'
import fs from 'fs'

const deepMerge = R.curry(R.deepMergeLeft)

const installDrivers = deepMerge({
  drivers: {
    fs,
    logger: console.log
  }
})

export default installDrivers
