import * as l from './components'

const logger =
  process.env.NODE_ENV === 'test'
    ? {
        announce: () => {},
        info: () => {},
        md: () => {},
        renderError: () => {}
      }
    : l

export default logger
