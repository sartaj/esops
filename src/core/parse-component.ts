import {SanitizedComponent} from './types'
import * as minimist from 'minimist'

export const parseCLIStyleComponentOptions = (
  sanitizedComponent: SanitizedComponent
): SanitizedComponent => {
  const processed = minimist(sanitizedComponent[0].split(' '))
  if (processed._.filter(s => s).length > 1)
    throw new TypeError(
      `${sanitizedComponent} has too many commands. Each line can only do 1 command, and options follow cli syntax.`
    )
  return [
    processed._[0],
    sanitizedComponent[1],
    {
      ...sanitizedComponent[2],
      ...processed
    }
  ]
}
