/**
 * Add To Ignore Files
 */
export const updateIgnoreFile = ignoreFilename => filesystem => destination => filesToNotIgnore => copyManifest => {
  const ignoreFile = filesystem.path.join(destination, ignoreFilename)

  // [How to exclude file only from root folder in Git](https://stackoverflow.com/a/3637678)
  const addSlashForGitIgnore = relativePath => `/${relativePath}`

  const commentOutIfShouldPublish = relativePath =>
    filesToNotIgnore.includes(relativePath.substr(1)) // substr(1) to remove added slash on previous mapping
      ? `#shouldPublish:${relativePath}`
      : relativePath

  if (filesystem.existsSync(ignoreFile)) {
    const ignorePaths = copyManifest
      .map(({relativePath}) => relativePath)
      .filter(relativePath => {
        // Don't add self
        const pathName = filesystem.path.basename(relativePath)
        return pathName !== ignoreFilename
      })
      .map(addSlashForGitIgnore)
      .map(commentOutIfShouldPublish) // the comment can be used later for deleting generated files
      .sort()
      .join('\n')

    const startLine = '### ESOPS AUTO GENERATED BEGIN ###'
    const endLine = '### ESOPS AUTO GENERATED END ###'
    filesystem.updateGeneratedTextFs(
      startLine,
      endLine,
      ignorePaths,
      ignoreFile
    )
    return true
  } else return false
}

export const updateGitIgnore = updateIgnoreFile('.gitignore')

export const updateNpmIgnore = updateIgnoreFile('.npmignore')
