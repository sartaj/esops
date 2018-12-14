// import R from 'ramda
// export const selectTemplatePath =
// export const selectTemplateOpts
import {is} from 'ramda'
import {Option} from './types'

export const isWithProps = opt =>
  Array.isArray(opt) &&
  opt.length === 2 &&
  typeof opt[1] === 'string' &&
  typeof opt[2] === 'object'

export const getPath = (opt: Option) =>
  is(String, opt)
    ? opt
    : is(String, opt[0])
    ? opt[0]
    : new TypeError(`${JSON.stringify(opt)} is not an object`)
