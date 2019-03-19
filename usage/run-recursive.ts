// const resolveAndRenderRecursive = async ({
//   commands,
//   destination,
//   tmpPath,
//   variables,
//   stack
// }) => {
//   const sequence = stack || (await resolveEsopsJson())
//   const normalizedStack = normalizeStackShorthand(sequence)
//   asyncSequence(async stack => {
//     const pathOption = stack[0]
//     const variablesOption = stack[1]
//     const optionOption = stack[2]
//     const resolvedPath = await resolvePath(pathOption)
//     if (esopsConfigExists(resolvedPath))
//       await resolveAndRenderRecursive({
//         commands,
//         destination,
//         variables,
//         stack,
//         tmpPath
//       })
//     await render({commands, destination, variables, stack, renderPath: tmpPath})
//   }, sequence)
// }
