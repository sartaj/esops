module.exports = {
  // TODO: Add babel-preset-react-native as soon as it updates to Babel 7
  presets: [
    require.resolve('@babel/preset-flow'),
    require.resolve('@babel/preset-react'),
    [require.resolve('@babel/preset-stage-0'), { decoratorsLegacy: true }]
  ],
  plugins: ['@babel/plugin-proposal-pipeline-operator'].map(require.resolve)
}
