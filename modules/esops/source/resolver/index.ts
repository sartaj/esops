// import * as fs from 'fs-plus'
// import isDirectory from 'is-directory'
import * as path from 'path'

import process from '../drivers/process'
import fs from '../drivers/fs'

import {
  Resolve,
  ResolverOptions,
  NetworkTemplateOptions,
  LocalTemplateOptions
} from '../core/types'

// const resolveStackPackage = async (pkg, {cwd}) => {
//   try {
//     let modulePath = ''
//     if (!modulePath) modulePath = tryRelativePath(pkg, cwd)
//     // TODO: Node Module Paths
//     // if(!modulePath) modulePath = tryNodeModulePath(pkg, { cwd })
//     // TODO: Git URLS
//     // if(!modulePath) modulePath = tryGitUrl(pkg)
//     // TODO: Tarball/Zip paths
//     // if(!modulePath) modulePath = tryArchiveUrl(pkg)
//     return modulePath + '/'
//   } catch (e) {
//     console.error(e)
//     throw new Error('path resolution failed')
//   }
// }

// const getStackFilePaths = templatePath => {
//   const paths = fs.listTreeSync(templatePath)
//   // For now, only files are supported
//   // TODO: Explore need/use case for folder path support
//   const filePaths = paths.filter(filePath => !isDirectory.sync(filePath))
//   return filePaths
// }

// module.exports.getStackFilePaths = getStackFilePaths

// const tryRelativePath = (pkg, cwd) => {
//   const potentialPath = path.join(cwd, pkg)
//   return fs.existsSync(potentialPath) ? potentialPath : null
// }

// module.exports.tryRelativePath = tryRelativePath

// const fetchTemplate: FetchTemplate = async ({cwd}) => {
//   const possibleConfigPath = path.join(cwd, 'package.json')
//   try {
//     const stackManifest = fs.readFileSync(possibleConfigPath, 'utf-8')
//     return JSON.parse(stackManifest)
//   } catch (e) {
//     return []
//   }
// }

const convertToLocalOpts = (
  opts: NetworkTemplateOptions
): LocalTemplateOptions => ''

const resolve: Resolve = async (params: ResolverOptions) => ({
  cwd: params.cwd,
  opts: await convertToLocalOpts(params.opts)
})

export {resolve}

export default resolve
