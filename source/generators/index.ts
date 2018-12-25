import * as path from 'path'
import {GeneratorManifest} from '../core/types'
import fs from '../drivers/fs'
import log from '../drivers/console'
import {mergeDeepRight} from 'ramda'
import {
  FinalReport,
  ShowFilesToOverride,
  FilesNotOverwritten
} from '../messages'

import * as prompts from 'prompts'

/**
 * merge
 */

const tryJSON = contents => {
  try {
    return JSON.parse(contents)
  } catch (e) {
    return null
  }
}

export const merge = (generatorManifest: GeneratorManifest) => {
  generatorManifest
    .filter(manifest => manifest.willMerge)
    .forEach(manifest => {
      let finalWrite
      const contents = fs.readFileSync(manifest.fromPath, {encoding: 'utf-8 '})
      finalWrite = contents
      const cwdContents = manifest.fileExists
        ? fs.readFileSync(manifest.toPath, {
            encoding: 'utf-8 '
          })
        : false
      let json = tryJSON(contents)
      const cwdJson = tryJSON(cwdContents)
      if (json && cwdJson) {
        const updatedJson = mergeDeepRight(cwdJson, json)
        finalWrite = JSON.stringify(updatedJson)
      } else {
        throw new Error('to merge, both files must be json')
      }

      fs.writeFileSync(manifest.toPath, JSON.stringify(finalWrite))
    })
}

/**
 * Force Copy
 */
export const forceCopy = (generatorManifest: GeneratorManifest) => {
  generatorManifest.forEach(manifest => {
    fs.mkdirp.sync(manifest.toFolder)
    fs.forceCopy(manifest.fromPath, manifest.toPath)
  })
}

/**
 * Add To Gitignore
 */

// [How to exclude file only from root folder in Git](https://stackoverflow.com/a/3637678)
const addSlashForGitIgnore = relativePath => `/${relativePath}`

export const updateGitIgnore = generatorManifest => {
  const cwd = generatorManifest[0].cwd
  const gitignore = path.join(cwd, '.gitignore')
  if (fs.existsSync(gitignore)) {
    const ignoreFiles = generatorManifest
      .map(({relativePath}) => relativePath)
      .map(addSlashForGitIgnore)
      .join('\n')
    const startLine = '### ESOPS AUTO GENERATED BEGIN ###'
    const endLine = '### ESOPS AUTO GENERATED END ###'
    fs.updateGeneratedTextFs(startLine, endLine, ignoreFiles, gitignore)
    return true
  } else return false
}

/**
 * Add To NPM ignore
 */
export const updateNpmIgnore = generatorManifest => {
  const cwd = generatorManifest[0].cwd
  const npmignore = path.join(cwd, '.npmignore')
  if (fs.existsSync(npmignore)) {
    const ignoreFiles = generatorManifest
      .map(({relativePath}) => relativePath)
      .map(addSlashForGitIgnore)
      .join('\n')
    const startLine = '### ESOPS AUTO GENERATED BEGIN ###'
    const endLine = '### ESOPS AUTO GENERATED END ###'
    fs.updateGeneratedTextFs(startLine, endLine, ignoreFiles, npmignore)
    return true
  } else return false
}

const render = generatorManifest => {
  merge(generatorManifest)
  forceCopy(generatorManifest)
  const gitignoreUpdated = updateGitIgnore(generatorManifest)
  const npmignoreUpdated = updateNpmIgnore(generatorManifest)
  log.md(
    FinalReport({
      generatorManifest,
      gitignoreUpdated,
      npmignoreUpdated,
      cwd: generatorManifest[0].cwd
    })
  )
}

export default async (generatorManifest: GeneratorManifest): Promise<void> => {
  const filesExist =
    generatorManifest.filter(({fileExists}) => fileExists).length > 0
  if (filesExist) {
    log.md(ShowFilesToOverride({generatorManifest}))
    const {userConfirmsOverride} = await prompts([
      {
        type: 'toggle',
        name: 'userConfirmsOverride',
        message: 'These files will be overwritten. Is that ok?',
        initial: true,
        active: 'Yes',
        inactive: 'No'
      }
    ])
    if (userConfirmsOverride) render(generatorManifest)
    else log.md(FilesNotOverwritten())
  } else render(generatorManifest)
}
