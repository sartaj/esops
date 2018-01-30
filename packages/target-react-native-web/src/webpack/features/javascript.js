/* eslint-disable import/prefer-default-export */
const babelConfig = require('@esops/language-babel')()

export const rules = {
  test: /\.jsx?$/,
  loader: 'babel-loader',
  query: {
    babelrc: false,
    compact: false,
    ...babelConfig
  }
}
