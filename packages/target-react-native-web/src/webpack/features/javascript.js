/* eslint-disable import/prefer-default-export */

export const rules = {
  test: /\.jsx?$/,
  loader: 'babel-loader',
  query: {
    babelrc: false,
    compact: false,
    presets: [require.resolve('@esops/language-babel/preset')],
    plugins: [require.resolve('babel-plugin-react-native-web')]
  }
}
