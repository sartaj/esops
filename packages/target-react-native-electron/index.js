const target = require('@esops/target-react-native-web').default
const { spawn } = require('child_process')

module.exports = async opts => {
  await target(opts)
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
}
