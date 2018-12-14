import fsPlus from 'fs-plus'
import {existsSync} from 'fs'

export default {
  createTempFolder: () => null,
  forceCopy: () => null,
  readPkg: require('read-pkg'),
  resolvePkg: require('resolve-pkg'),
  ...fsPlus,
  existsSync
}
