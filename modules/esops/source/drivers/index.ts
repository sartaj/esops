export {default as fs} from './fs/index'
export {default as console} from './console/index'

export const throwError = message => e => {
  console.error(e)
  throw new Error(message)
}
