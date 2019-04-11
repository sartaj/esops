import async from '../utilities/async'
import {createReport, reportWalkStart} from './messages'
import {copyToDestinationWithPrompts} from './render'
import {Params} from './types'
import {walk} from './walk'
import {withDefaultParams} from './with-default-params'

/**
 * Run
 */

export const run = (params: Params) =>
  async.pipe(
    withDefaultParams,
    reportWalkStart,
    walk,
    copyToDestinationWithPrompts,
    createReport
  )(params)

export default run
