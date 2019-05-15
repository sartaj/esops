import {ResolverFunc} from '../../../domain/types'

const PREFIX = 'react-native-cli'

export const COMPONENT_TYPE = 'REACT_NATIVE_CLI'

export const is = componentString => componentString === PREFIX

export const resolve: ResolverFunc = async (params, sanitizedComponent) => {
  try {
    const {
      effects: {ui, shell},
      parent
    } = params

    const resolveDirectory = await params.effects.filesystem.appCache.createNewCacheFolder()
    const renderDirectory = await params.effects.filesystem.appCache.getRenderPrepFolder()

    const variables = {
      AppName: `${parent.AppName || 'TestProject'}`,
      version: `${parent.version || '5.0.1'}`,
      template: `${parent.template || 'typescript'}`,
      resolveDirectory,
      renderDirectory,
      destination: params.destination,
      child: sanitizedComponent
    }

    /* Move to the resolution folder */
    shell.cd(variables.resolveDirectory)

    /* Check for dependencies */
    shell.exec(`command -v yarn || npm i -g yarn`)
    shell.exec(`command -v yo || npm i -g yo`)
    shell.exec(`command -v react-native-cli || npm i -g react-native-cli`)

    /* Making money moves */
    shell.exec(`react-native init ${variables.AppName}`, {
      cwd: `${variables.resolveDirectory}`
    })

    /* Move generated app to the root, like a normal react-native-cli app */
    shell.mv(
      `${variables.resolveDirectory}/${variables.AppName}/*`,
      `${variables.resolveDirectory}/${variables.AppName}/.*`,
      `${variables.resolveDirectory}/`
    )

    /* Clear things that are gitignored anyway */
    shell.rm('-rf', 'node_modules')

    /* Return resolved directory for consumption by renderer */
    return resolveDirectory
  } catch (e) {
    throw e
  }
}
