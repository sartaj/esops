#!/usr/bin/env node

import run from './main'
import log from '../side-effects/console'
import {BadArgumentsMessage, EsopsHowTo, CleanGuide} from '../core/messages'
const argv = require('minimist')(process.argv.slice(2))

// --overwrite flag
if (argv.overwrite || argv.o) require('prompts').inject([true])

// `esops help`
if (argv._ && argv._[0] === 'help') {
  log.md(EsopsHowTo())
}

// `esops clean`
else if (argv._ && argv._[0] === 'clean') {
  log.md(CleanGuide())
}

// `esops unknown_command`
else if (argv._.length > 0) {
  log.md(BadArgumentsMessage({args: process.argv.slice(2)}))
}

// Run Esops
else {
  const cwd = process.cwd()
  run({cwd})
}
