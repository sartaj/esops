import * as path from 'path'
import * as prompts from 'prompts'
import {mergeDeepRight} from 'ramda'

import {
  FilesNotOverwritten,
  FinalReport,
  ShowFilesToOverwrite,
  UserConfirmOverwriteMessage,
  UserConfirmOverwriteMessageFalse,
  UserConfirmOverwriteMessageTrue
} from '../core/messages'
import {GeneratorManifest} from '../core/types'
import * as log from '../side-effects/console'
import fs from '../side-effects/fs'

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
 * Add To Ignore Files
 */

// [How to exclude file only from root folder in Git](https://stackoverflow.com/a/3637678)
const addSlashForGitIgnore = relativePath => `/${relativePath}`

export const updateIgnoreFile = file => generatorManifest => {
  const cwd = generatorManifest[0].cwd
  const ignoreFile = path.join(cwd, file)
  if (fs.existsSync(ignoreFile)) {
    const ignorePaths = generatorManifest
      .map(({relativePath}) => relativePath)
      .map(addSlashForGitIgnore)
      .join('\n')
    const startLine = '### ESOPS AUTO GENERATED BEGIN ###'
    const endLine = '### ESOPS AUTO GENERATED END ###'
    fs.updateGeneratedTextFs(startLine, endLine, ignorePaths, ignoreFile)
    return true
  } else return false
}

export const updateGitIgnore = updateIgnoreFile('.gitignore')

export const updateNpmIgnore = updateIgnoreFile('.npmignore')

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
    log.md(ShowFilesToOverwrite({generatorManifest}))

    const {userConfirmsOverwrite} = await prompts([
      {
        type: 'toggle',
        name: 'userConfirmsOverwrite',
        message: UserConfirmOverwriteMessage(),
        initial: true,
        active: UserConfirmOverwriteMessageTrue(),
        inactive: UserConfirmOverwriteMessageFalse()
      }
    ])

    if (userConfirmsOverwrite) render(generatorManifest)
    else log.md(FilesNotOverwritten())
  } else render(generatorManifest)
}
