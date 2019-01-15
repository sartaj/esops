import {is} from 'ramda'
import {Option, WithProps, Options, OptionsWithProps} from './types'
import {isString} from '../utils/sync'

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

export const createDefaultOpt = (path: string): WithProps => [path, {}]

export const convertAllOptionsToHaveProps = (opts: Options): OptionsWithProps =>
  isString(opts)
    ? [createDefaultOpt(opts)]
    : opts.map((opt: Option) => (isString(opt) ? createDefaultOpt(opt) : opt))

export const isValidOpts = opts => is(String, opts) || is(Array, opts)
