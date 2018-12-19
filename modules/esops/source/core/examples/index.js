const path = require('path')

const examplesDir = __dirname

module.exports.MOCK_TEMPLATES = {
  basic: path.join(examplesDir, 'templates', 'basic'),
  'pipe-me': path.join(examplesDir, 'templates', 'pipe-me'),
  'target-web': path.join(examplesDir, 'templates', 'target-web')
}

module.exports.MOCK_STACKS = {
  basic: path.join(examplesDir, 'packages', 'basic'),
  disallowed: path.join(examplesDir, 'packages', 'disallowed')
}