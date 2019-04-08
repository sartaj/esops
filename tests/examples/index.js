const path = require('path')

const examplesDir = __dirname

module.exports.MOCK_TEMPLATES = {
  basic: path.join(examplesDir, 'templates', 'basic'),
  'pipe-me': path.join(examplesDir, 'templates', 'pipe-me'),
  'target-web': path.join(examplesDir, 'templates', 'target-web')
}

module.exports.MOCK_COMPONENTS = [
'basic-bare-minimum',
'basic-ignore-files',
'basic-local-overwrite',
'esops-typescript-oos-user',
'esops-typescript-open-source-module'
].reduce((mockComponents, next) => ({ ...mockComponents, [next]: path.join(examplesDir, 'components', next, 'module')}), {})

const MOCK_STACKS = [
  'basic',  
  'basic-ignore-files',
  'basic-package-json',
  'basic-node-module',
  'basic-bad-path',
  'basic-bad-config',
  'basic-bad-json',
  'basic-no-config',
  'basic-overwrite-cwd-file',
  'extendable-file',
  'github-url',
  'basic-ts-node'
].reduce((mockStacks, next) => ({ ...mockStacks, [next]: path.join(examplesDir, 'packages', next)}), {})

module.exports.MOCK_STACKS = MOCK_STACKS