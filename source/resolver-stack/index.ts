import {
  Resolve,
  Options,
  Option,
  LocalWithProps,
  OptionsWithProps,
  WithProps,
  CWD
} from '../core/types'
import {isString, pipe, throwIf} from '../utils'
import {fetchPath} from './resolver'

const createDefaultOpt = (path: string): WithProps => [path, {}]

type OptionPromises = Promise<LocalWithProps>

const createOptionPromise = (cwd: CWD, opt: WithProps): OptionPromises =>
  new Promise((resolve, reject) => {
    const path = opt[0]
    const props = opt[1]
    fetchPath(path, cwd)
      .then(path => {
        resolve([path, props])
      })
      .catch(reject)
  })

const defaultConfig = {
  cwd: process.cwd()
}

const convertAllOptionsToHaveProps = (opts: Options): OptionsWithProps =>
  isString(opts)
    ? [createDefaultOpt(opts)]
    : opts.map((opt: Option) => (isString(opt) ? createDefaultOpt(opt) : opt))

const throwError = e => {
  throw e
}

const resolve: Resolve = (opts, {cwd} = defaultConfig) =>
  pipe(
    convertAllOptionsToHaveProps,
    opts => opts.map(opt => createOptionPromise(cwd, opt).catch(throwError)),
    opts => Promise.all(opts).catch(throwError)
  )(opts).catch(throwError)

export {resolve}

export default resolve
