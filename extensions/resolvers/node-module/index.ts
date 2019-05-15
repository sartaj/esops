import * as resolvePkg from 'resolve-pkg'
import {getCommand, getCommandFromSanitized} from '../../../domain/lenses'
import {CWDNotDefined} from '../../../domain/messages'
import async from '../../../utilities/async'

const NODE_PREFIX = 'node:'
const NODE_COMPONENT_TYPE = 'NODE'

const isNodeResolver = componentString =>
  componentString.startsWith(NODE_PREFIX)

const tryNodePath = async (pathString, opts) => {
  try {
    return resolvePkg(pathString, opts)
  } catch (e) {
    throw e
  }
}

/**
 * ## Resolvers
 */
export const resolveNodeModule = async (params, sanitizedComponent) => {
  try {
    const {
      effects: {ui},
      parent
    } = params
    const componentString: string = getCommandFromSanitized(sanitizedComponent)
    const parentPath = getCommand(parent)
    const tab = ui.getTabs(params.treeDepth)
    if (!parentPath) throw new TypeError(CWDNotDefined())
    return async.result(tryNodePath(componentString, {cwd: parentPath}))
  } catch (e) {
    throw e
  }
}

export const is = isNodeResolver
export const COMPONENT_TYPE = NODE_COMPONENT_TYPE
export const resolve = resolveNodeModule
