import * as fs from 'fs'
import * as path from 'path'
import {getCommand, getCommandFromSanitized} from '../../../domain/lenses'
import {NoPathError} from '../../../domain/messages'

const LOCAL_PATH_COMPONENT_TYPE = 'PATH'
const LOCAL_RELATIVE_PATH_PREFIX = '.'
const LOCAL_ABSOLUTE_PATH_PREFIX = '/'
const isLocalPath = componentString =>
  componentString.startsWith(LOCAL_RELATIVE_PATH_PREFIX) ||
  componentString.startsWith(LOCAL_ABSOLUTE_PATH_PREFIX)

export const tryFSPath = (pkg, {cwd}) => {
  try {
    const potentialPath = path.join(cwd, pkg)
    return fs.existsSync(potentialPath) ? potentialPath : null
  } catch (e) {
    throw e
  }
}

export const resolveLocalPath = async (params, sanitizedComponent) => {
  try {
    const {parent} = params
    const componentString = getCommandFromSanitized(sanitizedComponent)
    const parentPath = getCommand(parent)

    const resolvedPath = await tryFSPath(componentString, {cwd: parentPath})

    if (!resolvedPath) {
      throw new TypeError(
        NoPathError({pathString: componentString, cwd: parentPath})
      )
    } else return resolvedPath
  } catch (e) {
    throw e
  }
}

export const is = isLocalPath
export const COMPONENT_TYPE = LOCAL_PATH_COMPONENT_TYPE
export const resolve = resolveLocalPath
