/* eslint-disable import/prefer-default-export */
const esopsP = require('@esops/language-babel/plugins')

export const rules = {
  test: /\.jsx?$/,
  loader: 'babel-loader',
  query: {
    babelrc: false,
    compact: false,
    presets: [require.resolve('@esops/language-babel/presets')],
    plugins: [...esopsP, require.resolve('babel-plugin-react-native-web')]
  }
}
