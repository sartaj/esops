// const path = require('path')
// const reactNativeWeb = require('@esops/target-react-native-web')
// const reactNativeElectron = require('@esops/target-react-native-electron')

// // eslint-disable-next-line
// module.exports = {
//   name: 'desktop',
//   run: async context => {
//     const { parameters, cwd } = context
//     const distribution = {
//       devMode: false,
//       buildPath: path.join(cwd, './.esops/target/desktop/dist')
//     }
//     switch (parameters.first) {
//       case 'dev':
//         await reactNativeWeb({ devMode: true, cwd })
//         await reactNativeElectron(distribution)
//         break
//       case 'build':
//         await nativeWeb(distribution)
//         break
//       case 'ship':
//         console.warn(
//           'esops desktop currently does not have a desktop publisher. Watch our GitHub to see updates.'
//         )
//         break
//       case 'help':
//       default:
//         console.log('for esops web static, available commands are help and web')
//     }
//   }
// }
