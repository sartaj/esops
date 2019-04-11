import async from '../utilities/async'
import {copyToDestinationWithPrompts} from './copy-to-destination'
import {createReport, reportWalkStart} from './messages'
import {Params} from './types'
import {walk, flattenWalkResults} from './walk-recursive'
import {withDefaultParams} from './with-default-params'

/**
 * Run
 */

export const run = (params: Params) =>
  async.pipe(
    withDefaultParams,
    reportWalkStart,
    walk,
    flattenWalkResults,
    copyToDestinationWithPrompts,
    createReport
  )(params)

export default run
