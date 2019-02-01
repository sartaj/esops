import * as minimist from 'minimist'
import * as R from 'ramda'

import {md} from './markdown'

const minimistArgIs = R.curry(
  (index, command, argv) => argv._ && argv._[index] === command
)

export const command = {
  first: minimistArgIs(0),
  second: minimistArgIs(1),
  notFound: argv => argv._.length > 0,
  hasFlag: (...args) =>
    R.pipe(
      argv => args.filter(arg => argv[arg]),
      R.isEmpty,
      R.not
    )
}

export const willAnnounce = (Message, props = {}) => () => {
  md(Message(props))
}

export {minimist}
