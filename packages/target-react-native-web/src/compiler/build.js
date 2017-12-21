/* eslint-disable no-console */

import webpack from 'webpack'

export default async (config) => {
  const compiler = webpack(config)
  compiler.run((err) => {
    if (err) console.error(err)
  })
}
