import {ResolverFunc} from '../../../core/types'
import {getCommandFromSanitized} from '../../../core/lenses'

const PREFIX = 'rm'

export const COMPONENT_TYPE = 'SHELL_REMOVE'

const parse = componentString => componentString.split(' ').slice(1)

export const is = (componentString: string) =>
  componentString.startsWith(PREFIX)

export const resolve: ResolverFunc = async (params, sanitizedComponent) => {
  try {
    const {
      effects: {shell}
    } = params

    const resolveDirectory = await params.effects.filesystem.appCache.createNewCacheFolder()
    const renderDirectory = await params.effects.filesystem.appCache.getRenderPrepFolder()
    const cwd = renderDirectory
    const componentString = getCommandFromSanitized(sanitizedComponent)

    /* Get all args that could be used by shell */
    const rmArgs = parse(componentString)

    /* Delete */
    const lastPwd = shell.pwd()
    shell.cd(cwd)
    shell.rm(rmArgs)
    shell.cd(lastPwd)

    /* Return empty resolved directory for consumption by renderer, as all resolves must return a path */
    return resolveDirectory
  } catch (e) {
    throw new Error('Removal failed')
  }
}
