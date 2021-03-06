import chalk from 'chalk'

import async from '../utilities/async'

export const CleanGuide = () => `## To Clean Files
To refresh your codebase, if you had a \`.gitignore\` and esops generated an ignore list there, you can remove files all \`.gitignore\`'d files [using a git command](https://stackoverflow.com/q/13541615) or a module like [remove-git-ignored](https://www.npmjs.com/package/remove-git-ignored).
`

export const EsopsHowTo = () => `## How To
Esops works by adding a valid stack config to \`esops.json\` or \`package.json\`.

A valid stack config will be a path to a directory you want to copy from.

### Configure esops in \`package.json\` or \`esops.json\`

#### in \`esops.json\`

\`\`\`json
"node:@my-org/my-stack/stack"
\`\`\`

#### in \`package.json\`

\`{ "esops": "node:@my-org/my-stack/stack" }\`

### Resolution Types

- _Filesystem:_ \`'./infrastructure'\`
- _Node Module:_ \`'node:@my-org/my-stack/stack'\`

### Run \`esops\`

If global, just run \`esops\`. If local, use \`npx esops\`. Files will be generated, and if you have a \`.gitignore\`, it will be updated to include the generated files.

`

const withHowTo = messageFunc => (args?: any) =>
  messageFunc(args) + '\n\n ••• \n' + EsopsHowTo()

export const InvalidOptsError = withHowTo(() =>
  chalk.red(`Your \`esops.json\` config is invalid.
Please add a valid config to \`esops.json\`.
`)
)

export const BadArgumentsMessage = withHowTo(({args}) =>
  chalk.red(`# Arguments Not Understood
The command \`esops ${args}\` was not valid.`)
)

export const StackConfig = opts => `# Stack Configuration
${typeof opts === 'string' ? opts : JSON.stringify(opts, null, 2)}`

export const NoPathError = withHowTo(({pathString, cwd}) =>
  chalk.red(`Path \`${pathString}\` ${chalk.red('not found')}.

${chalk.red.bold('## Current Working Directory')}

${cwd}`)
)

export const GitFetchFailed = ({pathString, message}) =>
  chalk.red(
    `Git fetching ${chalk.red('has failed with the following message:')}`
  ) +
  `

${message}

**Component**: \`${pathString}\`
`

export const FinalReport = ({
  gitignoreUpdated,
  npmignoreUpdated,
  generatorManifest,
  cwd
}) => `# Your Directory has Been Updated.

## Files Added

${generatorManifest
  .map(({relativePath}) => '* `' + relativePath + '`')
  .join('\n')}

## Current Working Directory
\`${cwd}\`

## Notes

${gitignoreUpdated ? '.gitignore has been updated.' : ''}
${npmignoreUpdated ? '.npmignore has been updated.' : ''}
`

export const FinalReport2 = ({
  generatedFiles,
  destination
}) => `# Your Destination has Been Updated.

## Files Added

${generatedFiles.map(relativePath => '* `' + relativePath + '`').join('\n')}

## Destination
\`${destination}\`

`

export const ConfigNotFound = withHowTo(({cwd}) =>
  chalk.red(`No esops.json found at ${cwd}`)
)

export const ShowFilesToOverwrite2 = files => `# Files To Be Overwritten
${files.map(relativePath => `* \`${relativePath}\``).join('\n')}
`

export const ShowFilesToOverwrite = ({
  generatorManifest
}) => `# Files To Be Overwritten
${generatorManifest
  .filter(({fileExists}) => fileExists)
  .map(({relativePath}) => `* \`${relativePath}\``)
  .join('\n')}
`

export const FilesNotOverwritten = () =>
  `Files not overwritten. Esops has exited.`

export const UserConfirmOverwriteMessage = () =>
  'These files will be overwritten. Is that OK?'

export const UserConfirmOverwriteMessageTrue = () => 'Yes'

export const UserConfirmOverwriteMessageFalse = () => 'No'

export const CWDNotDefined = withHowTo(() => chalk.red(`No cwd found.`))

export const FileNotToggledForMerge = manifest => `
 
File ${chalk.bold.red(
  manifest.relativePath
)} has already been generated by something else. To allow merge for 1 file, add a --merge flag to the command. 

To manage multiple, create one of the following merge files, \`.esops-merge-file\` or \`.esops-merge-json.\`

Every file with the same relative path needs to allow merge for merging to succeed.`

export const createReport = async.extend(async params => {
  const {
    destination,
    logLevel,
    effects: {filesystem, ui},
    filesWritten
  } = params
  if (!filesWritten) return false
  const renderPrepFolder = await filesystem.appCache.getRenderPrepFolder()
  const generatedFiles = filesystem
    .listTreeSync(renderPrepFolder)
    .map(file => filesystem.path.relative(renderPrepFolder, file))
    .sort()

  ui.md(
    FinalReport2({
      generatedFiles,
      destination
    }),
    logLevel
  )
  return true
})

export const reportWalkStart = async.extend(async ({effects: {ui}}) => {
  ui.info(ui.chalk.bold.blue('\ncomposing infrastructure...\n'))
})
