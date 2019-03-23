import async from '../helpers/async'
import {
  resolveEsopsConfig,
  resolveStack,
  parsedToManifest
} from '../steps/parse'
import generate from '../steps/generate'

export const esops1 = async.pipe(
  resolveEsopsConfig,
  resolveStack,
  parsedToManifest,
  generate
)

export default esops1
