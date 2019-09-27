import {getCommandFromSanitized} from '../../core/lenses'
import {ResolverExtension} from '../../core/types'
import * as effects from './effects'
import * as github from './github'
import * as localPath from './local-path'
import * as nodeModule from './node-module'
import * as rm from './rm'

const RESOLVERS_LIST: ResolverExtension[] = [
  localPath,
  github,
  nodeModule,
  effects,
  rm
]

const getResolver = (componentString: string): ResolverExtension => {
  const resolverFound = RESOLVERS_LIST.find(resolver =>
    resolver.is(componentString)
  )
  if (!resolverFound)
    throw new Error(`${componentString} did not match any resolvers.
    Known resolvers:
    ${RESOLVERS_LIST.map(resolver => `* ${resolver.COMPONENT_TYPE}`).join('\n')}
    `)
  else return resolverFound
}

export const resolve = async (params, sanitizedComponent) => {
  const componentString: string = getCommandFromSanitized(sanitizedComponent)

  const resolver = getResolver(componentString)

  const resolved = await resolver.resolve(params, sanitizedComponent)

  return resolved
}

export default resolve
