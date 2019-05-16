import ignore from 'ignore'

const ESOPS_TOGGLE_FILES = [
  '.esops-publish-git',
  '.esops-merge-json',
  '.esops-merge-file'
]

export const resolveToggles = params => async files => {
  const {filesystem, ui} = params.effects

  const filterForToggleFiles = fileInComponent =>
    ESOPS_TOGGLE_FILES.some(
      file => file === filesystem.path.basename(fileInComponent)
    )

  const toggleFiles = files.filter(filterForToggleFiles)
  const filesWithoutToggles = files.filter(f => !filterForToggleFiles(f))

  const toggles = toggleFiles
    .map(toggleFile => {
      const toggles = filesystem.readFileSync(toggleFile, 'utf-8').split('\n')
      const key = filesystem.path.basename(toggleFile)
      return {
        [key]: toggles
      }
    })
    .reduce((acc, next) => ({...acc, ...next}), {})
  return {filesWithoutToggles, toggles}
}

const shouldInclude = (toggles, file) =>
  ignore()
    .add(toggles)
    .ignores(file)

export const checkIfShouldMergeJson = (togglesMap, file) => {
  const toggles = togglesMap['.esops-merge-json']
  const shouldMergeJson = shouldInclude(toggles, file)
  return {
    shouldMergeJson,
    mergeJsonArrays: []
  }
}

export const checkIfShouldMergeFile = (togglesMap, file) => {
  const toggles = togglesMap['.esops-merge-file']
  const shouldMergeFile = shouldInclude(toggles, file)
  return {
    shouldMergeFile
  }
}

export const checkIfShouldGitPublish = (togglesMap, file) => {
  const toggles = togglesMap['.esops-publish-git']
  const shouldGitPublish = shouldInclude(toggles, file)
  return {
    shouldGitPublish
  }
}
