import async from '../utilities/async'
import {
  resolveEsopsConfig,
  resolveStack,
  parsedToManifest
} from '../modules/parse'
import generate from '../modules/generate'

export const esops1 = async.pipe(
  resolveEsopsConfig,
  resolveStack,
  parsedToManifest,
  generate
)

export default esops1
