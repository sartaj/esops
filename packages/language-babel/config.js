module.exports = {
  // TODO: Add babel-preset-react-native as soon as it updates to Babel 7
  presets: [
    '@babel/preset-stage-0',
    '@babel/preset-flow',
    '@babel/preset-react'
  ].map(require.resolve),
  plugins: ['@babel/plugin-proposal-pipeline-operator'].map(require.resolve)
}
