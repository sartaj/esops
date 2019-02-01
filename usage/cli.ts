#!/usr/bin/env node
import {pipe, when, cond} from 'ramda'

import {BadArgumentsMessage, CleanGuide, EsopsHowTo} from '../core/messages'
import {
  willAnnounce,
  command,
  minimist,
  defaultTo,
  Conditional
} from '../side-effects/console/components/cli'
import run from './main'

const onOverwriteFlag = when(command.hasFlag('overwrite', 'o'), argv => {
  require('prompts').inject([true])
  return argv
})

const onHelp: Conditional = [command.first('help'), willAnnounce(EsopsHowTo)]

const onClean: Conditional = [command.first('clean'), willAnnounce(CleanGuide)]

const onNotFound: Conditional = [
  command.notFound,
  args => willAnnounce(BadArgumentsMessage, {args: args._})()
]

const runApp: Conditional = defaultTo(() => {
  const cwd = process.cwd()
  run({cwd})
})

type CLI = (argv: string[]) => void
const cli: CLI = pipe(
  minimist,
  onOverwriteFlag,
  cond([onHelp, onClean, onNotFound, runApp])
)

export default cli

const isRunningAsScript = require.main === module
isRunningAsScript && cli(process.argv.slice(2))
