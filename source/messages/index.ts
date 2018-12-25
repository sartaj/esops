export const EsopsHowTo = () => `## How To
Esops works by adding a valid stack config to \`esops.json\` or \`package.json\`.

A valid stack config will be a path to a directory you want to copy from.

### Configure esops in \`package.json\` or \`esops.json\`

#### in \`esops.json\`

\`\`\`json
["./infrastructure"]
\`\`\`

#### in \`package.json\`

\`{ "esops": "./infrastructure" }\` or \`{ "esops": ["./infrastructure"] }\`

### Resolution Types

- _Filesystem:_ \`['./infrastructure']\`
- _Node Module:_ \`['node:@myorg/my-stack/stack']\`

### Run \`esops\`

If global, just run \`esops\`. If local, use \`npx esops\`. Files will be generated, and if you have a \`.gitignore\`, it will be updated to include the generated files.

`

export const InvalidOptsError = () => `Your stack definition is invalid.
Please add a a valid stack config to \`esops.json\` or \`package.json\`.

A valid stack config will be a path to a directory you want to copy from.

${EsopsHowTo()}

`
export const BadArgumentsMessage = ({args}) => `# Arguments Not Understood
The command \`esops ${args.join(' ')}\` was not valid.
  ${EsopsHowTo()}
`

export const StackConfig = opts => `# Stack Configuration
${typeof opts === 'string' ? opts : JSON.stringify(opts, null, 2)}`

export const NoPathError = ({
  pathString,
  cwd
}) => `Path \`${pathString}\` not found.

## Current Working Directory
\`${cwd}\`

${EsopsHowTo()}
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

export const ConfigNotFound = ({cwd}) => `
No config found.

## Current Working Directory

\`${cwd}\`

${EsopsHowTo()}
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
