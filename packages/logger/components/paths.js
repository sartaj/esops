// TODO: Abstract to @esops/paths

const fs = require('fs')
const path = require('path')
const { md } = require('./markdown')
const { announce } = require('./announce')

const findInArray = (array, test) =>
  array.reduce((acc, next) => (test(next) ? [...acc, next] : acc), [])

const entryFileNotFoundTemplate = standardEntries => `# Entry file not found.

## Acceptable entries

* \`package.json\` \`main\` property
${standardEntries
  .map(entry => `* \`${entry}\`\n`)
  .reduce((acc, next) => `${acc}${next}`, '')}
`

module.exports.findEntryFile = (cwd, standardEntries) => {
  const entriesFound = findInArray(standardEntries, entry =>
    fs.existsSync(path.join(cwd, entry))
  )
  const entryFile = entriesFound[0]
  if (!entryFile) {
    md(entryFileNotFoundTemplate(standardEntries))
    process.exit(1)
  }
  // try {
  //   await callback(mkdirp, entryFile)
  // } catch (err) {
  //   if (err && err.code !== 'EEXIST') console.error(err)
  // }
  announce(`Entry File: ${entryFile}`)
  return entryFile
}
