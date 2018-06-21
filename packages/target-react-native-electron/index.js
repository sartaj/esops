const target = require('@esops/target-react-native-web').default
const createWebpackConfig = require('./webpack.dev.electron-renderer')

const { spawn } = require('child_process')

// eslint-disable-next-line
module.exports = async opts => {
  const webpackConfig = createWebpackConfig(opts)
  const url = await target({
    webpackConfig,
    ...opts
  })
  spawn('npm', ['run', 'start-main-dev'], {
    shell: true,
    env: {
      ESOPS: JSON.stringify(opts),
      ...process.env
    },
    stdio: 'inherit',
    cwd: __dirname
  })
    .on('close', code => process.exit(0))
    .on('error', spawnError => console.error(spawnError))
  return url
}
