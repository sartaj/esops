import * as path from 'path'

import fs from '../../drivers/fs'

export const getSortedFilePaths = dir =>
  fs
    .listTreeSync(dir)
    .sort()
    .map(abs => path.relative(dir, abs))

export const getGitignoreContents = dir =>
  fs.readFileSync(path.join(dir, '.gitignore'), {encoding: 'utf-8'})
