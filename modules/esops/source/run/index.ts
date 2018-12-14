import {pipe} from '../utils'
import {EsopsRun, Resolve} from '../core/types'
import resolve from '../resolver'
export const esops: EsopsRun = pipe(
  resolve
  // parse,
  // TODO: validate,
  // generate,
)

export default esops
