/* eslint-disable no-console */

import webpack from 'webpack'

export default async config => {
  const compiler = webpack(config)
  return new Promise((resolve, reject) => {
    compiler.run(err => {
      if (err) reject(err)
      resolve()
    })
  })
}
