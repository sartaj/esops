import {Run} from '../core/types'
// import {Esops} from '../core/types2'
import {configureSideEffects, log, fs, process} from '../side-effects'
import {pipe} from '../helpers/async'
import {
  resolveEsopsJson,
  resolvePath,
  normalizeStackShorthand,
  esopsConfigExists
} from '../steps/resolve'

import render from '../steps/parse'

const injectCommands = () => {}
const copyToDestination = () => {}

// const render = props => {}
const asyncSequence = (fn, sequence) => fn()

const resolveAndRenderRecursive = async ({
  commands,
  destination,
  tmpPath,
  variables,
  stack
}) => {
  const sequence = stack || (await resolveEsopsJson())
  const normalizedStack = normalizeStackShorthand(sequence)
  asyncSequence(async stack => {
    const pathOption = stack[0]
    const variablesOption = stack[1]
    const optionOption = stack[2]
    const resolvedPath = await resolvePath(pathOption)
    if (esopsConfigExists(resolvedPath))
      await resolveAndRenderRecursive({
        commands,
        destination,
        variables,
        stack,
        tmpPath
      })
    await render({commands, destination, variables, stack, renderPath: tmpPath})
  }, sequence)
}

const normalizeShorthand = () => {}
const runSequence = (...args) => {}
const branchIf = () => {}
const renderParellel = () => {}

const renderRecursive = async props => {
  props.infrastructure.forEach(async parallelSequence => {
    await process.sequence(async () => {
      await process.forkIf()
      await process.parallel()
    })
  })
}

const resolveAndRenderRecursivePiped = async ({
  commands,
  destination,
  tmpPath,
  variables
}) =>
  pipe(
    resolveEsopsJson,
    normalizeShorthand,
    process.sequence(process.forkIf(), process.parallel())
  )

export const esops2 = params =>
  pipe(
    injectCommands,
    fs.injectTempFolder,
    resolveAndRenderRecursive,
    fs.copyFromTempToDestination,
    fs.cleanUpTempFolder
  )(params).catch(log.crash)
