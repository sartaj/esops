/* eslint-disable no-console */

import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

export const configDevMiddleware = (app, config, opts) => {
  const compiler = webpack(config)
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
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
  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(opts.buildPath, 'index.html')))
    res.end()
  })
}

export const configDeployedMiddleware = (app, opts) => {
  app.use(express.static(opts.buildPath))
  app.get('*', (req, res) => {
    res.sendFile(path.join(opts.buildPath, 'index.html'))
  })
}

const serverListeningTemplate = port => (`

===========================================================
             🌎  Your dev environment is live! 🌎
                   http://localhost:${port}
            Please open this link in your browser 
               to begin initial webpack build.
===========================================================
`)

export default function start (opts, webpackConfig) {
  const { port } = opts
  const config = webpackConfig
  const isDeveloping = opts.devMode

  const app = express()

  if (isDeveloping) configDevMiddleware(app, config, opts)
  else configDeployedMiddleware(app, opts)

  app.listen(port, 'localhost', (err) => {
    if (err) console.error(err)
    else console.log(serverListeningTemplate(port))
  })
  return app
}
