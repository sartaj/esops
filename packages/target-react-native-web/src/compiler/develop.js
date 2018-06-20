/* eslint-disable no-console */

import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import log from '@esops/logger'

export const configDevMiddleware = ({ app, config, cwd, publicPath }) => {
  const compiler = webpack(config)
  const middleware = webpackDevMiddleware(compiler)

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))
  app.use(express.static(config.output.path))

  middleware.waitUntilValid(() => {
    app.get('*', (req, res) => {
      res.write(
        middleware.fileSystem.readFileSync(
          path.join(config.output.path, 'index.html')
        )
      )
      res.end()
    })
  })
}

export default async function start(
  webpackConfig,
  { port, devMode, cwd, publicPath }
) {
  const config = webpackConfig
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
