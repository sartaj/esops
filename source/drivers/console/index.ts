import * as l from './components'

const logger =
  process.env.NODE_ENV === 'test'
    ? {
        announce: () => {},
        info: () => {},
        error: () => {},
        md: () => {}
      }
    : l

export default logger
