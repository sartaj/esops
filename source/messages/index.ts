export const InvalidOptsError = () => `Your stack has not been defined.
Please add a stack config to \`esops.json\` or \`package.json\``

export const StackConfig = opts => `# Stack Configuration
${typeof opts === 'string' ? opts : JSON.stringify(opts, null, 2)}`

export const NoPathError = ({
  pathString,
  cwd
}) => `Path \`${pathString}\` not found.

## Current Working Directory
\`${cwd}\`.

Allowed paths include:

- fs paths: \`'./infrastructure'\`
- node paths: \`'node:@myorg/my-stack/stack'\`
`

export const FinalReport = ({
  gitignoreUpdated,
  filesUpdated,
  cwd
}) => `# Your Directory has Been Updated.

## Files Added

${filesUpdated}

## Current Working Directory
\`${cwd}\`

## Notes

${gitignoreUpdated ? '.gitignore has been updated.' : ''}
`
