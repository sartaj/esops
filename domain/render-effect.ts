import {Params, SanitizedComponent} from './types'
import {VariableError} from './errors'
import {parseVariables, parseComponentStringVariables} from './parse-variables'
// import {renderPathComponent} from './render'

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
  // const effectComponent = [
  //   resolveDirectory,
  //   sanitizedComponent[1],
  //   sanitizedComponent[2]
  // ]

  // const results = await renderPathComponent(params, effectComponent)
  // return results
}
