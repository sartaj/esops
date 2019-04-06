import generate from '../modules/generate'
import {
  parsedToManifest,
  resolveEsopsConfig,
  resolveStack
} from '../modules/parse'
import async from '../utilities/async'
import {throwError} from '../utilities/sync'

export const esops1 = async.pipe(
  resolveEsopsConfig,
  resolveStack,
  parsedToManifest,
  generate
)

export default esops1
