#!/usr/bin/env node
import {cond, pipe, when} from 'ramda'

import {BadArgumentsMessage, CleanGuide, EsopsHowTo} from '../core/messages'
import {Conditional, defaultTo} from '../utilities/sync'
import {
  command,
  minimist,
  willAnnounce
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

const onFlags = pipe(onOverwriteFlag)

const onCommand = cond([onHelp, onClean, onNotFound, runApp])

type CLI = (argv: string[]) => void
const cli: CLI = pipe(
  minimist,
  onFlags,
  onCommand
)

export default cli

const isRunningAsScript = require.main === module
isRunningAsScript && cli(process.argv.slice(2))
