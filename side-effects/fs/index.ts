import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs'
import {listTreeSync, copySync} from 'fs-plus'
import {copy} from 'fs-jetpack'
import * as readPkg from 'read-pkg'
import {createResolver} from './resolver'
import {createAppCache} from './app-cache'

export default () => ({
  // main esops fs effects
  appCache: createAppCache(),
  resolver: createResolver(),
  updateGeneratedTextFs: require('update-generated-text-fs'),
  forceCopy: (from, to) => {
    copy(from, to, {overwrite: true})
  },
  // npm
  resolvePkg: require('resolve-pkg'),

  // root fs
  mkdirp: require('mkdirp'),
  listTreeSync,
  copySync,
  readFileSync,
  writeFileSync,
  readPkg,
  existsSync,
  mkdirSync
})
