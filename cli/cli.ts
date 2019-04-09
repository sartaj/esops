#!/usr/bin/env node
import {cond, pipe, when} from 'ramda'
import * as path from 'path'

import {BadArgumentsMessage, CleanGuide, EsopsHowTo} from '../core/messages'
import {Conditional, defaultTo} from '../utilities/sync'
import {
  command,
  minimist,
  willAnnounce
} from '../side-effects/console/components/cli'

import run from '../'

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

const runApp: Conditional = defaultTo(commands => {
  const userRoot = commands._[0]
  const userDestination = commands._[1]
  const cwd = process.cwd()

  const root = path.resolve(cwd, userRoot || '')
  const destination = userDestination && path.resolve(cwd, userDestination)
  run({root, destination})
})

const onFlags = pipe(onOverwriteFlag)

const onCommand = cond([
  onHelp,
  onClean, //onNotFound,
  runApp
])

type CLI = (argv: string[]) => void
const cli: CLI = pipe(
  minimist,
  onFlags,
  onCommand
)

export default cli

const isRunningAsScript = require.main === module
isRunningAsScript && cli(process.argv.slice(2))
