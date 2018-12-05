import fsPlus from 'fs-plus'

export default {
  createTempFolder: () => null,
  forceCopy: () => null,
  readPkg: require('read-pkg'),
  ...fsPlus
}
