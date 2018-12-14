import {
  Resolve,
  ResolverOptions,
  Options,
  ParserOptions,
  Option,
  LocalWithProps,
  OptionsWithProps,
  WithProps,
  CWD,
  LocalOptionsWithProps
} from '../core/types'
import {isString, pipe, curry, tryCatch} from '../utils'
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

const resolve: Resolve = (opts, {cwd} = defaultConfig) =>
  pipe(
    convertAllOptionsToHaveProps,
    opts => opts.map(opt => createOptionPromise(cwd, opt)),
    opts => Promise.all(opts)
  )(opts)

// const resolve: Resolve = async ({
//   cwd,
//   opts
// }: ResolverOptions): Promise<ParserOptions> => ({
//   cwd,
//   opts: await pipe(
//     convertAllOptionsToHaveProps,
//     opts => opts.map(opt => createOptionPromise(cwd, opt)),
//     opts => Promise.all(opts)
//   )(opts)
// })

export {resolve}

export default resolve
