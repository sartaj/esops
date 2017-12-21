import nodeExternals from 'webpack-node-externals'

export default () => ({
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()] // in order to ignore all modules in node_modules folder
})
