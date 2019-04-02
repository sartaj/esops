export const BRAND = 'esops'

export const PREFIX = `.${BRAND}-`

export const TOGGLE_FILES = [
  `${PREFIX}git-include`,
  `${PREFIX}npm-include`,
  `${PREFIX}merge`,
  `${PREFIX}template`,
  `.${BRAND}/${PREFIX}git-include`,
  `.${BRAND}/${PREFIX}npm-include`,
  `.${BRAND}/${PREFIX}merge`,
  `.${BRAND}/${PREFIX}template`
]

export const URL_COMPONENT_TYPE = 'URL'
export const PATH_COMPONENT_TYPE = 'PATH'
export const EFFECT_COMPONENT_TYPE = 'EFFECT'

export const NODE_PREFIX = 'node:'
export const GITHUB_PREFIX = 'github:'
export const GIT_URL_PREFIX = 'http'
export const SHELL_EFFECT_PREFIX = 'shell.'
export const FILESYSTEM_EFFECT_PREFIX = 'filesystem.'
export const LOCAL_RELATIVE_PATH_PREFIX = '.'
export const LOCAL_ABSOLUTE_PATH_PREFIX = '/'
