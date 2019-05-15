import {SanitizedComponent} from '../../../domain/types'
import {VariableError} from '../../../domain/errors'
import {
  parseVariables,
  parseComponentStringVariables
} from '../../../domain/parse-variables'

const EFFECT_COMPONENT_TYPE = 'EFFECT'
const SHELL_EFFECT_PREFIX = 'shell.'
const FILESYSTEM_EFFECT_PREFIX = 'filesystem.'
const isEffect = componentString =>
  componentString.startsWith(SHELL_EFFECT_PREFIX) ||
  componentString.startsWith(FILESYSTEM_EFFECT_PREFIX)

const runEffect = async (
  {
    effects: {
      shell,
      vm,
      filesystem: {path}
    }
  },
  effect
) => {
  vm.runInNewContext(effect, {shell, path})
}

export const resolveEffectComponent = async (
  params,
  sanitizedComponent: SanitizedComponent
) => {
  const componentString = sanitizedComponent[0]
  const resolveDirectory = await params.effects.filesystem.appCache.createNewCacheFolder()
  const renderDirectory = await params.effects.filesystem.appCache.getRenderPrepFolder()

  const variables = parseVariables({
    parent: params.parent,
    child: sanitizedComponent,
    destination: params.destination,
    resolveDirectory,
    renderDirectory
  })

  const [err, effect] = parseComponentStringVariables(
    componentString,
    variables
  )

  if (err) throw new VariableError(err)

  const effectWithTempDirectoryContext = `shell.cd('${resolveDirectory}'); ${effect}`

  await runEffect(params, effectWithTempDirectoryContext)

  return resolveDirectory
}

export const is = isEffect
export const COMPONENT_TYPE = EFFECT_COMPONENT_TYPE
export const resolve = resolveEffectComponent
