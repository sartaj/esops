import {getCommandFromSanitized} from '../../domain/lenses'
import {ResolverFunc} from '../../domain/types'
import {NoPathError} from '../../domain/messages'
import * as effects from './effects'
import * as github from './github'
import * as localPath from './local-path'
import * as nodeModule from './node-module'

const UNKNOWN_COMPONENT_TYPE = 'UNKNOWN'

const getComponentType = (componentString: string) =>
  github.is(componentString)
    ? github.COMPONENT_TYPE
    : localPath.is(componentString)
    ? localPath.COMPONENT_TYPE
    : nodeModule.is(componentString)
    ? nodeModule.COMPONENT_TYPE
    : effects.is(componentString)
    ? effects.COMPONENT_TYPE
    : UNKNOWN_COMPONENT_TYPE

export const resolvers = {
  [effects.COMPONENT_TYPE]: effects.resolve,
  [github.COMPONENT_TYPE]: github.resolve,
  [localPath.COMPONENT_TYPE]: localPath.resolve,
  [nodeModule.COMPONENT_TYPE]: nodeModule.resolve
}

export const resolve = async (params, sanitizedComponent) => {
  const {parent} = params
  const componentString: string = getCommandFromSanitized(sanitizedComponent)
  const parentPath = getCommandFromSanitized(parent)
  const componentType = getComponentType(componentString)

  if (componentType === 'UNKNOWN')
    throw new TypeError(NoPathError({componentString, cwd: parentPath}))

  const resolver: ResolverFunc = resolvers[componentType]

  const resolved = await resolver(params, sanitizedComponent)

  return resolved
}

export default resolve
