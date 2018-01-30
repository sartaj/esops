module.exports = () => ({
  presets: [require.resolve("babel-preset-react-native")],
  plugins: [
    require.resolve("babel-plugin-react-native-web"),
    require.resolve("babel-plugin-transform-decorators-legacy")
  ]
});
