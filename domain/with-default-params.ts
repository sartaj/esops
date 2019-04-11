import {configIsObject} from './lenses'
import {findEsopsConfig} from './parser'

export const withDefaultParams = async params => {
  try {
    const {
      effects: {
        ui,
        filesystem: {path}
      }
    } = params
    const root = params.root || params.cwd

    if (!root) throw new TypeError('no root defined.')

    const rootConfig = await findEsopsConfig(params)(root)

    const destinationFromConfig =
      configIsObject(rootConfig) &&
      rootConfig.destination &&
      path.join(root, rootConfig.destination)

    const destination = params.destination || destinationFromConfig || root

    const paths = {
      root,
      parent: root,
      destination
    }

    params.prompts && ui.prompts.inject(params.prompts)

    return {
      ...params,
      treeDepth: 0,
      ...paths,
      results: []
    }
  } catch (e) {
    throw e
  }
}
