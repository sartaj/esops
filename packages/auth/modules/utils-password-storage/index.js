// source: semantic-release-cli/src/lib/password-storage.js

const log = require('npmlog')

const APP_NAME = 'esops'

module.exports = function(service) {
  try {
    const keytar = require('keytar')
    const key = `${APP_NAME}:${service}`
    return {
      get: username => keytar.getPassword(key, username),
      set: (username, password) => keytar.setPassword(key, username, password)
    }
  } catch (err) {
    return {
      get: () => {},
      set: () =>
        log.warn('keytar is not installed correctly, not saving password')
    }
  }
}
