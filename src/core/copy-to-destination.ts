import {Params} from './../core/types'
import async from '../utilities/async'
import {
  FilesNotOverwritten,
  ShowFilesToOverwrite2,
  UserConfirmOverwriteMessage,
  UserConfirmOverwriteMessageFalse,
  UserConfirmOverwriteMessageTrue
} from './messages'
import {updateGitIgnore, updateNpmIgnore} from './update-ignore-file'

/**
 * Copy To Destination
 */
export const copyToDestination = async.extend(async params => {
  const {effects, destination} = params
  const {filesystem} = effects
  const renderPrepFolder = await filesystem.appCache.getRenderPrepFolder()

  const filesToCopy = await filesystem
    .listTreeSync(renderPrepFolder)
    .filter(filePath => !filesystem.isDirectory.sync(filePath))

  const copyManifest = filesToCopy.map(filePath => {
    const relativePath = filesystem.path.relative(renderPrepFolder, filePath)
    return {
      relativePath,
      fromPath: filePath,
      toPath: filesystem.path.join(destination, relativePath)
    }
  })

  const filesToGitPublish = params.results
    .filter(({shouldGitPublish}) => shouldGitPublish)
    .map(({relativePath}) => relativePath)

  const filesToNpmPublish = params.results
    .filter(({shouldNpmPublish}) => shouldNpmPublish)
    .map(({relativePath}) => relativePath)

  updateGitIgnore(filesystem)(renderPrepFolder)(filesToGitPublish)(copyManifest)
  updateNpmIgnore(filesystem)(renderPrepFolder)(filesToNpmPublish)(copyManifest)

  copyManifest.forEach(({fromPath, toPath}) => {
    filesystem.forceCopy(fromPath, toPath)
  })

  return {copyManifest}
})

export const copyToDestinationWithPrompts = async.extend(
  async (params: Params) => {
    const {effects, destination} = params
    const {filesystem, ui} = effects
    const renderPrepFolder = await filesystem.appCache.getRenderPrepFolder()

    ui.trace(`prepping copy to destination`)

    const filesToCopy = await filesystem
      .listTreeSync(renderPrepFolder)
      .filter(filePath => !filesystem.isDirectory.sync(filePath))
      .map(filePath => filesystem.path.relative(renderPrepFolder, filePath))

    ui.trace(`from ${renderPrepFolder}`)
    ui.trace(`to ${destination}`)
    ui.trace(
      `files to copy:
      ${filesToCopy.join('\n')}`
    )

    const destinationFiles = await filesystem
      .listTreeSync(destination)
      .filter(filePath => !filesystem.isDirectory.sync(filePath))
      .map(filePath => filesystem.path.relative(destination, filePath))

    const existingFiles = filesToCopy.filter(filePath =>
      destinationFiles.includes(filePath)
    )

    const filesExist = existingFiles.length > 0

    if (filesExist) {
      ui.md(ShowFilesToOverwrite2(existingFiles))

      const {userConfirmsOverwrite} = await ui.prompts<{
        userConfirmsOverwrite: boolean
      }>([
        {
          type: 'toggle',
          name: 'userConfirmsOverwrite',
          message: UserConfirmOverwriteMessage(),
          initial: true,
          active: UserConfirmOverwriteMessageTrue(),
          inactive: UserConfirmOverwriteMessageFalse()
        }
      ])

      if (userConfirmsOverwrite) {
        copyToDestination(params)
        return {destinationUpdated: true}
      } else {
        ui.md(FilesNotOverwritten())
        return {destinationUpdated: false}
      }
    } else {
      copyToDestination(params)
      return {destinationUpdated: false}
    }
  }
)
