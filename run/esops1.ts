import async from '../helpers/async'
import {
  resolveEsopsConfig,
  resolveStack,
  parsedToManifest
} from '../parser/parse'
import generate from '../renderer/generate'

export const esops1 = async.pipe(
  resolveEsopsConfig,
  resolveStack,
  parsedToManifest,
  generate
)

export default esops1
