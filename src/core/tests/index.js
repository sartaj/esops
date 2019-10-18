const path = require('path')

const examplesDir = __dirname

module.exports.MOCK_COMPONENTS = [
'basic-bare-minimum',
'basic-ignore-files',
'basic-local-overwrite',
'esops-typescript-oos-user',
'problem-bad-path',
'problem-bad-config',
'problem-bad-json',
'problem-no-config'
].reduce((mockComponents, next) => ({ ...mockComponents, [next]: path.join(examplesDir, next, 'module')}), {})

