const webpack = require('@esops/target-react-native-web').default
const { spawn } = require('child_process')

module.exports = opts => {
  webpack(opts)

  console.log('Starting Main Process...')
  spawn('npm', ['run', 'start-main-dev'], {
    shell: true,
    cwd: __dirname,
    env: process.env,
    stdio: 'inherit'
  })
    .on('close', code => process.exit(code))
    .on('error', spawnError => console.error(spawnError))
}
