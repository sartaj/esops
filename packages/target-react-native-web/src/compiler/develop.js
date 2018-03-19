/* eslint-disable no-console */

import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import log from '@esops/logger'

export const configDevMiddleware = ({ app, config, cwd, publicPath }) => {
  const compiler = webpack(config)
  const middleware = webpackMiddleware(compiler, {
    publicPath: publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  })

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))
  app.use(express.static(config.output.path))
  console.log(middleware.fileSystem.publicPath)
  app.get('*', (req, res) => {
    res.write(
      middleware.fileSystem.readFileSync(
        path.join(config.output.path, 'index.html')
      )
    )
    res.end()
  })
}

export default async function start(
  webpackConfig,
  { port, devMode, cwd, publicPath }
) {
  const config = webpackConfig
  console.log('config', config.output.path)
  const app = express()

  configDevMiddleware({ app, config, cwd, publicPath })

  return new Promise((resolve, reject) => {
    app.listen(port, 'localhost', err => {
      if (err) log.error(err)
      else {
        resolve(publicPath)
        // carlton()
        // log.announce(serverBox(port))
      }
    })
  })
}
