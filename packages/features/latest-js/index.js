/* eslint-disable import/prefer-default-export */

export const rules = {
  test: /\.jsx?$/,
  loader: 'babel-loader',
  query: {
    babelrc: false,
    compact: false,
    presets: [
      'env',
      'react',
      'flow',
    ].map(dep => require.resolve(`babel-preset-${dep}`)),
    plugins: [
      'syntax-dynamic-import',
    ].map(dep => require.resolve(`babel-plugin-${dep}`)),
  },
};

