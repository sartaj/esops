import {existsSync, mkdirSync} from 'fs'
import {listTreeSync, copySync} from 'fs-plus'
import {copy} from 'fs-jetpack'
import * as readPkg from 'read-pkg'

export default {
  createTempFolder: () => null,
  readPkg,
  resolvePkg: require('resolve-pkg'),
  updateGeneratedTextFs: require('update-generated-text-fs'),
  existsSync,
  listTreeSync,
  mkdirSync,
  copySync,
  mkdirp: require('mkdirp'),
  forceCopy: (from, to) => {
    copy(from, to, {overwrite: true})
  }
}
