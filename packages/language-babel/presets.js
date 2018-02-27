module.exports = () => ({
  presets: ['react-native'],
  plugins: [
    'babel-plugin-transform-decorators-legacy',
    '@babel/plugin-transform-pipeline-operator'
  ]
})
