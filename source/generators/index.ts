import fs from '../drivers/fs'
import * as path from 'path'
import {GeneratorManifest} from '../core/types'

const forceCopy = (generatorManifest: GeneratorManifest) => {
  generatorManifest.forEach(manifest => {
    fs.mkdirp.sync(manifest.toDir)
    fs.forceCopy(manifest.fromPath, manifest.toPath)
  })
}

// [How to exclude file only from root folder in Git](https://stackoverflow.com/a/3637678)
const addSlashForGitIgnore = relativePath => `/${relativePath}`

const updateGitIgnore = generatorManifest => {
  const cwd = generatorManifest[0].cwd
  const gitignore = path.join(cwd, '.gitignore')
  const ignoreFiles = generatorManifest
    .map(({relativePath}) => relativePath)
    .map(addSlashForGitIgnore)
    .join('\n')
  const startLine = '### ESOPS GITIGNORE AUTO GENERATED BEGIN ###'
  const endLine = '### ESOPS GITIGNORE AUTO GENERATED END ###'
  fs.updateGeneratedTextFs(startLine, endLine, ignoreFiles, gitignore)
}

export default (generatorManifest: GeneratorManifest): void => {
  forceCopy(generatorManifest)
  updateGitIgnore(generatorManifest)
}
