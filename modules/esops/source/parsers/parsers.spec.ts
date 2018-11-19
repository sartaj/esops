// import test from 'tape'
// import fs from 'fs-plus'
// import path from 'path'
// import rimraf from 'rimraf'
// import R from 'ramda'
// import parsers from './index'
// import resolvers from '../resolvers'

// const examplesDir = path.join(__dirname, '../../specifications/examples')

// const MOCK_INFRASTRUCTURES = {
//   basic: path.join(examplesDir, 'templates', 'basic'),
//   'pipe-me': path.join(examplesDir, 'templates', 'pipe-me'),
//   'target-web': path.join(examplesDir, 'templates', 'target-web')
// }

// const MOCK_STACKS = {
//   basic: path.join(examplesDir, 'stacks', 'basic'),
//   disallowed: path.join(examplesDir, 'stacks', 'disallowed')
// }

// /**
//  * Utilities
//  */
// const withTempFolder = callback => t => {
//   const dirname = __dirname + '/.tmp/'
//   if (!fs.existsSync(dirname)) fs.mkdirSync(dirname)
//   callback({t, dirname})
//   rimraf.sync(dirname, fs)
// }

// const keyValueExists = (key, value, list) =>
//   R.pipe(
//     R.find(R.propEq(key, value)),
//     R.isEmpty,
//     R.not
//   )(list)

// /**
//  * Specifications
//  */

// test('create patch list from stack manifest', async t => {
//   const expectedRelativePaths = [
//     '.vscode/settings.json',
//     'src/stores',
//     'src/stores/stores-architecture.md',
//     'tsconfig.json',
//     '.eslintrc',
//     '.vscode/settings.json',
//     'package.json',
//     'scripts/copy-files.js'
//   ]

//   t.plan(expectedRelativePaths.length)

//   const stackConfig = resolvers.findStackDefinition(MOCK_STACKS.basic)
//   const stack = resolvers.findStackDefinition(MOCK_STACKS.basic)

//   console.log(stackConfig)
//   const stackPaths = resolvers.getStackFilePaths(MOCK_STACKS.basic)
//   const outputDir = '/Users/test/repo'
//   const opts = {
//     paths: {
//       stackDir: MOCK_STACKS.basic,
//       stackPaths,
//       outputDir
//     }
//   }
//   const actual = parsers.convertStackToPatchList(opts)
//   expectedRelativePaths.forEach(relativePath => {
//     t.true(keyValueExists('relativePath', relativePath, actual))
//   })
// })

// test('check for disallowed duplicate files', async t => {
//   const tests = [[MOCK_STACKS.disallowed, false], [MOCK_STACKS.basic, true]]

//   t.plan(tests.length)
//   tests.forEach(async ([stack, expected], i) => {
//     const stackConfig = parsers.resolveStackCompose(stack)
//     const patchList = await parsers.convertStackComposeToPatchList(
//       stackConfig,
//       stack
//     )
//     const actual = parsers.validatePatchList(patchList)
//     t.equals(actual, expected, path.basename(stack))
//   })
// })

// test(
//   'test render',
//   withTempFolder(({t, dirname}) => {
//     t.plan(1)
//     const infrastructureDirectory = MOCK_INFRASTRUCTURES.basic
//     fs.copySync(infrastructureDirectory, dirname)
//     const props = {}
//     // const actual = parsers.render(dirname, infrastructureDirectory, props);
//     t.equal(true, true)
//   })
// )
