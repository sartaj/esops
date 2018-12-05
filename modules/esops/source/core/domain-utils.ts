// import R from 'ramda
// export const selectTemplatePath =
// export const selectTemplateOpts
import {Options} from './types'

export const isString = opts => typeof opts === 'string'

export const isWithProps = opt =>
  Array.isArray(opt) &&
  opt.length === 2 &&
  typeof opt[1] === 'string' &&
  typeof opt[2] === 'object'

export const selectTemplatePaths = (opts: Options): Options => {
  if (isString(opts)) return opts
  return opts
  // return opts.map(item => isWithProps(item) ? )
}
