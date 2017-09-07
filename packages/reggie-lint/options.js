var path = require('path')
var pkg = require('./package.json')
var eslint = require('eslint')

module.exports = {
  cmd: pkg.name,
  version: pkg.version,
  homepage: pkg.homepage,
  bugs: pkg.bugs.url,
  tagline: pkg.description,
  eslintConfig: {
    configFile: path.join(__dirname, 'eslintrc.json')
  },
  eslint: eslint
}
