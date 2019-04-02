import * as createLogDriver from 'log-driver'

export {createLogDriver}
export {announce} from './components/announce'
export {crash, renderError} from './components/error'
export {md, mdFile} from './components/markdown'

export const getTabs = (tab: number): string =>
  new Array(tab).fill('    ').join('')
