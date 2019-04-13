import {Params, SanitizedComponent} from './types'
import {Try} from '../utilities/sync'
import {VariableError} from './errors'
import {generateTemplateString} from './parse-variables'

const runEffect = ({shell}, effect) => {
  console.log('effect', effect)
  eval(effect)
}

export const renderEffectComponent = (
  params: Params,
  sanitizedComponent: SanitizedComponent
) => {
  const componentString = sanitizedComponent[0]
  const variables = sanitizedComponent[1]
  // params.effects.ui.info({componentString})
  // params.effects.ui.info({variables})
  const [err, effect] = Try(() =>
    generateTemplateString(componentString)(variables)
  )

  if (err) throw new VariableError(err)
  const shell = params.effects.shell
  runEffect({shell}, effect)
  return true
}
