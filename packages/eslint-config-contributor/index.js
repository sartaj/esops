const prettierRules = require('./prettier.config')

module.exports = {
  extends: [
    'standard',
    'standard-jsx',
    'plugin:flowtype/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:jest/recommended',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard'
  ],
  plugins: [
    'flowtype',
    'react',
    'react-native',
    'immutable',
    'prettier',
    'standard'
  ],
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true,
    jest: true
  },
  rules: {
    'immutable/no-let': 2,
    'immutable/no-this': 2,
    'immutable/no-mutation': 2,
    'operator-linebreak': ['error', 'before'],
    'prettier/prettier': 'error'
  }
}
