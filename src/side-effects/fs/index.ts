import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs'
import {listTreeSync, copySync} from 'fs-plus'
import {copy} from 'fs-jetpack'
import {createAppCache} from './app-cache'

export default () => ({
  // main esops fs effects
  appCache: createAppCache(),
  updateGeneratedTextFs: require('update-generated-text-fs'),
  forceCopy: (from, to) => {
    copy(from, to, {overwrite: true})
  },
  path: require('path'),
  listTreeSync,
  isDirectory: require('is-directory'),

  // npm
  resolvePkg: require('resolve-pkg'),

  // root fs
  mkdirp: require('mkdirp'),
  copySync,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync
})
