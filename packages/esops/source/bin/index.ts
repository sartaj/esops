#!/usr/bin/env node

import run from '../run/index'
import fs from '../drivers/fs'

export default () => {
  const cwd = process.cwd()
  const {esops} = fs.readPkg.sync(cwd)
  run({opts: esops, cwd})
}
