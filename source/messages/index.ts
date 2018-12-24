export const InvalidOptsError = () => `Your stack definition is invalid.
Please add a a valid stack config to \`esops.json\` or \`package.json\`.

A valid stack config will be a path to a directory you want to copy from.

## Valid stack config

- *Filesystem:* \`['./infrastructure']\`
- *Node Module:* \`['node:@myorg/my-stack/stack']\`

`

export const StackConfig = opts => `# Stack Configuration
${typeof opts === 'string' ? opts : JSON.stringify(opts, null, 2)}`

export const NoPathError = ({
  pathString,
  cwd
}) => `Path \`${pathString}\` not found.

## Current Working Directory
\`${cwd}\`

## Valid stack config

- *Filesystem:* \`['./infrastructure']\`
- *Node Module:* \`['node:@myorg/my-stack/stack']\`
`

export const FinalReport = ({
  gitignoreUpdated,
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
`
