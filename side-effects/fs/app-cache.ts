import * as tmp from 'tmp'
const os = require('os')
const fs = require('fs')
const rimraf = require('fs')
const path = require('path')

const mkdirSync = (...paths: string[]) => {
  const dir: string = path.join.apply(null, paths)
  !fs.existsSync(dir) && fs.mkdirSync(dir, 0o744)
  return dir
}

const id = (): string => Date.now().toString()

export const createAppCache = () => {
  const tempDir: {name: string; removeCallback: any} = tmp.dirSync()

  const cachePath = mkdirSync(tempDir.name, 'cache')

  const renderPrepContainer = mkdirSync(tempDir.name, 'render-prep')

  return {
    getCacheFolder: async () => cachePath,
    createNewCacheFolder: async name => mkdirSync(cachePath, name || id()),
    getRenderPrepFolder: async () => mkdirSync(renderPrepContainer, id()),
    deleteRenderPrep: async () => rimraf(renderPrepContainer)
  }
}

export default createAppCache
